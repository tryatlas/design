/**
 * The checkpoint trace's arithmetic, kept out of React so it can be tested on
 * its own: the time scale (time → x and back), the axis ticks, the clustering
 * of checkpoints that would overlap at a zoom, the rows (lanes and their
 * groups), and keyboard movement between marks.
 *
 * Nothing here touches the DOM. Times are epoch milliseconds inside; the
 * public types take ISO strings, as both apps' wire shapes do.
 */
import { hueFor } from "../../lib/hue.js";
/** What a checkpoint is called: its title, else its short sha. */
export function checkpointTitle(c, fallback = "Checkpoint") {
    return c.title || (c.sha ? c.sha.slice(0, 7) : fallback);
}
/** Finest first: zooming in moves left along this list. */
export const TRACE_ZOOMS = ["hour", "day", "week"];
export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
/**
 * How many pixels an hour is at each zoom. `week` fits a working week of
 * days in about a thousand pixels; `day` fits a working day in a laptop's
 * track; `hour` gives fifteen minutes sixty pixels, room for a node every
 * five minutes before they gather into a count.
 */
export const PX_PER_HOUR = { hour: 240, day: 40, week: 6 };
/** One zoom step's worth of time: what pulling past an end asks for. */
export const ZOOM_SPAN = { hour: 6 * HOUR, day: DAY, week: 7 * DAY };
export function toMs(time) {
    return typeof time === "number" ? time : new Date(time).getTime();
}
/**
 * A linear scale from `[from, to]` onto `[0, width]` at the zoom's density.
 * `minWidth` stretches `to` so a short range still fills the track: a trace
 * of one morning at week zoom would otherwise be a stub with a blank field
 * beside it.
 */
export function timeScale(range, zoom, minWidth = 0) {
    const pxPerMs = PX_PER_HOUR[zoom] / HOUR;
    const from = range.from;
    const to = Math.max(range.to, from + minWidth / pxPerMs);
    return {
        from,
        to,
        pxPerMs,
        width: Math.ceil((to - from) * pxPerMs),
        x: (t) => (t - from) * pxPerMs,
        t: (x) => from + x / pxPerMs,
    };
}
/** Local midnight at or before `t`. */
export function startOfDay(t) {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
/** Local hour start at or before `t`. */
export function startOfHour(t) {
    const d = new Date(t);
    d.setMinutes(0, 0, 0);
    return d.getTime();
}
/**
 * The range a trace covers when the host gives none: from the earliest start
 * to the latest of now, every end and every checkpoint, padded and snapped to
 * the zoom's unit so the axis begins on a label rather than mid-hour.
 */
export function extentOf(sessions, now, zoom) {
    let from = Infinity;
    let to = -Infinity;
    for (const s of sessions) {
        const start = toMs(s.startedAt);
        const end = s.endedAt ? toMs(s.endedAt) : now;
        from = Math.min(from, start);
        to = Math.max(to, end, start);
        for (const c of s.checkpoints) {
            const at = toMs(c.at);
            from = Math.min(from, at);
            to = Math.max(to, at);
        }
    }
    if (!Number.isFinite(from)) {
        from = now - ZOOM_SPAN[zoom];
        to = now;
    }
    to = Math.max(to, Math.min(now, to + ZOOM_SPAN[zoom]));
    if (zoom === "hour")
        return { from: startOfHour(from - HOUR), to: startOfHour(to + 2 * HOUR) };
    if (zoom === "day")
        return { from: startOfHour(from - 3 * HOUR), to: startOfHour(to + 4 * HOUR) };
    return { from: startOfDay(from), to: startOfDay(to) + DAY };
}
/** The minor step and how many minors between labels, per zoom. */
const TICK_STEP = {
    hour: { minutes: 15, labelEvery: 1 },
    day: { minutes: 60, labelEvery: 3 },
    week: { minutes: 360, labelEvery: 0 },
};
/**
 * The ticks inside `[x0, x1]` (px), aligned to local time: quarter hours at
 * `hour`, hours at `day`, six-hour marks at `week`. Only the visible window is
 * asked for, so a month at hour zoom is a few dozen ticks, not three thousand.
 */
export function axisTicks(scale, zoom, x0 = 0, x1 = scale.width) {
    const { minutes, labelEvery } = TICK_STEP[zoom];
    const lo = Math.max(scale.from, scale.t(x0));
    const hi = Math.min(scale.to, scale.t(x1));
    const cursor = new Date(lo);
    cursor.setSeconds(0, 0);
    if (minutes < 60)
        cursor.setMinutes(Math.floor(cursor.getMinutes() / minutes) * minutes);
    else {
        cursor.setMinutes(0);
        const hours = minutes / 60;
        cursor.setHours(Math.floor(cursor.getHours() / hours) * hours);
    }
    const ticks = [];
    // Bounded, so a malformed range can never spin.
    for (let guard = 0; cursor.getTime() <= hi && guard < 5000; guard++) {
        const t = cursor.getTime();
        if (t >= lo) {
            const midnight = cursor.getHours() === 0 && cursor.getMinutes() === 0;
            const major = zoom === "hour" ? cursor.getMinutes() === 0 : midnight;
            const labelled = major ||
                (labelEvery > 0 &&
                    (zoom === "hour"
                        ? true
                        : cursor.getHours() % ((labelEvery * minutes) / 60) === 0 &&
                            cursor.getMinutes() === 0));
            ticks.push({ t, x: scale.x(t), major, labelled });
        }
        if (minutes < 60)
            cursor.setMinutes(cursor.getMinutes() + minutes);
        else
            cursor.setHours(cursor.getHours() + minutes / 60);
    }
    return ticks;
}
/* ── Clustering ────────────────────────────────────────────────────────── */
/** A checkpoint node's diameter, and the least air between two marks. */
export const NODE = 16;
export const MARK_GAP = 4;
/** A count pill's width: a face, the digits, and padding. */
export function pillWidth(count) {
    return NODE + 8 + String(count).length * 6;
}
/**
 * Greedy, left to right: a point joins the mark before it when its node would
 * land within `gap` of that mark's drawn edge. A mark of several is drawn as a
 * pill spanning its first to last member (at least wide enough for its
 * count), so a burst stays as long as the time it took, and the next mark is
 * always `gap` clear of it: nothing overlaps at any zoom.
 */
export function clusterMarks(points, { node = NODE, gap = MARK_GAP, widthOf = pillWidth } = {}) {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const marks = [];
    // A mark's left edge is its first member's node edge, and a pill wider
    // than its span grows to the right only: centring it would push it back
    // over the mark before, which was placed against this edge.
    const close = (m) => {
        const span = m.last - m.first + node;
        const width = m.members.length > 1 ? Math.max(span, widthOf(m.members.length)) : node;
        m.left = m.first - node / 2;
        m.right = m.left + width;
        m.x = (m.left + m.right) / 2;
    };
    for (const p of sorted) {
        const prev = marks.at(-1);
        if (prev && p.x - node / 2 < prev.right + gap) {
            prev.members.push(p.item);
            prev.last = p.x;
            close(prev);
            continue;
        }
        const mark = {
            key: p.key,
            members: [p.item],
            x: p.x,
            left: 0,
            right: 0,
            first: p.x,
            last: p.x,
        };
        close(mark);
        marks.push(mark);
    }
    return marks;
}
const NO_GROUP = "\u0000none";
/**
 * Lanes newest-first (the live work is on the first screen), split into
 * groups ordered by their newest lane. Sessions with no project, or no owner,
 * gather in one group at the end.
 */
export function buildRows(sessions, groupBy, names) {
    const lanes = [...sessions].sort((a, b) => toMs(b.startedAt) - toMs(a.startedAt));
    if (groupBy === "none")
        return lanes.map((session) => ({
            kind: "lane",
            key: `lane:${session.id}`,
            groupId: null,
            session,
        }));
    const groups = new Map();
    for (const session of lanes) {
        let id;
        let group;
        if (groupBy === "project") {
            id = session.projectId ?? (session.projectName ? `name:${session.projectName}` : NO_GROUP);
            const label = session.projectName ?? names.noProject;
            group = {
                id,
                label,
                hue: id === NO_GROUP ? undefined : hueFor(session.projectId ?? label),
                sessions: 0,
                checkpoints: 0,
            };
        }
        else {
            const owner = session.participants[0];
            id = owner?.id ?? NO_GROUP;
            group = {
                id,
                label: owner?.name ?? names.noOwner,
                person: owner,
                sessions: 0,
                checkpoints: 0,
            };
        }
        const entry = groups.get(id) ?? { group, lanes: [] };
        entry.group.sessions += 1;
        entry.group.checkpoints += session.checkpoints.length;
        entry.lanes.push(session);
        groups.set(id, entry);
    }
    // Map order is newest-lane-first already; "none" goes last.
    const ordered = [...groups.values()].sort((a, b) => Number(a.group.id === NO_GROUP) - Number(b.group.id === NO_GROUP));
    const rows = [];
    for (const { group, lanes: members } of ordered) {
        rows.push({ kind: "group", key: `group:${group.id}`, ...group });
        for (const session of members)
            rows.push({
                kind: "lane",
                key: `lane:${group.id}:${session.id}`,
                groupId: group.id,
                session,
            });
    }
    return rows;
}
/* ── Handoffs ──────────────────────────────────────────────────────────── */
/**
 * For each checkpoint, the author it took over from: the previous
 * checkpoint's author on the same session when that was someone else.
 */
export function handoffsOf(checkpoints) {
    const sorted = [...checkpoints].sort((a, b) => toMs(a.at) - toMs(b.at));
    const from = new Map();
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const cur = sorted[i];
        if (prev.author.id !== cur.author.id)
            from.set(cur.id, prev.author);
    }
    return from;
}
/**
 * The next position for a key, or `null` when the key does nothing here.
 *
 *   ArrowLeft / ArrowRight  along the lane; the title is the stop before the first mark
 *   ArrowUp / ArrowDown     to the next lane, onto the mark nearest in time
 *                           (from the title, to the next lane's title)
 *   Home / End              the lane's title, its last mark
 *
 * A position that no longer exists (the data changed under it) resolves to
 * the first lane's title.
 */
export function moveFocus(lanes, at, key) {
    if (lanes.length === 0)
        return null;
    let li = at ? lanes.findIndex((l) => l.key === at.lane) : -1;
    if (li < 0)
        return { lane: lanes[0].key, mark: null };
    const lane = lanes[li];
    const mi = at?.mark == null ? -1 : lane.marks.findIndex((m) => m.key === at.mark);
    const here = { lane: lane.key, mark: mi < 0 ? null : lane.marks[mi].key };
    switch (key) {
        case "ArrowRight": {
            const next = lane.marks[mi + 1];
            return next ? { lane: lane.key, mark: next.key } : here;
        }
        case "ArrowLeft":
            if (mi <= 0)
                return { lane: lane.key, mark: null };
            return { lane: lane.key, mark: lane.marks[mi - 1].key };
        case "Home":
            return { lane: lane.key, mark: null };
        case "End": {
            const last = lane.marks.at(-1);
            return { lane: lane.key, mark: last ? last.key : null };
        }
        case "ArrowDown":
        case "ArrowUp": {
            li += key === "ArrowDown" ? 1 : -1;
            const target = lanes[li];
            if (!target)
                return here;
            if (mi < 0 || target.marks.length === 0)
                return { lane: target.key, mark: null };
            const x = lane.marks[mi].x;
            let best = target.marks[0];
            for (const m of target.marks)
                if (Math.abs(m.x - x) < Math.abs(best.x - x))
                    best = m;
            return { lane: target.key, mark: best.key };
        }
        default:
            return null;
    }
}
/** Zoom one step finer (`-1`) or coarser (`+1`), clamped at the ends. */
export function stepZoom(zoom, direction) {
    const i = TRACE_ZOOMS.indexOf(zoom) + direction;
    return TRACE_ZOOMS[Math.min(TRACE_ZOOMS.length - 1, Math.max(0, i))];
}
/**
 * Apple's rubber band: the further past the edge, the less the sheet
 * follows. `dimension` is the viewport's size along the pull.
 */
export function rubberband(overshoot, dimension, constant = 0.55) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
//# sourceMappingURL=checkpoint-trace-model.js.map
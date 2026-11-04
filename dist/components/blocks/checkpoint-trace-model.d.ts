/**
 * The checkpoint trace's arithmetic, kept out of React so it can be tested on
 * its own: the time scale (time → x and back), the axis ticks, the clustering
 * of checkpoints that would overlap at a zoom, the rows (lanes and their
 * groups), and keyboard movement between marks.
 *
 * Nothing here touches the DOM. Times are epoch milliseconds inside; the
 * public types take ISO strings, as both apps' wire shapes do.
 */
import type { LabelTone } from "../../lib/types.ts";
/** A person who drove a session, or landed a checkpoint. */
export interface TraceAuthor {
    id: string;
    name: string;
    avatarUrl?: string | null;
}
/** A checkpoint: a commit plus its provenance. */
export interface TraceCheckpoint {
    id: string;
    sessionId: string;
    /** ISO time the checkpoint landed. */
    at: string;
    /** Who drove the session when it landed. */
    author: TraceAuthor;
    /** The commit subject, or the checkpoint's summary. The server's trace
     *  does not carry one; without it the short sha stands in. */
    title?: string | null;
    sha?: string | null;
    branch?: string | null;
    additions?: number;
    deletions?: number;
    files?: number;
    /** `orphaned`: the commit is on no branch any more (rebased away, a branch
     *  deleted). Drawn faded, so lost work reads as lost. */
    linkState?: "linked" | "orphaned";
}
export interface TraceSession {
    id: string;
    title: string;
    projectId?: string | null;
    projectName?: string | null;
    /** The agent that ran it, e.g. "Claude Code". The host may draw its mark
     *  through `renderAgentMark`. */
    agentLabel?: string | null;
    /** ISO start. */
    startedAt: string;
    /** ISO end; `null` or absent means the session is still live. */
    endedAt?: string | null;
    /** Defaults to `live` without an `endedAt` and `settled` with one. */
    status?: "live" | "settled" | "error";
    /** Everyone who drove it. The first is its owner, the person `groupBy="person"` files it under. */
    participants: TraceAuthor[];
    checkpoints: TraceCheckpoint[];
    /** The source capped the checkpoints it sent (the server stops at 200);
     *  the lane shows a "+ more" cue after the last one. */
    checkpointsTruncated?: boolean;
}
/** What a checkpoint is called: its title, else its short sha. */
export declare function checkpointTitle(c: TraceCheckpoint, fallback?: string): string;
/** A window of time, as ISO strings. */
export interface TraceRange {
    from: string;
    to: string;
}
export type TraceZoom = "hour" | "day" | "week";
export type TraceGroupBy = "none" | "project" | "person";
/** Finest first: zooming in moves left along this list. */
export declare const TRACE_ZOOMS: readonly TraceZoom[];
export declare const MINUTE = 60000;
export declare const HOUR: number;
export declare const DAY: number;
/**
 * How many pixels an hour is at each zoom. `week` fits a working week of
 * days in about a thousand pixels; `day` fits a working day in a laptop's
 * track; `hour` gives fifteen minutes sixty pixels, room for a node every
 * five minutes before they gather into a count.
 */
export declare const PX_PER_HOUR: Record<TraceZoom, number>;
/** One zoom step's worth of time: what pulling past an end asks for. */
export declare const ZOOM_SPAN: Record<TraceZoom, number>;
export declare function toMs(time: string | number | Date): number;
export interface TimeScale {
    from: number;
    to: number;
    pxPerMs: number;
    /** The track's width in px. */
    width: number;
    /** Time (ms) → x (px from the track's left edge). */
    x: (t: number) => number;
    /** x → time (ms). */
    t: (x: number) => number;
}
/**
 * A linear scale from `[from, to]` onto `[0, width]` at the zoom's density.
 * `minWidth` stretches `to` so a short range still fills the track: a trace
 * of one morning at week zoom would otherwise be a stub with a blank field
 * beside it.
 */
export declare function timeScale(range: {
    from: number;
    to: number;
}, zoom: TraceZoom, minWidth?: number): TimeScale;
/** Local midnight at or before `t`. */
export declare function startOfDay(t: number): number;
/** Local hour start at or before `t`. */
export declare function startOfHour(t: number): number;
/**
 * The range a trace covers when the host gives none: from the earliest start
 * to the latest of now, every end and every checkpoint, padded and snapped to
 * the zoom's unit so the axis begins on a label rather than mid-hour.
 */
export declare function extentOf(sessions: readonly TraceSession[], now: number, zoom: TraceZoom): {
    from: number;
    to: number;
};
export interface AxisTick {
    t: number;
    x: number;
    /** A major tick starts a day (day, week) or an hour (hour); it draws a
     *  gridline down the lanes. */
    major: boolean;
    /** Minor ticks at `day` zoom are labelled only every third hour. */
    labelled: boolean;
}
/**
 * The ticks inside `[x0, x1]` (px), aligned to local time: quarter hours at
 * `hour`, hours at `day`, six-hour marks at `week`. Only the visible window is
 * asked for, so a month at hour zoom is a few dozen ticks, not three thousand.
 */
export declare function axisTicks(scale: TimeScale, zoom: TraceZoom, x0?: number, x1?: number): AxisTick[];
/** A checkpoint node's diameter, and the least air between two marks. */
export declare const NODE = 16;
export declare const MARK_GAP = 4;
/** A mark on a lane: one checkpoint, or several drawn as a count. */
export interface TraceMark<T> {
    /** The first member's id: stable across zooms for the checkpoint that starts it. */
    key: string;
    members: T[];
    /** The centre, and the drawn extent, in px. */
    x: number;
    left: number;
    right: number;
    /** The first and last member's x: the stretch of time the mark stands for. */
    first: number;
    last: number;
}
/** A count pill's width: a face, the digits, and padding. */
export declare function pillWidth(count: number): number;
/**
 * Greedy, left to right: a point joins the mark before it when its node would
 * land within `gap` of that mark's drawn edge. A mark of several is drawn as a
 * pill spanning its first to last member (at least wide enough for its
 * count), so a burst stays as long as the time it took, and the next mark is
 * always `gap` clear of it: nothing overlaps at any zoom.
 */
export declare function clusterMarks<T>(points: readonly {
    x: number;
    key: string;
    item: T;
}[], { node, gap, widthOf }?: {
    gap?: number | undefined;
    node?: number | undefined;
    widthOf?: typeof pillWidth | undefined;
}): TraceMark<T>[];
export interface TraceGroup {
    id: string;
    label: string;
    /** A project's identity hue; absent for people and "no project". */
    hue?: LabelTone;
    /** The person a `person` group is. */
    person?: TraceAuthor;
    sessions: number;
    checkpoints: number;
}
export type TraceRow = ({
    kind: "group";
    key: string;
} & TraceGroup) | {
    kind: "lane";
    key: string;
    groupId: string | null;
    session: TraceSession;
};
/**
 * Lanes newest-first (the live work is on the first screen), split into
 * groups ordered by their newest lane. Sessions with no project, or no owner,
 * gather in one group at the end.
 */
export declare function buildRows(sessions: readonly TraceSession[], groupBy: TraceGroupBy, names: {
    noProject: string;
    noOwner: string;
}): TraceRow[];
/**
 * For each checkpoint, the author it took over from: the previous
 * checkpoint's author on the same session when that was someone else.
 */
export declare function handoffsOf(checkpoints: readonly TraceCheckpoint[]): Map<string, TraceAuthor>;
/** Where focus is: a lane, and a mark on it (`null` is the lane's title). */
export interface TracePosition {
    lane: string;
    mark: string | null;
}
export interface NavLane {
    key: string;
    marks: readonly {
        key: string;
        x: number;
    }[];
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
export declare function moveFocus(lanes: readonly NavLane[], at: TracePosition | null, key: string): TracePosition | null;
/** Zoom one step finer (`-1`) or coarser (`+1`), clamped at the ends. */
export declare function stepZoom(zoom: TraceZoom, direction: -1 | 1): TraceZoom;
/**
 * Apple's rubber band: the further past the edge, the less the sheet
 * follows. `dimension` is the viewport's size along the pull.
 */
export declare function rubberband(overshoot: number, dimension: number, constant?: number): number;
//# sourceMappingURL=checkpoint-trace-model.d.ts.map
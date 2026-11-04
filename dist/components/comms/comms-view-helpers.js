/**
 * The pure half of team chat: how messages become transcript rows, how
 * reaction rows become chips, what a conversation is called, and how its
 * unread count reads. Each rule lives here once, so web and desktop cannot
 * disagree on it. No React, and nothing touches `window` at import.
 */
/** A new run starts after this long, even from the same author. */
export const COMMS_GROUP_WINDOW_MS = 5 * 60_000;
/** `day-YYYY-MM-DD` in local time: the calendar day a person sees. */
function dayKey(at) {
    const d = new Date(at);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `day-${d.getFullYear()}-${mm}-${dd}`;
}
/** Two messages are one speaker when the author, and an integration's posted name and `via`, match. */
function sameSpeaker(a, b) {
    if (a.author.kind !== b.author.kind || a.author.id !== b.author.id)
        return false;
    if (a.author.kind === "integration" && b.author.kind === "integration") {
        // One webhook posting as "CI" then as "Deploys" is two speakers.
        return a.author.name === b.author.name && a.author.via === b.author.via;
    }
    return true;
}
/**
 * The transcript's rows, top to bottom.
 *
 * Messages and calls interleave by `seq`, the conversation's own order. A day
 * row goes in whenever the local calendar day changes. The unread line goes
 * above the first message after `lastReadSeq` that somebody else wrote (your
 * own words are never news), and never when `lastReadSeq` is unknown.
 *
 * A message opens a run (`head`) after a day row, the unread line or a call;
 * when it is the first; when the author changes (for an integration, its
 * posted name or `via` too); after more than `COMMS_GROUP_WINDOW_MS`; or when
 * it replies, since the quote needs its own head. Deleted messages are kept
 * and group like any other: whether to pass them is the adapter's call.
 */
export function transcriptRows(messages, options) {
    const items = [
        ...messages.map((message) => ({ seq: message.seq, at: message.at, message })),
        ...(options.calls ?? []).map((call) => ({ seq: call.seq, at: call.at, call })),
    ].sort((a, b) => a.seq - b.seq);
    const rows = [];
    const lastReadSeq = options.lastReadSeq;
    let unreadPlaced = lastReadSeq === null || lastReadSeq === undefined;
    let previous = null;
    let previousDay = null;
    for (const item of items) {
        const day = dayKey(item.at);
        let broke = false;
        if (day !== previousDay) {
            rows.push({ kind: "day", key: day, at: item.at });
            previousDay = day;
            broke = true;
        }
        if (item.call) {
            rows.push({ kind: "call", key: `call-${item.call.id}`, call: item.call });
            previous = null;
            continue;
        }
        const message = item.message;
        if (!unreadPlaced &&
            message.seq > (lastReadSeq ?? 0) &&
            !(message.author.kind === "person" && message.author.id === options.me)) {
            rows.push({ kind: "unread", key: "unread" });
            unreadPlaced = true;
            broke = true;
        }
        const head = broke ||
            previous === null ||
            !sameSpeaker(previous, message) ||
            message.at - previous.at > COMMS_GROUP_WINDOW_MS ||
            Boolean(message.replyTo);
        rows.push({ kind: "message", key: message.id, message, head });
        previous = message;
    }
    return rows;
}
/**
 * A message's reaction rows as chips: one per emoji, in the order each was
 * first used, each user counted once, `mine` when the current user is among
 * them. The server sends rows and no aggregate; a stored count would drift.
 */
export function reactionChips(rows, me) {
    const chips = [];
    const byEmoji = new Map();
    for (const row of rows ?? []) {
        let chip = byEmoji.get(row.emoji);
        if (!chip) {
            chip = { emoji: row.emoji, count: 0, mine: false, userIds: [] };
            byEmoji.set(row.emoji, chip);
            chips.push(chip);
        }
        if (chip.userIds.includes(row.userId))
            continue;
        chip.userIds.push(row.userId);
        chip.count = chip.userIds.length;
        if (row.userId === me)
            chip.mine = true;
    }
    return chips;
}
/**
 * What a conversation is called (web's rule; desktop's "A & B / +N" is
 * retired). A channel is its name. A DM is the other person's name, or "Just
 * you" when there is nobody else. A group is its own name, else the others'
 * first names joined. Someone `nameOf` cannot resolve is "Former member".
 */
export function conversationTitle({ kind, name, memberIds, me, nameOf, }) {
    if (kind === "channel")
        return name ?? "channel";
    const others = (memberIds ?? []).filter((id) => id !== me);
    const nameIn = (id) => nameOf(id) || "Former member";
    if (kind === "dm")
        return others[0] ? nameIn(others[0]) : "Just you";
    if (name)
        return name;
    if (others.length === 0)
        return "Just you";
    return others
        .map((id) => {
        const known = nameOf(id);
        return known ? known.split(/\s+/)[0] : "Former member";
    })
        .join(", ");
}
/**
 * The badge a row carries, or `null`. A mention outranks a plain unread count
 * and caps at "9+" (someone named you: the number past that is noise); an
 * unread count caps at "99+".
 */
export function unreadBadge(unread, mentions) {
    if (mentions > 0) {
        return {
            label: mentions > 9 ? "9+" : String(mentions),
            tone: "mention",
            aria: `${mentions} ${mentions === 1 ? "mention" : "mentions"}`,
        };
    }
    if (unread > 0) {
        return {
            label: unread > 99 ? "99+" : String(unread),
            tone: "unread",
            aria: `${unread} unread`,
        };
    }
    return null;
}
const CLOCK_CACHE_SIZE = 1024;
const clockCache = new Map();
/**
 * A message's time of day, "9:04 AM". `Intl` is the measurable cost of a
 * transcript render (two calls a row) and a timestamp's text never changes,
 * so results are cached, the oldest dropped past 1,024. `hourCycle` forces a
 * 12- or 24-hour clock (desktop's time-format setting); omit it and the
 * locale decides.
 */
export function formatClock(at, hourCycle) {
    const key = `${hourCycle ?? ""}|${at}`;
    const hit = clockCache.get(key);
    if (hit !== undefined)
        return hit;
    const text = new Date(at).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        ...(hourCycle ? { hourCycle } : {}),
    });
    if (clockCache.size >= CLOCK_CACHE_SIZE) {
        const oldest = clockCache.keys().next().value;
        if (oldest !== undefined)
            clockCache.delete(oldest);
    }
    clockCache.set(key, text);
    return text;
}
/**
 * A day divider's label: "Today", "Yesterday", else "October 6". `now` is a
 * parameter so a test or a server render is deterministic.
 */
export function formatDayLabel(at, now) {
    const day = new Date(at).toDateString();
    const today = new Date(now);
    if (day === today.toDateString())
        return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (day === yesterday.toDateString())
        return "Yesterday";
    return new Date(at).toLocaleDateString(undefined, { month: "long", day: "numeric" });
}
//# sourceMappingURL=comms-view-helpers.js.map
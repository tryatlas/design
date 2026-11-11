/**
 * The pure half of team chat: how messages become transcript rows, how
 * reaction rows become chips, what a conversation is called, and how its
 * unread count reads. Each rule lives here once, so web and desktop cannot
 * disagree on it. No React, and nothing touches `window` at import.
 */
import type { CommsCallMarker, CommsConversationKind, CommsMessageView, CommsReaction, CommsTranscriptRow } from "./comms-view.ts";
/** A new run starts after this long, even from the same author. */
export declare const COMMS_GROUP_WINDOW_MS: number;
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
export declare function transcriptRows(messages: readonly CommsMessageView[], options: {
    me: string;
    lastReadSeq?: number | null;
    calls?: readonly CommsCallMarker[];
}): CommsTranscriptRow[];
/**
 * A message's reaction rows as chips: one per emoji, in the order each was
 * first used, each user counted once, `mine` when the current user is among
 * them. The server sends rows and no aggregate; a stored count would drift.
 */
export declare function reactionChips(rows: readonly {
    userId: string;
    emoji: string;
}[] | undefined, me: string): CommsReaction[];
/**
 * What a conversation is called (web's rule; desktop's "A & B / +N" is
 * retired). A channel is its name. A DM is the other person's name, or "Just
 * you" when there is nobody else. A group is its own name, else the others'
 * first names joined. Someone `nameOf` cannot resolve is "Former member".
 */
export declare function conversationTitle({ kind, name, memberIds, me, nameOf, }: {
    kind: CommsConversationKind;
    name?: string | null;
    memberIds?: readonly string[] | null;
    me: string;
    nameOf: (id: string) => string | null | undefined;
}): string;
/** A conversation row's count badge. */
export interface CommsUnreadBadge {
    /** What the badge says: the count, capped. */
    label: string;
    tone: "mention" | "unread";
    /** The count in words, uncapped. */
    aria: string;
}
/**
 * The badge a row carries, or `null`. A mention outranks a plain unread count
 * and caps at "9+" (someone named you: the number past that is noise); an
 * unread count caps at "99+".
 */
export declare function unreadBadge(unread: number, mentions: number): CommsUnreadBadge | null;
/**
 * A message's time of day, "9:04 AM". `Intl` is the measurable cost of a
 * transcript render (two calls a row) and a timestamp's text never changes,
 * so results are cached, the oldest dropped past 1,024. `hourCycle` forces a
 * 12- or 24-hour clock (desktop's time-format setting); omit it and the
 * locale decides.
 */
export declare function formatClock(at: number, hourCycle?: "h12" | "h23"): string;
/**
 * A day divider's label: "Today", "Yesterday", else "October 6". `now` is a
 * parameter so a test or a server render is deterministic.
 */
export declare function formatDayLabel(at: number, now: number): string;
//# sourceMappingURL=comms-view-helpers.d.ts.map
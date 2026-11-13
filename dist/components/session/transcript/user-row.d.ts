import { type UserRow } from "./model.ts";
/** Lines a user prompt shows before clamping behind "Show more". */
export declare const USER_MAX_LINES = 12;
/** Line height (px) of a user bubble, and the unit its clamp is measured in.
 *  Must agree with `.prose-session-user` (`session.css`): the clamp is a
 *  `max-height`, so a stylesheet-only change would silently cut a partial
 *  line. */
export declare const USER_LINE_HEIGHT = 22;
export declare const UserRowView: import("react").MemoExoticComponent<({ row, priority, justSent, canRetry, }: {
    row: UserRow;
    /** Position in the thread: newest parses first. */
    priority: number;
    /** True ONLY for the message the user sent just now (id-scoped in the
     *  store). The previous wall-clock-vs-timestamp gate animated entire
     *  restored threads (resume/replay paths stamp messages "now") and every
     *  row mounted during an early scroll — bulk entrance animations during
     *  fast scroll were a blanking contributor. */
    justSent?: boolean;
    /** True only for the thread's last user message on an agent that can rewind.
     *  Resolved by the transcript so this stays a boolean — a callback minted in
     *  the row map would defeat the memo for every row on every frame. */
    canRetry?: boolean;
}) => import("react").JSX.Element>;
//# sourceMappingURL=user-row.d.ts.map
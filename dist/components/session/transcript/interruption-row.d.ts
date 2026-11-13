import type { InterruptionRow, TranscriptInterruption } from "./model.ts";
/** "45s", "21m", "1h", "1h 3m": a sleep is told in the unit a person would
 *  use; "21m 14s" reads as a stopwatch. */
export declare function formatSlept(secs: number): string;
/** The interruption row's one line: what happened, and what it means for the
 *  reply, in that order. The agent's own error is a detail, never the
 *  headline. */
export declare function interruptionHeadline(x: TranscriptInterruption): string;
/**
 * A turn something outside the conversation cut into — today, the computer
 * sleeping mid-reply (`TurnInterruption`).
 *
 * One quiet line in the footer's register, under the turn: the reply stays the
 * loudest thing on screen, and this says only what happened to it. The moon is
 * the one coloured mark, in the warning token — it is a caution about the
 * reply, not an error the user caused. The agent's own error, when there is
 * one, is folded behind Details: it is for diagnosis, not the headline.
 *
 * No entrance animation. Rows remount as they scroll in and out, so a fade
 * here would replay every time the turn came back into view.
 *
 * Retry and Continue appear on the latest turn only, since both act on the
 * thread's last reply, and only where the app wires them (`onRetry`,
 * `onContinue`).
 */
export declare const InterruptionRowView: import("react").MemoExoticComponent<({ row, canRetry, canContinue, }: {
    row: InterruptionRow;
    canRetry: boolean;
    canContinue: boolean;
}) => import("react").JSX.Element>;
//# sourceMappingURL=interruption-row.d.ts.map
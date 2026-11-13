import type { InjectedRow } from "./model.ts";
/**
 * A prompt Atlas sent the agent on its own — a watched pull request changed,
 * and Atlas woke the agent about it, or Atlas came back from a quit, crash or
 * update and continued the turn it cut short.
 *
 * It opens a turn the way a user message does, but it is not the user's words,
 * so it is not their bubble: one quiet line in the interruption row's
 * register, saying who spoke and why. The full text the agent received folds
 * behind Details, for when the user wants to see exactly what it was told.
 *
 * No entrance animation, for the reason `InterruptionRowView` gives: rows
 * remount as they scroll back into view.
 */
export declare const InjectedRowView: import("react").MemoExoticComponent<({ row }: {
    row: InjectedRow;
}) => import("react").JSX.Element>;
//# sourceMappingURL=injected-row.d.ts.map
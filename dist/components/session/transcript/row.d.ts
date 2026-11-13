import { type Row } from "./model.ts";
/** What a row takes besides its data: facts about the session the
 *  transcript resolves once, kept to primitives so every row's `memo` holds. */
export interface TranscriptRowProps {
    row: Row;
    /** Absolute position in the thread, so the newest messages parse first. */
    priority: number;
    /** The provenance line's fallback when a response names no model. */
    agentLabel: string;
    /** The message the user sent just now, which alone plays the bubble's
     *  entrance. */
    justSentMessageId?: string;
    /** Id of the one row allowed to show a retry button (the thread's last
     *  prompt), or `undefined` when no retry is possible. */
    canRetryRowId?: string;
    /** Id of the one prose row allowed to show "Branch from here" (the latest
     *  settled response), or `undefined` when the session cannot fork now. */
    canBranchRowId?: string;
    /** Whether a message could be sent now (an interrupted turn's Continue). */
    canContinue?: boolean;
}
/** Row dispatch. Kept out of the list body so the map stays flat. */
export declare function TranscriptRow({ row, priority, agentLabel, justSentMessageId, canRetryRowId, canBranchRowId, canContinue, }: TranscriptRowProps): import("react").JSX.Element | null;
/**
 * One row as the list mounts it: the row in its wrapper. The wrapper is what
 * an app's scroll window finds rows by (`data-row-id`), the hover scope for a
 * prompt's action bar (`group`), and, on a response whose hover footer is drawn
 * by the turn footer after it, the mark that lets hovering the response reveal
 * that footer (`data-footer-below`, `transcript.css`). Rows must stay direct
 * children of the transcript's content element.
 */
export declare function TranscriptRowItem(props: TranscriptRowProps): import("react").JSX.Element;
//# sourceMappingURL=row.d.ts.map
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { InjectedRowView } from "./injected-row.js";
import { InterruptionRowView } from "./interruption-row.js";
import { MarkerGroupRowView, MarkerRowView, SubagentRowView } from "./marker-rows.js";
import { RowKind } from "./model.js";
import { ProseRowView } from "./prose-row.js";
import { ThinkingRowView } from "./thinking-row.js";
import { SeparatorRowView, TurnFooterRowView, WorkHeaderRowView } from "./turn-rows.js";
import { UserRowView } from "./user-row.js";
/** Row dispatch. Kept out of the list body so the map stays flat. */
export function TranscriptRow({ row, priority, agentLabel, justSentMessageId, canRetryRowId, canBranchRowId, canContinue = false, }) {
    switch (row.kind) {
        case RowKind.User:
            return (_jsx(UserRowView, { row: row, priority: priority, 
                // Row ids are prefixed (`u:<messageId>`); the app records the raw
                // message id.
                justSent: row.id === `u:${justSentMessageId}`, canRetry: row.id === canRetryRowId }));
        case RowKind.Prose:
            return (_jsx(ProseRowView, { row: row, agentLabel: agentLabel, priority: priority, canBranch: row.id === canBranchRowId }));
        case RowKind.Thinking:
            return _jsx(ThinkingRowView, { row: row });
        case RowKind.Marker:
            return _jsx(MarkerRowView, { row: row });
        case RowKind.MarkerGroup:
            return _jsx(MarkerGroupRowView, { row: row });
        case RowKind.Subagent:
            return _jsx(SubagentRowView, { row: row });
        case RowKind.Separator:
            return _jsx(SeparatorRowView, { row: row });
        case RowKind.WorkHeader:
            return _jsx(WorkHeaderRowView, { row: row });
        case RowKind.TurnFooter:
            return (_jsx(TurnFooterRowView, { row: row, canBranch: row.responseRowId !== undefined && row.responseRowId === canBranchRowId }));
        case RowKind.Injected:
            return _jsx(InjectedRowView, { row: row });
        case RowKind.Interruption:
            return (_jsx(InterruptionRowView, { row: row, canRetry: canRetryRowId !== undefined, canContinue: canContinue }));
        default:
            return null;
    }
}
/**
 * One row as the list mounts it: the row in its wrapper. The wrapper is what
 * an app's scroll window finds rows by (`data-row-id`), the hover scope for a
 * prompt's action bar (`group`), and, on a response whose hover footer is drawn
 * by the turn footer after it, the mark that lets hovering the response reveal
 * that footer (`data-footer-below`, `transcript.css`). Rows must stay direct
 * children of the transcript's content element.
 */
export function TranscriptRowItem(props) {
    const { row } = props;
    return (_jsx("div", { className: "atlas-row group group/row", "data-row-id": row.id, "data-footer-below": row.kind === RowKind.Prose && row.footerBelow ? "" : undefined, children: _jsx(TranscriptRow, { ...props }) }));
}
//# sourceMappingURL=row.js.map
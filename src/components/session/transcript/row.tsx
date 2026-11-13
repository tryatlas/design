"use client";

import { InjectedRowView } from "./injected-row.tsx";
import { InterruptionRowView } from "./interruption-row.tsx";
import { MarkerGroupRowView, MarkerRowView, SubagentRowView } from "./marker-rows.tsx";
import { RowKind, type Row } from "./model.ts";
import { ProseRowView } from "./prose-row.tsx";
import { ThinkingRowView } from "./thinking-row.tsx";
import { SeparatorRowView, TurnFooterRowView, WorkHeaderRowView } from "./turn-rows.tsx";
import { UserRowView } from "./user-row.tsx";

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
export function TranscriptRow({
  row,
  priority,
  agentLabel,
  justSentMessageId,
  canRetryRowId,
  canBranchRowId,
  canContinue = false,
}: TranscriptRowProps) {
  switch (row.kind) {
    case RowKind.User:
      return (
        <UserRowView
          row={row}
          priority={priority}
          // Row ids are prefixed (`u:<messageId>`); the app records the raw
          // message id.
          justSent={row.id === `u:${justSentMessageId}`}
          canRetry={row.id === canRetryRowId}
        />
      );
    case RowKind.Prose:
      return (
        <ProseRowView
          row={row}
          agentLabel={agentLabel}
          priority={priority}
          canBranch={row.id === canBranchRowId}
        />
      );
    case RowKind.Thinking:
      return <ThinkingRowView row={row} />;
    case RowKind.Marker:
      return <MarkerRowView row={row} />;
    case RowKind.MarkerGroup:
      return <MarkerGroupRowView row={row} />;
    case RowKind.Subagent:
      return <SubagentRowView row={row} />;
    case RowKind.Separator:
      return <SeparatorRowView row={row} />;
    case RowKind.WorkHeader:
      return <WorkHeaderRowView row={row} />;
    case RowKind.TurnFooter:
      return (
        <TurnFooterRowView
          row={row}
          canBranch={row.responseRowId !== undefined && row.responseRowId === canBranchRowId}
        />
      );
    case RowKind.Injected:
      return <InjectedRowView row={row} />;
    case RowKind.Interruption:
      return (
        <InterruptionRowView
          row={row}
          canRetry={canRetryRowId !== undefined}
          canContinue={canContinue}
        />
      );
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
export function TranscriptRowItem(props: TranscriptRowProps) {
  const { row } = props;
  return (
    <div
      className="atlas-row group group/row"
      data-row-id={row.id}
      data-footer-below={row.kind === RowKind.Prose && row.footerBelow ? "" : undefined}
    >
      <TranscriptRow {...props} />
    </div>
  );
}

/**
 * The projection's shared rules: how a turn's tool calls become blocks, what a
 * live block says, how a settled turn folds behind its work header, and when a
 * pause between turns earns a divider.
 *
 * Each app writes its own projection from its own data (see `model.ts`), but
 * these decisions are what make a transcript look like Atlas's, so they live
 * here once rather than in each projection. They work on rows only, mutating
 * the turn's slice of the `rows` array in place, the way a projection builds
 * it: rows from `rowStart` on belong to the turn being built.
 */

import { summarizeMarkers, liveMarkerLabel } from "./labels.ts";
import {
  RowKind,
  type MarkerGroupRow,
  type MarkerRow,
  type ProseRow,
  type Row,
  type SeparatorRow,
} from "./model.ts";

/** Gap between turns that earns a "N ago" separator. */
export const TURN_GAP_MS = 20 * 60 * 1000;

function formatGap(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

/**
 * The faint "N ago" divider marking a real pause between turns, or `null`
 * when the turn starting at `timestamp` followed `previous` closely. Pass no
 * divider for a time that is only when a message was replayed: a pause
 * measured against it is no pause the conversation had.
 */
export function gapSeparator(
  previous: string,
  timestamp: string,
  id: string,
  turnId: string,
): SeparatorRow | null {
  const gap = new Date(timestamp).getTime() - new Date(previous).getTime();
  if (gap <= TURN_GAP_MS) return null;
  return {
    kind: RowKind.Separator,
    id,
    turnId,
    firstInTurn: false,
    label: `${formatGap(gap)} ago`,
  };
}

/**
 * A run of consecutive tool calls as the one row that shows it: a folded
 * block, or — once the turn has settled — a lone finished call as its own
 * line, since a disclosure that opens onto one line says less than the line
 * itself. While the turn runs it stays a block, which carries the live label,
 * and a call that just finished is usually about to be joined by the next
 * one, so swapping it for a line would flicker between the two.
 */
export function markerBlock(
  markers: MarkerRow[],
  o: {
    turnId: string;
    /** The block is the first row of its turn. */
    firstInTurn: boolean;
    /** The turn is still going. */
    inProgress: boolean;
    /** Block ids the reader has opened. */
    expandedTurns: ReadonlySet<string>;
  },
): MarkerRow | MarkerGroupRow {
  if (
    !o.inProgress &&
    markers.length === 1 &&
    (markers[0].state === "done" || markers[0].state === "failed")
  ) {
    const only = markers[0];
    only.firstInTurn = o.firstInTurn;
    return only;
  }
  const id = `mg:${o.turnId}:${markers[0].toolCallId}`;
  return {
    kind: RowKind.MarkerGroup,
    id,
    turnId: o.turnId,
    firstInTurn: o.firstInTurn,
    ...summarizeMarkers(markers),
    count: markers.length,
    markers,
    open: o.expandedTurns.has(id),
    running: false,
    liveLabel: null,
    liveTool: null,
    liveStartedAt: null,
    liveDone: 0,
  };
}

/**
 * Give each of a live turn's blocks with a call still going its live line:
 * the active call's label and glyph, how many calls are done, and when the
 * active one started.
 */
export function markLiveBlocks(rows: Row[], rowStart: number): void {
  for (let rowIndex = rowStart; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    if (row.kind !== RowKind.MarkerGroup) continue;
    // A RUNNING call outranks a later PENDING one. Agents that fan out
    // announce several calls before starting them, so the last unfinished
    // marker is routinely one that has not begun — taking it would put
    // "Running cargo test" on screen before cargo test was launched.
    let running: MarkerRow | null = null;
    let pending: MarkerRow | null = null;
    let done = 0;
    for (const marker of row.markers) {
      if (marker.state === "running") running = marker;
      else if (marker.state === "pending") pending = marker;
      else done += 1;
    }
    const active = running ?? pending;
    if (!active) continue;
    row.running = true;
    row.liveLabel = liveMarkerLabel(active);
    row.liveTool = active.tool;
    row.liveDone = done;
    // Only a running call is timed. A pending one has not started; its
    // stamp is when it was ANNOUNCED, so counting from it would report
    // queue time as work.
    row.liveStartedAt = running?.startedAt ?? null;
  }
}

/**
 * Put the work header at the head of the assistant turn starting at
 * `rowStart`, and — once the turn has settled and the reader has not opened it
 * — drop everything before the final answer.
 *
 * "The final answer" is the trailing run of prose rows: whatever the agent said
 * after it last used a tool or thought. A turn that ENDS on a tool block has no
 * answer, and folds whole.
 */
export function foldWork(
  rows: Row[],
  rowStart: number,
  o: {
    turnId: string;
    live: boolean;
    startedAt: number | null;
    workedMs: number | null;
    stopped: boolean;
    expandedTurns: ReadonlySet<string>;
  },
): void {
  // The trailing run that is NOT work: the answer, and the children the turn
  // delegated to.
  //
  // Subagents survive the fold deliberately. A folded turn hides what it did
  // because the answer is what remains worth reading — but a child is not
  // something the turn did and finished with: it has its own state, it may
  // still be running after the turn settles, and it is the one thing a
  // delegating turn exists to report, so it stays visible between the answer
  // and the footer.
  let answerStart = rows.length;
  while (
    answerStart > rowStart &&
    (rows[answerStart - 1].kind === RowKind.Prose ||
      rows[answerStart - 1].kind === RowKind.Subagent)
  ) {
    answerStart -= 1;
  }
  const foldable = !o.live && answerStart > rowStart;
  // A settled prose-only turn with no timing has nothing to say — unless the
  // user stopped it, which the header says even without a figure.
  if (!o.live && !foldable && o.workedMs === null && !o.stopped) return;

  const id = `wk:${o.turnId}`;
  const open = foldable && o.expandedTurns.has(id);
  if (foldable && !open) {
    const folded = rows.splice(rowStart, answerStart - rowStart);
    // Failed calls stay in view: a turn that recovered from an error still
    // has to say it hit one, and the fold is where that would otherwise be
    // lost. They go between the header and the answer, in the order they
    // happened, as plain lines.
    const failed: MarkerRow[] = [];
    for (const r of folded) {
      if (r.kind === RowKind.Marker && r.state === "failed") failed.push(r);
      else if (r.kind === RowKind.MarkerGroup) {
        for (const m of r.markers) if (m.state === "failed") failed.push(m);
      }
    }
    if (failed.length > 0) {
      for (const m of failed) m.firstInTurn = false;
      rows.splice(rowStart, 0, ...failed);
    }
    // The model · time line rode on the turn's first prose row, which may have
    // just been folded. Hand it to the first row still showing.
    const answer = rows[rowStart + failed.length];
    if (
      answer?.kind === RowKind.Prose &&
      folded.some((r) => r.kind === RowKind.Prose && r.showHeader)
    ) {
      answer.showHeader = true;
    }
  }
  rows.splice(rowStart, 0, {
    kind: RowKind.WorkHeader,
    id,
    turnId: o.turnId,
    firstInTurn: true,
    live: o.live,
    startedAt: o.startedAt,
    workedMs: o.workedMs,
    stopped: o.stopped,
    foldable,
    open,
  });
}

/**
 * The response a turn footer about to be pushed draws the hover footer for
 * (see `ProseRow.footerBelow`), marked as such, or `null`. Only when the
 * response is the row right above the footer: hovering its text reveals the
 * footer through a next-sibling selector (`transcript.css`), and a delegated
 * subagent or a trailing tool call between the two would leave the footer
 * unreachable from the text. Then the response keeps its own footer, and the
 * footer row carries only the card.
 */
export function footerResponse(rows: Row[], rowStart: number): ProseRow | null {
  const last = rows.length > rowStart ? rows[rows.length - 1] : null;
  const response: ProseRow | null = last?.kind === RowKind.Prose && !last.streaming ? last : null;
  if (response) response.footerBelow = true;
  return response;
}

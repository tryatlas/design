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
import { type MarkerGroupRow, type MarkerRow, type ProseRow, type Row, type SeparatorRow } from "./model.ts";
/** Gap between turns that earns a "N ago" separator. */
export declare const TURN_GAP_MS: number;
/**
 * The faint "N ago" divider marking a real pause between turns, or `null`
 * when the turn starting at `timestamp` followed `previous` closely. Pass no
 * divider for a time that is only when a message was replayed: a pause
 * measured against it is no pause the conversation had.
 */
export declare function gapSeparator(previous: string, timestamp: string, id: string, turnId: string): SeparatorRow | null;
/**
 * A run of consecutive tool calls as the one row that shows it: a folded
 * block, or — once the turn has settled — a lone finished call as its own
 * line, since a disclosure that opens onto one line says less than the line
 * itself. While the turn runs it stays a block, which carries the live label,
 * and a call that just finished is usually about to be joined by the next
 * one, so swapping it for a line would flicker between the two.
 */
export declare function markerBlock(markers: MarkerRow[], o: {
    turnId: string;
    /** The block is the first row of its turn. */
    firstInTurn: boolean;
    /** The turn is still going. */
    inProgress: boolean;
    /** Block ids the reader has opened. */
    expandedTurns: ReadonlySet<string>;
}): MarkerRow | MarkerGroupRow;
/**
 * Give each of a live turn's blocks with a call still going its live line:
 * the active call's label and glyph, how many calls are done, and when the
 * active one started.
 */
export declare function markLiveBlocks(rows: Row[], rowStart: number): void;
/**
 * Put the work header at the head of the assistant turn starting at
 * `rowStart`, and — once the turn has settled and the reader has not opened it
 * — drop everything before the final answer.
 *
 * "The final answer" is the trailing run of prose rows: whatever the agent said
 * after it last used a tool or thought. A turn that ENDS on a tool block has no
 * answer, and folds whole.
 */
export declare function foldWork(rows: Row[], rowStart: number, o: {
    turnId: string;
    live: boolean;
    startedAt: number | null;
    workedMs: number | null;
    stopped: boolean;
    expandedTurns: ReadonlySet<string>;
}): void;
/**
 * The response a turn footer about to be pushed draws the hover footer for
 * (see `ProseRow.footerBelow`), marked as such, or `null`. Only when the
 * response is the row right above the footer: hovering its text reveals the
 * footer through a next-sibling selector (`transcript.css`), and a delegated
 * subagent or a trailing tool call between the two would leave the footer
 * unreachable from the text. Then the response keeps its own footer, and the
 * footer row carries only the card.
 */
export declare function footerResponse(rows: Row[], rowStart: number): ProseRow | null;
//# sourceMappingURL=projection.d.ts.map
import type { MarkerGroupRow, MarkerRow, SubagentRow } from "./model.ts";
/**
 * One tool call: a single muted line, and nothing else.
 *
 * The group expands, while each action stays one line. Clicking an action with
 * output or a diff opens its detail view. There is no trailing chevron, as in
 * Codex: a file target reads as a link (dotted underline) and every clickable
 * row brightens on hover.
 *
 * What a click opens is the app's (`onOpenMarker`); a call it can open nothing
 * for (`opens: "none"`) is not a button anyone can press.
 */
export declare const MarkerRowView: import("react").MemoExoticComponent<({ row, embedded, }: {
    row: MarkerRow;
    embedded?: boolean;
}) => import("react").JSX.Element>;
/**
 * A folded sequence of consecutive tool calls, kept between the prose around it.
 *
 * One counted sentence you click — "Ran 3 commands and read 2 files" — led
 * by the icon of the group it names first. While a call
 * is running the line names that call instead ("Running bun run typecheck")
 * and wears its icon, then returns to the sentence when it finishes.
 *
 * The block does NOT open itself while live. The one line carries the live
 * state instead, and earns it by saying three things the settled sentence
 * cannot: what is running right now, how many actions are already behind it,
 * and how long the current one has been going. Auto-expanding was the
 * alternative and was rejected — it makes the transcript reflow under the
 * reader mid-turn, for detail that is one click away and that the folded
 * summary reports a second later anyway.
 *
 * The numeric gutter is the same right-hand slot `MarkerRowView` puts `+n −m`
 * in, for the same reason: the left of a marker line is a sentence, the right
 * is a column of figures, and they should not interleave.
 *
 * The chevron appears on hover and stays visible when open.
 */
export declare const MarkerGroupRowView: import("react").MemoExoticComponent<({ row, }: {
    row: MarkerGroupRow;
}) => import("react").JSX.Element>;
/**
 * A delegated child — one line, the same line a tool call gets.
 *
 * Minimal on purpose: a subagent is not a card, it is one more thing the turn
 * did, and the transcript's whole bargain is that work reads as a quiet column
 * you scan. What sets it apart is the glyph — a filled orb rather than a tool
 * icon, which is how both Codex and Claude Desktop mark an agent among tool
 * calls — and nothing else.
 *
 * Clicking opens the child in the side panel rather than expanding in place:
 * its prompt, its calls and its answer are a body, and a row that grows into
 * one is exactly the unpredictable height a transcript should not absorb.
 */
export declare const SubagentRowView: import("react").MemoExoticComponent<({ row }: {
    row: SubagentRow;
}) => import("react").JSX.Element>;
//# sourceMappingURL=marker-rows.d.ts.map
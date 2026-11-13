/**
 * The words a transcript's tool lines are made of: a path cut to one line, the
 * icon a call leads with, the counted sentence a folded block reads as and the
 * live line it shows while a call runs.
 *
 * Shared so every projection names work the same way. Desktop's projection
 * calls these as it builds its marker rows, and web's adapters call the same
 * ones, so "Ran 3 commands and read 2 files" is one sentence on both.
 */
import type { MarkerRow, MarkerTool } from "./model.ts";
/** Trim a path to something that reads in one line without the eye scanning. */
export declare function shortPath(p: string): string;
/**
 * How a marker names a call no verb branch recognised. Atlas's own tool
 * servers read as their tool, in words: `mcp__atlas_code__find_symbol`
 * (Claude Code's name for it) and `atlas_code.find_symbol` (Atlas Agent's)
 * both become "Find symbol". Any other tool keeps its own name.
 */
export declare function toolDisplayName(toolName: string): string;
/**
 * The icon key for a call the verb branches did not already classify.
 *
 * `kind` first — it is the protocol's own answer. The name sniff below only
 * catches MCP servers, which are free to send no kind at all; it is
 * deliberately narrow, because a wrong icon is worse than the generic wrench.
 * Substrings that appear inside unrelated words ("rm" in "confirm", "web" in
 * "webhook") are not in it for that reason.
 */
export declare function toolIconFor(kind: string | null | undefined, toolName: string): MarkerTool;
/**
 * A call to a third-party MCP server, by Claude Code's name for it
 * (`mcp__<server>__<tool>`): the server in words, and the tool as a phrase.
 * Atlas's own servers are not here — memory, organisation and code calls
 * already read as what they did.
 */
export declare function mcpToolOf(toolName: string): {
    server: string;
    tool: string;
} | null;
/** One block → the sentence on its header, and the glyph of the group that
 *  leads it. */
export declare function summarizeMarkers(markers: MarkerRow[]): {
    summary: string;
    tool: MarkerTool;
};
/**
 * A live disclosure names the current action, then returns to its aggregate
 * sentence when that action finishes. Keep the phrase short enough to occupy
 * the same quiet, single-line slot as the collapsed summary.
 *
 * The rule is "name the target, fall back to the generic phrase" — the generic
 * phrases exist for calls whose target Atlas could not read, NOT as the normal
 * case. `run` is why: "Running command" made `bun run build:app` and `ls`
 * render as the same line, and the command is the entire content of a run.
 *
 * Which part of the target gets named differs by tool, and it is not a style
 * choice. A path's basename identifies it ("Reading turn-rows.ts") while its
 * parent directories are noise at this size; a command, a pattern or a URL has
 * no such tail, and slicing one on "/" would cut it mid-token. So paths take
 * the last segment and everything else is used whole — CSS truncates the line.
 */
export declare function liveMarkerLabel(marker: MarkerRow): string;
//# sourceMappingURL=labels.d.ts.map
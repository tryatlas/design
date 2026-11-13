/**
 * The leading icon of a tool line, and the two numbers that size it.
 *
 * Exported on its own because the transcript is not the only surface that
 * draws a tool call as one line: desktop's recorded-session timeline renders
 * the same "icon + verb + target" sentence. A second icon table would be two vocabularies
 * for one thing, and they would drift the first time a tool was added.
 */
import type { MarkerTool } from "./model.ts";
/** Near the height of the 13px row text, drawn at a thin stroke. */
export declare const ICON_PX = 14;
export declare const ICON_STROKE = 1.5;
/** A tool call's (or a block's) leading icon, red when it failed. */
export declare function ToolGlyph({ tool, failed }: {
    tool: MarkerTool;
    failed: boolean;
}): import("react").JSX.Element;
/** Rows whose detail is a file the reader can open — only these get the dimmer,
 *  dotted-underline link treatment. A command or a search pattern is not a
 *  link, so it stays in the verb's tone. */
export declare const FILE_DETAIL: Set<MarkerTool>;
//# sourceMappingURL=tool-glyph.d.ts.map
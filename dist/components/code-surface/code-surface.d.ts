/**
 * The code surfaces' shared half, with no React in it: the class tables, the
 * path and duration helpers, and the terminal's segment model.
 *
 * Every class here is a whole literal string. Tailwind finds classes by
 * reading the source, so `text-syntax-${role}` would compile to nothing and
 * render uncoloured, with no error anywhere.
 */
import type { CSSProperties } from "react";
/** The theme's `syntax.*` keys, one per highlighting role. */
export type SyntaxRole = "attribute" | "comment" | "constant" | "definition" | "escape" | "function" | "keyword" | "number" | "operator" | "property" | "regexp" | "string" | "tag" | "type" | "variable";
export declare const SYNTAX_TEXT_CLASS: Readonly<Record<SyntaxRole, string>>;
/**
 * A path's parts, for breadcrumbs. With `root`, the root is stripped only when
 * the path is the root itself or strictly inside it: `/a/b` is not a root of
 * `/a/bc/x`, which a bare `startsWith` would have said it was.
 */
export declare function pathSegments(path: string, root?: string): string[];
export type CollapsedSegment = {
    kind: "segment";
    label: string;
    index: number;
} | {
    kind: "ellipsis";
    hidden: string[];
};
/**
 * At most `max` crumbs: the first, one ellipsis standing for the middle, and
 * the last `max - 2`. A list that fits comes back whole. `max` below 3 is
 * read as 3, the fewest that leave room for the ellipsis.
 */
export declare function collapseSegments(segments: readonly string[], max?: number): CollapsedSegment[];
/**
 * "850ms" / "4.2s" / "12s" / "1m 12s" / "1h 3m": a terminal block's duration.
 * Seconds round once, before minutes are split off, so 59,999 ms is "1m 0s",
 * never "60s".
 */
export declare function formatDuration(ms: number): string;
/** An ANSI palette slot: 0–7 normal, 8–15 bright. */
export type AnsiIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export declare const ANSI_NAMES: readonly ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "bright-black", "bright-red", "bright-green", "bright-yellow", "bright-blue", "bright-magenta", "bright-cyan", "bright-white"];
export declare const ANSI_TEXT_CLASS: readonly string[];
export declare const ANSI_BG_CLASS: readonly string[];
export type TerminalLinkKind = "url" | "path";
/**
 * One styled run of terminal output. Two ways to colour it, which can mix:
 * `fg`/`bg` and the flags pick the package's classes, and `style` passes
 * through untouched, so a line emulator that already emits
 * `{ color: "var(--terminal-ansi-red)" }` (desktop's `AnsiSegment` and
 * `LinkedRun` are both assignable) recolours with the theme on its own.
 *
 * `kind` marks a link; `target` is the whole link when it spans several runs
 * (a URL a tool prints in two colours), which is what activating it opens.
 */
export interface TerminalSegment {
    text: string;
    fg?: AnsiIndex;
    bg?: AnsiIndex;
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    inverse?: boolean;
    style?: CSSProperties;
    kind?: "text" | TerminalLinkKind;
    target?: string;
}
export interface TerminalLine {
    /** Stable for the row's life: the React key, and what lets its memo hold. */
    id?: string | number;
    segments: readonly TerminalSegment[];
}
/**
 * The classes for one segment, or `undefined` when it has none. `inverse`
 * swaps the colours; with no colour on a side, the swap takes the terminal's
 * own foreground or background for it.
 */
export declare function segmentClassName(segment: TerminalSegment): string | undefined;
/**
 * Where `query` occurs in `text`, case-insensitively: `[start, end)` pairs,
 * left to right, never overlapping. An empty query matches nothing.
 */
export declare function highlightRanges(text: string, query: string): Array<[number, number]>;
//# sourceMappingURL=code-surface.d.ts.map
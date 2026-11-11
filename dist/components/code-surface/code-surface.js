export const SYNTAX_TEXT_CLASS = {
    attribute: "text-syntax-attribute",
    comment: "text-syntax-comment",
    constant: "text-syntax-constant",
    definition: "text-syntax-definition",
    escape: "text-syntax-escape",
    function: "text-syntax-function",
    keyword: "text-syntax-keyword",
    number: "text-syntax-number",
    operator: "text-syntax-operator",
    property: "text-syntax-property",
    regexp: "text-syntax-regexp",
    string: "text-syntax-string",
    tag: "text-syntax-tag",
    type: "text-syntax-type",
    variable: "text-syntax-variable",
};
// ── Paths ────────────────────────────────────────────────────────────────────
/**
 * A path's parts, for breadcrumbs. With `root`, the root is stripped only when
 * the path is the root itself or strictly inside it: `/a/b` is not a root of
 * `/a/bc/x`, which a bare `startsWith` would have said it was.
 */
export function pathSegments(path, root) {
    let rest = path;
    if (root) {
        const base = root.endsWith("/") ? root.slice(0, -1) : root;
        if (path === base || path === root)
            rest = "";
        else if (path.startsWith(`${base}/`))
            rest = path.slice(base.length + 1);
    }
    return rest.split("/").filter(Boolean);
}
/**
 * At most `max` crumbs: the first, one ellipsis standing for the middle, and
 * the last `max - 2`. A list that fits comes back whole. `max` below 3 is
 * read as 3, the fewest that leave room for the ellipsis.
 */
export function collapseSegments(segments, max = 4) {
    const all = segments.map((label, index) => ({ kind: "segment", label, index }));
    const limit = Math.max(3, max);
    if (segments.length <= limit)
        return all;
    const tail = limit - 2;
    return [
        all[0],
        { kind: "ellipsis", hidden: segments.slice(1, segments.length - tail) },
        ...all.slice(segments.length - tail),
    ];
}
// ── Duration ─────────────────────────────────────────────────────────────────
/**
 * "850ms" / "4.2s" / "12s" / "1m 12s" / "1h 3m": a terminal block's duration.
 * Seconds round once, before minutes are split off, so 59,999 ms is "1m 0s",
 * never "60s".
 */
export function formatDuration(ms) {
    // Below 999.5 so a value that rounds to 1000 reads "1.0s", not "1000ms".
    if (ms < 999.5)
        return `${Math.round(ms)}ms`;
    if (ms < 9950)
        return `${(ms / 1000).toFixed(1)}s`;
    const s = Math.round(ms / 1000);
    if (s < 60)
        return `${s}s`;
    if (s < 3600)
        return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}
export const ANSI_NAMES = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "bright-black",
    "bright-red",
    "bright-green",
    "bright-yellow",
    "bright-blue",
    "bright-magenta",
    "bright-cyan",
    "bright-white",
];
export const ANSI_TEXT_CLASS = [
    "text-terminal-ansi-black",
    "text-terminal-ansi-red",
    "text-terminal-ansi-green",
    "text-terminal-ansi-yellow",
    "text-terminal-ansi-blue",
    "text-terminal-ansi-magenta",
    "text-terminal-ansi-cyan",
    "text-terminal-ansi-white",
    "text-terminal-ansi-bright-black",
    "text-terminal-ansi-bright-red",
    "text-terminal-ansi-bright-green",
    "text-terminal-ansi-bright-yellow",
    "text-terminal-ansi-bright-blue",
    "text-terminal-ansi-bright-magenta",
    "text-terminal-ansi-bright-cyan",
    "text-terminal-ansi-bright-white",
];
export const ANSI_BG_CLASS = [
    "bg-terminal-ansi-black",
    "bg-terminal-ansi-red",
    "bg-terminal-ansi-green",
    "bg-terminal-ansi-yellow",
    "bg-terminal-ansi-blue",
    "bg-terminal-ansi-magenta",
    "bg-terminal-ansi-cyan",
    "bg-terminal-ansi-white",
    "bg-terminal-ansi-bright-black",
    "bg-terminal-ansi-bright-red",
    "bg-terminal-ansi-bright-green",
    "bg-terminal-ansi-bright-yellow",
    "bg-terminal-ansi-bright-blue",
    "bg-terminal-ansi-bright-magenta",
    "bg-terminal-ansi-bright-cyan",
    "bg-terminal-ansi-bright-white",
];
/**
 * The classes for one segment, or `undefined` when it has none. `inverse`
 * swaps the colours; with no colour on a side, the swap takes the terminal's
 * own foreground or background for it.
 */
export function segmentClassName(segment) {
    const classes = [];
    let fg = segment.fg;
    let bg = segment.bg;
    if (segment.inverse) {
        [fg, bg] = [bg, fg];
        classes.push(fg === undefined ? "text-terminal-background" : ANSI_TEXT_CLASS[fg]);
        classes.push(bg === undefined ? "bg-terminal-foreground" : ANSI_BG_CLASS[bg]);
    }
    else {
        if (fg !== undefined)
            classes.push(ANSI_TEXT_CLASS[fg]);
        if (bg !== undefined)
            classes.push(ANSI_BG_CLASS[bg]);
    }
    if (segment.bold)
        classes.push("font-semibold");
    if (segment.dim)
        classes.push("opacity-60");
    if (segment.italic)
        classes.push("italic");
    if (segment.underline)
        classes.push("underline");
    if (segment.kind === "url" || segment.kind === "path") {
        classes.push("cursor-pointer hover:text-primary hover:underline");
    }
    return classes.length ? classes.join(" ") : undefined;
}
/**
 * Where `query` occurs in `text`, case-insensitively: `[start, end)` pairs,
 * left to right, never overlapping. An empty query matches nothing.
 */
export function highlightRanges(text, query) {
    if (!query || !text)
        return [];
    // A case-insensitive search over `text` itself: lower-casing first would
    // shift indices wherever a character changes length when lower-cased ("İ").
    const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return Array.from(text.matchAll(pattern), (m) => [
        m.index,
        m.index + m[0].length,
    ]);
}
//# sourceMappingURL=code-surface.js.map
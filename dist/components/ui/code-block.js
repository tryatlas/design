import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * A monospace run.
 *
 * `inline` for a path or a flag inside a sentence; `block` for a snippet.
 * Both use the `code` text style, which turns on the `zero` and `ss02` font
 * features — slashed zero and disambiguated glyphs, so `0`/`O` and `1`/`l`
 * are distinguishable in a session ID.
 */
function Code({ className, variant = "inline", ...props }) {
    return (_jsx("code", { "data-slot": "code", "data-variant": variant, 
        // A block scrolls sideways, so a keyboard has to be able to reach it.
        tabIndex: variant === "block" ? 0 : undefined, className: cn("code", variant === "inline" &&
            "rounded-sm border border-border-subtle bg-card px-1 py-px text-secondary-foreground", variant === "block" &&
            "block overflow-x-auto rounded-md border border-border bg-panel p-3 text-secondary-foreground", className), ...props }));
}
/**
 * A line count as desktop's changed-files card prints it: as is below a
 * thousand, then `1.2k`, `12k`, `1.2m`. One decimal under ten, none above, and
 * a trailing `.0` dropped. 999,600 reads as `1m`, not `1000k`.
 */
function formatDiffCount(value) {
    const scaled = (n, unit) => `${n < 10 ? n.toFixed(1).replace(/\.0$/, "") : Math.round(n)}${unit}`;
    if (value < 1000)
        return String(value);
    if (value < 999_500)
        return scaled(value / 1000, "k");
    return scaled(value / 1_000_000, "m");
}
/**
 * A +/- pair, as shown on a session row, in the theme's diff inks (the
 * `diff.*.text` keys, as desktop's rows read them). Tabular so columns do
 * not jitter. The minus is U+2212, not a hyphen, so it lines up with the plus.
 *
 * Opt-ins, each one of desktop's diffstats:
 *
 * - `compact` shortens large counts (`formatDiffCount`): the changed-files card.
 * - `hideZero` drops a side that is zero, and draws nothing when both are:
 *   the checkpoint picker and the marker rows, where `+0` is noise.
 * - `layout="aligned"` sets the two sides in fixed 4ch columns,
 *   right-aligned, so a column of rows lines up figure under figure: the
 *   changed-files tree.
 * - `label` names the pair for a screen reader ("12 added, 3 removed") and
 *   hides the glyphs, which read as "plus twelve minus three".
 */
function DiffStat({ added, removed, compact = false, hideZero = false, layout = "inline", label, className, ...props }) {
    if (hideZero && added === 0 && removed === 0)
        return null;
    const count = compact ? formatDiffCount : String;
    const hidden = label ? true : undefined;
    // An aligned column keeps the hidden side's cell, so the other side stays
    // in its own column.
    const empty = layout === "aligned" ? _jsx("span", { "aria-hidden": "true" }) : null;
    return (_jsxs("span", { "data-slot": "diff-stat", "data-layout": layout === "aligned" ? layout : undefined, role: label ? "group" : undefined, "aria-label": label, className: cn(layout === "aligned"
            ? "inline-grid grid-cols-[4ch_4ch] gap-2 text-right text-2xs tabular-nums"
            : "inline-flex items-center gap-1.5 text-2xs tabular-nums", className), ...props, children: [hideZero && added === 0 ? (empty) : (_jsxs("span", { "aria-hidden": hidden, className: "text-(--diff-added-text)", children: ["+", count(added)] })), hideZero && removed === 0 ? (empty) : (_jsxs("span", { "aria-hidden": hidden, className: "text-(--diff-removed-text)", children: ["\u2212", count(removed)] }))] }));
}
export { Code, DiffStat, formatDiffCount };
//# sourceMappingURL=code-block.js.map
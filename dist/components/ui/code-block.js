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
    return (_jsx("code", { "data-slot": "code", "data-variant": variant, className: cn("code", variant === "inline" &&
            "rounded-sm border border-border-subtle bg-card px-1 py-px text-secondary-foreground", variant === "block" &&
            "block overflow-x-auto rounded-md border border-border bg-panel p-3 text-secondary-foreground", className), ...props }));
}
/** A +/- pair, as shown on a session row, in the theme's diff inks (the
 *  `diff.*.text` keys, as desktop's rows read them). Tabular so columns do
 *  not jitter. */
function DiffStat({ added, removed, className, ...props }) {
    return (_jsxs("span", { "data-slot": "diff-stat", className: cn("inline-flex items-center gap-1.5 text-2xs tabular-nums", className), ...props, children: [_jsxs("span", { className: "text-(--diff-added-text)", children: ["+", added] }), _jsxs("span", { className: "text-(--diff-removed-text)", children: ["\u2212", removed] })] }));
}
export { Code, DiffStat };
//# sourceMappingURL=code-block.js.map
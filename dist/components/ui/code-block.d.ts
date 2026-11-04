/**
 * A monospace run.
 *
 * `inline` for a path or a flag inside a sentence; `block` for a snippet.
 * Both use the `code` text style, which turns on the `zero` and `ss02` font
 * features — slashed zero and disambiguated glyphs, so `0`/`O` and `1`/`l`
 * are distinguishable in a session ID.
 */
declare function Code({ className, variant, ...props }: React.ComponentProps<"code"> & {
    variant?: "inline" | "block";
}): import("react").JSX.Element;
/** A +/- pair, as shown on a session row, in the theme's diff inks (the
 *  `diff.*.text` keys, as desktop's rows read them). Tabular so columns do
 *  not jitter. */
declare function DiffStat({ added, removed, className, ...props }: React.ComponentProps<"span"> & {
    added: number;
    removed: number;
}): import("react").JSX.Element;
export { Code, DiffStat };
//# sourceMappingURL=code-block.d.ts.map
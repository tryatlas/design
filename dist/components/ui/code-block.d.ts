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
/**
 * A fenced block in running text: a message's ```ts fence, with its language
 * named in small caps inside the box, above the code. Desktop's team-chat
 * block, as a component: `Code variant="block"` sets its own padding and the
 * `code` type step, which suit a snippet on a page, not a block in a message.
 *
 * The box owns the surface and the padding. Hand it the `<code>` your
 * markdown renderer made (react-markdown's `pre` override receives it as
 * `children`), highlighted or not: a highlighter's own padding and background
 * (`syntax.css`'s `pre code.hljs`) are cancelled inside it, so there is one
 * box, not a box in a box. The label is not selectable, so copying the block
 * copies only the code. Margins are the host's.
 */
declare function CodeFence({ className, language, children, ...props }: React.ComponentProps<"pre"> & {
    /** "ts", "rust"… from the fence's info string. Unset, no label. */
    language?: string | null;
}): import("react").JSX.Element;
/**
 * A line count as desktop's changed-files card prints it: as is below a
 * thousand, then `1.2k`, `12k`, `1.2m`. One decimal under ten, none above, and
 * a trailing `.0` dropped. 999,600 reads as `1m`, not `1000k`.
 */
declare function formatDiffCount(value: number): string;
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
declare function DiffStat({ added, removed, compact, hideZero, layout, label, className, ...props }: React.ComponentProps<"span"> & {
    added: number;
    removed: number;
    compact?: boolean;
    hideZero?: boolean;
    layout?: "inline" | "aligned";
    label?: string;
}): import("react").JSX.Element | null;
export { Code, CodeFence, DiffStat, formatDiffCount };
//# sourceMappingURL=code-block.d.ts.map
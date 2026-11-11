import { cn } from "../../lib/utils.ts";

/**
 * A monospace run.
 *
 * `inline` for a path or a flag inside a sentence; `block` for a snippet.
 * Both use the `code` text style, which turns on the `zero` and `ss02` font
 * features — slashed zero and disambiguated glyphs, so `0`/`O` and `1`/`l`
 * are distinguishable in a session ID.
 */
function Code({
  className,
  variant = "inline",
  ...props
}: React.ComponentProps<"code"> & { variant?: "inline" | "block" }) {
  return (
    <code
      data-slot="code"
      data-variant={variant}
      // A block scrolls sideways, so a keyboard has to be able to reach it.
      tabIndex={variant === "block" ? 0 : undefined}
      className={cn(
        "code",
        variant === "inline" &&
          "rounded-sm border border-border-subtle bg-card px-1 py-px text-secondary-foreground",
        variant === "block" &&
          "block overflow-x-auto rounded-md border border-border bg-panel p-3 text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

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
function CodeFence({
  className,
  language,
  children,
  ...props
}: React.ComponentProps<"pre"> & {
  /** "ts", "rust"… from the fence's info string. Unset, no label. */
  language?: string | null;
}) {
  return (
    <pre
      data-slot="code-fence"
      // It scrolls sideways, so a keyboard has to be able to reach it.
      tabIndex={0}
      className={cn(
        "overflow-x-auto rounded-md border border-border-subtle bg-card px-2.5 py-2",
        "font-mono text-xs leading-[1.55] text-secondary-foreground",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        // `syntax.css` is unlayered, so only `!` outranks it.
        "[&_code.hljs]:overflow-visible! [&_code.hljs]:bg-transparent! [&_code.hljs]:p-0!",
        className,
      )}
      {...props}
    >
      {language && (
        <span
          data-slot="code-fence-language"
          className="mb-1 block text-3xs tracking-wide text-disabled uppercase select-none"
        >
          {language}
        </span>
      )}
      {children}
    </pre>
  );
}

/**
 * A line count as desktop's changed-files card prints it: as is below a
 * thousand, then `1.2k`, `12k`, `1.2m`. One decimal under ten, none above, and
 * a trailing `.0` dropped. 999,600 reads as `1m`, not `1000k`.
 */
function formatDiffCount(value: number): string {
  const scaled = (n: number, unit: string) =>
    `${n < 10 ? n.toFixed(1).replace(/\.0$/, "") : Math.round(n)}${unit}`;
  if (value < 1000) return String(value);
  if (value < 999_500) return scaled(value / 1000, "k");
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
function DiffStat({
  added,
  removed,
  compact = false,
  hideZero = false,
  layout = "inline",
  label,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  added: number;
  removed: number;
  compact?: boolean;
  hideZero?: boolean;
  layout?: "inline" | "aligned";
  label?: string;
}) {
  if (hideZero && added === 0 && removed === 0) return null;
  const count = compact ? formatDiffCount : String;
  const hidden = label ? true : undefined;
  // An aligned column keeps the hidden side's cell, so the other side stays
  // in its own column.
  const empty = layout === "aligned" ? <span aria-hidden="true" /> : null;
  return (
    <span
      data-slot="diff-stat"
      data-layout={layout === "aligned" ? layout : undefined}
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn(
        layout === "aligned"
          ? "inline-grid grid-cols-[4ch_4ch] gap-2 text-right text-2xs tabular-nums"
          : "inline-flex items-center gap-1.5 text-2xs tabular-nums",
        className,
      )}
      {...props}
    >
      {hideZero && added === 0 ? (
        empty
      ) : (
        <span aria-hidden={hidden} className="text-(--diff-added-text)">
          +{count(added)}
        </span>
      )}
      {hideZero && removed === 0 ? (
        empty
      ) : (
        <span aria-hidden={hidden} className="text-(--diff-removed-text)">
          −{count(removed)}
        </span>
      )}
    </span>
  );
}

export { Code, CodeFence, DiffStat, formatDiffCount };

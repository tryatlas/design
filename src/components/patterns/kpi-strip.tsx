import { cn } from "../../lib/utils.ts";
import { DotMatrix } from "./dot-matrix.tsx";

/**
 * A headline band: figures separated by hairlines inside one card, each a
 * caption, the number, its period-over-period chip and the trend that
 * produced it. Desktop's usage `StatStrip`, generalised over its cells.
 */

export type KpiCell = {
  id: string;
  label: React.ReactNode;
  value: React.ReactNode;
  /** Change against the previous period as a fraction (0.08 is +8%). `null`
   *  when there is no previous period to compare with. */
  delta?: number | null;
  /** The trend, one value per period, oldest first. */
  spark?: ReadonlyArray<number | null>;
  /** A neutral note under the figure, for spend and other unjudged figures. */
  detail?: React.ReactNode;
  /** Which way is good news for this figure; see `DeltaChip`. */
  tone?: DeltaTone;
};

/**
 * Which way is good news. `neutral` (the default) judges nothing; `up-good`
 * suits a figure that should grow (sessions merged), `down-good` one that
 * should shrink (cost per session, time to merge).
 */
export type DeltaTone = "neutral" | "up-good" | "down-good";

/**
 * Period-over-period change as a small chip: `▲ 8%` / `▼ 3%`. NEUTRAL by
 * default — more tokens is neither good nor bad, so the chip informs and does
 * not judge. A figure that does have a good direction says so with `tone`,
 * and the chip turns success or error the way `Badge` does; the arrow still
 * carries the direction, so the colour is never the only signal, and a flat
 * change stays neutral. Renders nothing when there is no previous period.
 * Desktop's `DeltaChip`.
 */
function DeltaChip({
  delta,
  tone = "neutral",
  className,
}: {
  delta: number | null;
  tone?: DeltaTone;
  className?: string;
}) {
  if (delta === null || !Number.isFinite(delta)) return null;
  const pct = Math.round(Math.abs(delta) * 100);
  const flat = pct === 0;
  const verdict =
    tone === "neutral" || flat ? "neutral" : delta > 0 === (tone === "up-good") ? "good" : "bad";
  return (
    <span
      data-slot="delta-chip"
      data-tone={verdict}
      className={cn(
        "inline-flex h-4 shrink-0 items-center gap-0.5 rounded-full whitespace-nowrap border px-1.5",
        "text-3xs font-medium tabular-nums",
        verdict === "good"
          ? "border-transparent bg-success-muted text-success"
          : verdict === "bad"
            ? "border-transparent bg-error-muted text-error"
            : "border-element-active text-secondary-foreground",
        className,
      )}
      title="vs the previous period of the same length"
    >
      {flat ? "—" : delta > 0 ? "▲" : "▼"}
      {!flat && ` ${pct}%`}
    </span>
  );
}

/** One row of every figure once the strip is wide, as many columns as cells (up to six). */
const WIDE_COLS = [
  "@xl:grid-cols-1",
  "@xl:grid-cols-1",
  "@xl:grid-cols-2",
  "@xl:grid-cols-3",
  "@xl:grid-cols-4",
  "@xl:grid-cols-5",
  "@xl:grid-cols-6",
] as const;

/**
 * Two figures a row in a narrow strip, all of them on one row from 36rem of
 * its own width (up to six, as many columns as cells). The
 * hairlines are the 1px gaps of a grid over a hairline-coloured backing, as
 * `StatGrid`'s are, so they survive the wrap (a `divide-x` did not). The
 * strip is a container, and the grid inside it is what the query sizes: a
 * container query never sees the element that declares it.
 */
function KpiStrip({ cells, className }: { cells: Array<KpiCell>; className?: string }) {
  return (
    <div data-slot="kpi-strip" className={cn("@container overflow-hidden surface-card", className)}>
      <div
        className={cn(
          "grid gap-px bg-element-selected",
          cells.length === 1 ? "grid-cols-1" : "grid-cols-2",
          // An odd count's last figure takes the whole row, so no empty slot
          // shows the hairline backing.
          "*:last:odd:col-span-2 @xl:*:last:odd:col-span-1",
          WIDE_COLS[Math.min(cells.length, 6)],
        )}
      >
        {cells.map((cell) => (
          <div key={cell.id} className="min-w-0 bg-card px-3.5 py-3">
            <div className="truncate eyebrow">{cell.label}</div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="truncate text-xl leading-none font-semibold text-foreground tabular-nums">
                {cell.value}
              </span>
              {cell.delta !== undefined && <DeltaChip delta={cell.delta} tone={cell.tone} />}
            </div>
            {cell.spark && <DotMatrix values={cell.spark} className="mt-2.5" />}
            {cell.detail && <div className="mt-1.5 caption">{cell.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export { DeltaChip, KpiStrip };

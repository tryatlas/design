import { cn } from "../../lib/utils.ts";
import { DotMatrix, SegmentMeter } from "./dot-matrix.tsx";
import { DeltaChip, type DeltaTone } from "./kpi-strip.tsx";
import type { LabelTone } from "../../lib/types.ts";

/**
 * The dashboard's number cells, and the strip that holds them.
 *
 * `StatGrid` is the KPI strip's material — one `bg-card` block with an
 * `element-selected` hairline — with the cells split by hairlines rather than
 * floated as separate cards, so a row of five figures reads as one reading
 * of the workspace. The hairlines are the 1px gaps of a grid laid over a
 * hairline-coloured backing, which (unlike `divide-x`) survives the strip
 * wrapping to two columns on a narrow screen.
 *
 * `StatCard` is a headline figure with its trend and a dot-matrix of the
 * period; `MeterCard` is one part of a whole — its figure, its share, and a
 * segment meter.
 *
 * The trend is the KPI strip's neutral `DeltaChip`, so a figure reads the
 * same on the dashboard as it does anywhere else a KPI is shown.
 */

function StatCard({
  label,
  badge,
  value,
  trend,
  trendTone,
  series,
  className,
}: {
  label: string;
  /** A qualifier beside the label, e.g. "est." on a cost. */
  badge?: string;
  value: React.ReactNode;
  /** Change against the previous period as a fraction (0.08 is +8%). */
  trend?: number | null;
  /** Which way is good news for the trend (`DeltaChip`'s `tone`). Neutral by default. */
  trendTone?: DeltaTone;
  series?: ReadonlyArray<number | null>;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 bg-card px-3.5 py-3", className)}>
      {/* Fixed height, so a badge beside one label does not push that
          card's figure out of line with its neighbours. */}
      <div className="flex h-4 items-center gap-1.5">
        <span className="truncate eyebrow">{label}</span>
        {badge && (
          <span className="inline-flex h-4 items-center rounded-full border border-element-active px-1.5 text-3xs font-medium text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-xl leading-none font-semibold text-foreground tabular-nums">
          {value}
        </span>
        {trend !== undefined && <DeltaChip delta={trend} tone={trendTone} />}
      </div>
      {series && <DotMatrix values={series} className="mt-auto pt-1" />}
    </div>
  );
}

function MeterCard({
  label,
  value,
  share,
  hue,
  className,
}: {
  label: string;
  value: React.ReactNode;
  /** 0–1: this part's share of the whole. */
  share: number;
  /** The identity hue of the thing measured. */
  hue?: LabelTone;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 bg-card px-3.5 py-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate eyebrow">{label}</span>
        <span className="text-3xs text-muted-foreground tabular-nums">
          {Math.round(share * 100)}%
        </span>
      </div>
      <span className="text-xl leading-none font-semibold text-foreground tabular-nums">
        {value}
      </span>
      <SegmentMeter value={share} hue={hue} label={label} className="mt-auto" />
    </div>
  );
}

function StatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-grid"
      className={cn("grid gap-px overflow-hidden surface-card bg-element-selected", className)}
      {...props}
    />
  );
}

export { MeterCard, StatCard, StatGrid };

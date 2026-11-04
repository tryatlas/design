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
declare function StatCard({ label, badge, value, trend, series, className, }: {
    label: string;
    /** A qualifier beside the label, e.g. "est." on a cost. */
    badge?: string;
    value: React.ReactNode;
    /** Change against the previous period as a fraction (0.08 is +8%). */
    trend?: number | null;
    series?: ReadonlyArray<number | null>;
    className?: string;
}): import("react").JSX.Element;
declare function MeterCard({ label, value, share, hue, className, }: {
    label: string;
    value: React.ReactNode;
    /** 0–1: this part's share of the whole. */
    share: number;
    /** The identity hue of the thing measured. */
    hue?: LabelTone;
    className?: string;
}): import("react").JSX.Element;
declare function StatGrid({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { MeterCard, StatCard, StatGrid };
//# sourceMappingURL=stat-card.d.ts.map
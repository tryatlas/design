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
declare function DeltaChip({ delta, tone, className, }: {
    delta: number | null;
    tone?: DeltaTone;
    className?: string;
}): import("react").JSX.Element | null;
declare function KpiStrip({ cells, className }: {
    cells: Array<KpiCell>;
    className?: string;
}): import("react").JSX.Element;
export { DeltaChip, KpiStrip };
//# sourceMappingURL=kpi-strip.d.ts.map
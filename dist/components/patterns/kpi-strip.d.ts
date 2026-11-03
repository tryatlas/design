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
};
/**
 * Period-over-period change as a small chip: `▲ 8%` / `▼ 3%`. Deliberately
 * NEUTRAL — more tokens is neither good nor bad, so the chip informs and does
 * not judge. Renders nothing when there is no previous period. Desktop's
 * `DeltaChip`.
 */
declare function DeltaChip({ delta, className }: {
    delta: number | null;
    className?: string;
}): import("react").JSX.Element | null;
declare function KpiStrip({ cells, className }: {
    cells: Array<KpiCell>;
    className?: string;
}): import("react").JSX.Element;
export { DeltaChip, KpiStrip };
//# sourceMappingURL=kpi-strip.d.ts.map
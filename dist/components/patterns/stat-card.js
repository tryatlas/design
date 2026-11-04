import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { DotMatrix, SegmentMeter } from "./dot-matrix.js";
import { DeltaChip } from "./kpi-strip.js";
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
function StatCard({ label, badge, value, trend, trendTone, series, className, }) {
    return (_jsxs("div", { className: cn("flex min-w-0 flex-col gap-1.5 bg-card px-3.5 py-3", className), children: [_jsxs("div", { className: "flex h-4 items-center gap-1.5", children: [_jsx("span", { className: "truncate eyebrow", children: label }), badge && (_jsx("span", { className: "inline-flex h-4 items-center rounded-full border border-element-active px-1.5 text-3xs font-medium text-muted-foreground", children: badge }))] }), _jsxs("div", { className: "flex flex-wrap items-baseline gap-2", children: [_jsx("span", { className: "text-xl leading-none font-semibold text-foreground tabular-nums", children: value }), trend !== undefined && _jsx(DeltaChip, { delta: trend, tone: trendTone })] }), series && _jsx(DotMatrix, { values: series, className: "mt-auto pt-1" })] }));
}
function MeterCard({ label, value, share, hue, className, }) {
    return (_jsxs("div", { className: cn("flex min-w-0 flex-col gap-2 bg-card px-3.5 py-3", className), children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "truncate eyebrow", children: label }), _jsxs("span", { className: "text-3xs text-muted-foreground tabular-nums", children: [Math.round(share * 100), "%"] })] }), _jsx("span", { className: "text-xl leading-none font-semibold text-foreground tabular-nums", children: value }), _jsx(SegmentMeter, { value: share, hue: hue, label: label, className: "mt-auto" })] }));
}
function StatGrid({ className, ...props }) {
    return (_jsx("div", { "data-slot": "stat-grid", className: cn("grid gap-px overflow-hidden rounded-lg border border-element-selected bg-element-selected", className), ...props }));
}
export { MeterCard, StatCard, StatGrid };
//# sourceMappingURL=stat-card.js.map
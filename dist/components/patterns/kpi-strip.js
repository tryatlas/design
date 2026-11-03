import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { DotMatrix } from "./dot-matrix.js";
/**
 * Period-over-period change as a small chip: `▲ 8%` / `▼ 3%`. Deliberately
 * NEUTRAL — more tokens is neither good nor bad, so the chip informs and does
 * not judge. Renders nothing when there is no previous period. Desktop's
 * `DeltaChip`.
 */
function DeltaChip({ delta, className }) {
    if (delta === null || !Number.isFinite(delta))
        return null;
    const pct = Math.round(Math.abs(delta) * 100);
    const flat = pct === 0;
    return (_jsxs("span", { "data-slot": "delta-chip", className: cn("inline-flex h-4 items-center gap-0.5 rounded-full border border-element-active px-1.5", "text-3xs font-medium tabular-nums text-secondary-foreground", className), title: "vs the previous period of the same length", children: [flat ? "—" : delta > 0 ? "▲" : "▼", !flat && ` ${pct}%`] }));
}
function KpiStrip({ cells, className }) {
    return (_jsx("div", { "data-slot": "kpi-strip", className: cn("grid divide-x divide-element-selected rounded-lg border border-element-selected bg-card", className), style: { gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }, children: cells.map((cell) => (_jsxs("div", { className: "min-w-0 px-3.5 py-3", children: [_jsx("div", { className: "truncate eyebrow", children: cell.label }), _jsxs("div", { className: "mt-1.5 flex items-baseline gap-2", children: [_jsx("span", { className: "truncate text-xl leading-none font-semibold text-foreground tabular-nums", children: cell.value }), cell.delta !== undefined && _jsx(DeltaChip, { delta: cell.delta })] }), cell.spark && _jsx(DotMatrix, { values: cell.spark, className: "mt-2.5" }), cell.detail && _jsx("div", { className: "mt-1.5 caption", children: cell.detail })] }, cell.id))) }));
}
export { DeltaChip, KpiStrip };
//# sourceMappingURL=kpi-strip.js.map
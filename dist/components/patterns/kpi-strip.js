import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { DotMatrix } from "./dot-matrix.js";
/**
 * Period-over-period change as a small chip: `▲ 8%` / `▼ 3%`. NEUTRAL by
 * default — more tokens is neither good nor bad, so the chip informs and does
 * not judge. A figure that does have a good direction says so with `tone`,
 * and the chip turns success or error the way `Badge` does; the arrow still
 * carries the direction, so the colour is never the only signal, and a flat
 * change stays neutral. Renders nothing when there is no previous period.
 * Desktop's `DeltaChip`.
 */
function DeltaChip({ delta, tone = "neutral", className, }) {
    if (delta === null || !Number.isFinite(delta))
        return null;
    const pct = Math.round(Math.abs(delta) * 100);
    const flat = pct === 0;
    const verdict = tone === "neutral" || flat ? "neutral" : delta > 0 === (tone === "up-good") ? "good" : "bad";
    return (_jsxs("span", { "data-slot": "delta-chip", "data-tone": verdict, className: cn("inline-flex h-4 shrink-0 items-center gap-0.5 rounded-full whitespace-nowrap border px-1.5", "text-3xs font-medium tabular-nums", verdict === "good"
            ? "border-transparent bg-success-muted text-success"
            : verdict === "bad"
                ? "border-transparent bg-error-muted text-error"
                : "border-element-active text-secondary-foreground", className), title: "vs the previous period of the same length", children: [flat ? "—" : delta > 0 ? "▲" : "▼", !flat && ` ${pct}%`] }));
}
function KpiStrip({ cells, className }) {
    return (_jsx("div", { "data-slot": "kpi-strip", className: cn("grid divide-x divide-element-selected rounded-lg border border-element-selected bg-card", className), style: { gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }, children: cells.map((cell) => (_jsxs("div", { className: "min-w-0 px-3.5 py-3", children: [_jsx("div", { className: "truncate eyebrow", children: cell.label }), _jsxs("div", { className: "mt-1.5 flex items-baseline gap-2", children: [_jsx("span", { className: "truncate text-xl leading-none font-semibold text-foreground tabular-nums", children: cell.value }), cell.delta !== undefined && _jsx(DeltaChip, { delta: cell.delta, tone: cell.tone })] }), cell.spark && _jsx(DotMatrix, { values: cell.spark, className: "mt-2.5" }), cell.detail && _jsx("div", { className: "mt-1.5 caption", children: cell.detail })] }, cell.id))) }));
}
export { DeltaChip, KpiStrip };
//# sourceMappingURL=kpi-strip.js.map
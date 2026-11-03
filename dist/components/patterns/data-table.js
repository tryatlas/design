"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.js";
function DataTable({ rows, columns, rowId, selectedId, onRowClick, toolbar, footer, className, }) {
    const [sort, setSort] = useState(null);
    const scroller = useRef(null);
    const edges = useScrollEdges(scroller, [rows]);
    const sorted = useMemo(() => {
        if (!sort)
            return rows;
        const col = columns.find((c) => c.id === sort.id);
        if (!col?.sortValue)
            return rows;
        const get = col.sortValue;
        return [...rows].sort((a, b) => {
            const av = get(a);
            const bv = get(b);
            const r = av < bv ? -1 : av > bv ? 1 : 0;
            return sort.dir === "asc" ? r : -r;
        });
    }, [rows, columns, sort]);
    function toggle(id) {
        setSort((s) => s?.id === id ? (s.dir === "asc" ? { id, dir: "desc" } : null) : { id, dir: "asc" });
    }
    return (_jsxs("div", { "data-slot": "data-table", className: cn(
        // A container, so columns can hide by the TABLE's width rather than
        // the viewport's — the dock and the interface scale both change one
        // without the other.
        "@container flex min-h-0 flex-col overflow-hidden rounded-lg border border-element-selected bg-card", className), children: [toolbar && (_jsx("div", { className: "flex h-9 shrink-0 items-center gap-2 border-b border-element-selected px-2", children: toolbar })), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx("div", { ref: scroller, className: "min-h-0 flex-1 overflow-auto", children: _jsxs("table", { className: "w-full border-separate border-spacing-0 text-xs", children: [_jsx("thead", { className: "sticky top-0 z-panel", children: _jsx("tr", { children: columns.map((col) => {
                                            const active = sort?.id === col.id;
                                            const sortable = !!col.sortValue;
                                            return (_jsx("th", { scope: "col", className: cn("h-control-md border-b border-element-selected bg-card px-3 text-left eyebrow whitespace-nowrap", col.align === "right" && "text-right", sortable && "cursor-pointer select-none hover:text-foreground", col.className), onClick: sortable ? () => toggle(col.id) : undefined, "aria-sort": active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined, children: _jsxs("span", { className: cn("inline-flex items-center gap-1", col.align === "right" && "flex-row-reverse"), children: [col.header, active && (_jsx(Icon, { icon: sort.dir === "asc" ? ArrowUpIcon : ArrowDownIcon, size: "xs", className: "size-2.5" }))] }) }, col.id));
                                        }) }) }), _jsx("tbody", { children: sorted.map((row) => {
                                        const id = rowId(row);
                                        const selected = id === selectedId;
                                        return (_jsx("tr", { onClick: onRowClick ? () => onRowClick(row) : undefined, "aria-selected": selected || undefined, className: cn("group/row transition-colors duration-fast ease-out-strong", selected ? "bg-element-selected" : "hover:bg-element-hover", onRowClick && "cursor-pointer"), children: columns.map((col) => (_jsx("td", { className: cn("h-8 border-b border-border-subtle px-3 align-middle", col.align === "right" && "text-right tabular-nums", col.className), children: col.cell(row) }, col.id))) }, id));
                                    }) })] }) }), _jsx(ScrollFade, { at: "bottom", visible: edges.bottom, className: "from-card" })] }), footer && (_jsx("div", { className: "flex h-control-lg shrink-0 items-center gap-2 border-t border-element-selected px-3 text-2xs text-muted-foreground", children: footer }))] }));
}
/** The toolbar search: desktop's usage-table field, a recessed well. */
function TableSearch({ className, ...props }) {
    return (_jsxs("div", { className: cn("relative", className), children: [_jsx(Icon, { icon: SearchIcon, size: "xs", className: "pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "search", className: "h-control-md w-50 rounded-md border border-border bg-background pr-2 pl-6 text-xs text-foreground outline-none focus-ring-none placeholder:text-muted-foreground focus:border-border-strong", ...props })] }));
}
export { DataTable, TableSearch };
//# sourceMappingURL=data-table.js.map
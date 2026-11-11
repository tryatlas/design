"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.js";
/** A header click: ascending, then descending, then unsorted. */
function nextSort(current, id) {
    if (current?.id !== id)
        return { id, dir: "asc" };
    return current.dir === "asc" ? { id, dir: "desc" } : null;
}
function DataTable({ rows, columns, rowId, selectedId, onRowClick, toolbar, footer, empty, sort: sortProp, onSortChange, manualSorting = false, className, }) {
    const [localSort, setLocalSort] = useState(null);
    const sort = sortProp !== undefined ? sortProp : localSort;
    const scroller = useRef(null);
    const edges = useScrollEdges(scroller, [rows]);
    const sorted = useMemo(() => {
        if (!sort || manualSorting)
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
    }, [rows, columns, sort, manualSorting]);
    function toggle(id) {
        const next = nextSort(sort, id);
        if (sortProp === undefined)
            setLocalSort(next);
        onSortChange?.(next);
    }
    return (_jsxs("div", { "data-slot": "data-table", className: cn(
        // A container, so columns can hide by the TABLE's width rather than
        // the viewport's — the dock and the interface scale both change one
        // without the other.
        "@container flex min-h-0 flex-col overflow-hidden surface-card", 
        // The scroller's keyboard focus rings the whole card (the global
        // ring's 2px, 2px out): drawn on the scroller, the sticky header and
        // the card's clip would hide most of it.
        "has-[[data-slot=data-table-scroller]:focus-visible]:outline-2 has-[[data-slot=data-table-scroller]:focus-visible]:outline-offset-2 has-[[data-slot=data-table-scroller]:focus-visible]:outline-ring has-[[data-slot=data-table-scroller]:focus-visible]:outline-solid", className), children: [toolbar && (_jsx("div", { className: "flex h-9 shrink-0 items-center gap-2 border-b border-element-selected px-2", children: toolbar })), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx("div", { ref: scroller, "data-slot": "data-table-scroller", tabIndex: 0, className: "min-h-0 flex-1 overflow-auto focus-ring-none", children: _jsxs("table", { className: "w-full border-separate border-spacing-0 text-xs", children: [_jsx("thead", { className: "sticky top-0 z-panel", children: _jsx("tr", { children: columns.map((col) => {
                                            const active = sort?.id === col.id;
                                            // Sorted here, a column needs a `sortValue`; sorted elsewhere,
                                            // `sortable` is enough. Otherwise the arrow would claim a
                                            // sort the rows don't show.
                                            const sortable = !!col.sortValue || (manualSorting && !!col.sortable);
                                            return (_jsx("th", { scope: "col", className: cn("h-control-md border-b border-element-selected bg-card px-3 text-left eyebrow whitespace-nowrap", col.align === "right" && "text-right", sortable && "cursor-pointer select-none hover:text-foreground", col.className), onClick: sortable ? () => toggle(col.id) : undefined, "aria-sort": active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined, children: _jsxs("span", { className: cn("inline-flex items-center gap-1", col.align === "right" && "flex-row-reverse"), children: [col.header, active && (_jsx(Icon, { icon: sort.dir === "asc" ? ArrowUpIcon : ArrowDownIcon, size: "xs", className: "size-2.5" }))] }) }, col.id));
                                        }) }) }), _jsxs("tbody", { children: [sorted.map((row) => {
                                            const id = rowId(row);
                                            const selected = id === selectedId;
                                            return (_jsx("tr", { onClick: onRowClick ? () => onRowClick(row) : undefined, 
                                                // A clickable row is a keyboard stop too: Tab reaches it,
                                                // Enter or Space opens it, as a click does. The ring is
                                                // drawn inset, since the scroller clips anything outside.
                                                tabIndex: onRowClick ? 0 : undefined, onKeyDown: onRowClick
                                                    ? (e) => {
                                                        if (e.target !== e.currentTarget)
                                                            return;
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            onRowClick(row);
                                                        }
                                                    }
                                                    : undefined, "aria-selected": selected || undefined, className: cn("group/row transition-colors duration-fast ease-out-strong", selected ? "bg-element-selected" : "hover:bg-element-hover", onRowClick && "cursor-pointer focus-visible:-outline-offset-2"), children: columns.map((col) => (_jsx("td", { className: cn("h-8 border-b border-border-subtle px-3 align-middle", col.align === "right" && "text-right tabular-nums", col.className), children: col.cell(row) }, col.id))) }, id));
                                        }), sorted.length === 0 && empty && (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "h-24 px-3 text-center caption", children: empty }) }))] })] }) }), _jsx(ScrollFade, { at: "bottom", visible: edges.bottom, className: "from-card" })] }), footer && (_jsx("div", { className: "flex h-control-lg shrink-0 items-center gap-2 border-t border-element-selected px-3 text-2xs text-muted-foreground", children: footer }))] }));
}
/** The toolbar search: desktop's usage-table field, a recessed well. */
function TableSearch({ className, ...props }) {
    return (_jsxs("div", { className: cn("relative", className), children: [_jsx(Icon, { icon: SearchIcon, size: "xs", className: "pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "search", className: "h-control-md w-50 rounded-md border border-border bg-background pr-2 pl-6 text-xs text-foreground outline-none focus-ring-none placeholder:text-muted-foreground focus:border-ring", ...props })] }));
}
export { DataTable, TableSearch };
//# sourceMappingURL=data-table.js.map
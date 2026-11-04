import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * A data table.
 *
 * A single hairline under the header, no
 * zebra striping, no vertical rules, 2rem rows, and the whole row highlighting
 * on hover. The grid is implied by alignment, not drawn.
 */
function Table({ className, ...props }) {
    return (_jsx("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: _jsx("table", { "data-slot": "table", className: cn("w-full caption-bottom text-xs", className), ...props }) }));
}
function TableHeader({ className, ...props }) {
    return (_jsx("thead", { "data-slot": "table-header", className: cn("[&_tr]:border-b [&_tr]:border-border-subtle", className), ...props }));
}
function TableBody({ className, ...props }) {
    return _jsx("tbody", { "data-slot": "table-body", className: cn(className), ...props });
}
function TableFooter({ className, ...props }) {
    return (_jsx("tfoot", { "data-slot": "table-footer", className: cn("border-t border-border-subtle font-medium text-secondary-foreground", className), ...props }));
}
function TableRow({ className, ...props }) {
    return (_jsx("tr", { "data-slot": "table-row", className: cn("border-b border-border-subtle transition-colors duration-fast ease-out-strong", "hover:bg-element-hover data-selected:bg-element-selected", "last:border-0", className), ...props }));
}
/** A column heading. `eyebrow`-cased, never the same weight as the data. */
function TableHead({ className, ...props }) {
    return (_jsx("th", { "data-slot": "table-head", className: cn("h-control-md px-3 text-left align-middle eyebrow whitespace-nowrap", "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0", className), ...props }));
}
function TableCell({ className, ...props }) {
    return (_jsx("td", { "data-slot": "table-cell", className: cn("h-8 px-3 align-middle whitespace-nowrap", "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0", className), ...props }));
}
function TableCaption({ className, ...props }) {
    return _jsx("caption", { "data-slot": "table-caption", className: cn("mt-3 caption", className), ...props });
}
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
//# sourceMappingURL=table.js.map
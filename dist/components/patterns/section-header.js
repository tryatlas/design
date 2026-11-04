import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * The small-caps label above a group of rows or cards.
 *
 * `eyebrow` rather than a heading: this labels a GROUP, and uppercase with
 * tracking is the one place this system allows it. A heading here would
 * compete with the page title.
 */
function SectionHeader({ className, title, description, action, ...props }) {
    return (_jsxs("div", { "data-slot": "section-header", className: cn("flex items-end justify-between gap-3 pb-2", className), ...props, children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("span", { className: "eyebrow", children: title }), description && _jsx("span", { className: "caption", children: description })] }), action && _jsx("div", { className: "shrink-0 pb-0.5", children: action })] }));
}
/**
 * The title block at the top of a page: name, one line of what it is, and at
 * most one primary action.
 */
function PageHeader({ className, title, description, action, ...props }) {
    return (_jsxs("div", { "data-slot": "page-header", className: cn("flex flex-wrap items-end justify-between gap-3 pb-4", className), ...props, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "truncate text-xl font-medium tracking-tight text-foreground", children: title }), description && (_jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: description }))] }), action && _jsx("div", { className: "shrink-0", children: action })] }));
}
export { PageHeader, SectionHeader };
//# sourceMappingURL=section-header.js.map
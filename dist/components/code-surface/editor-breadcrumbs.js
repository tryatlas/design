"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { cn } from "../../lib/utils.js";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "../ui/breadcrumb.js";
import { collapseSegments } from "./code-surface.js";
/**
 * The file view's path, desktop's `FileBreadcrumbs` in its looks: folders
 * muted, the file in the foreground, chevrons between. Each crumb truncates
 * on its own, and a long path keeps its first and last crumbs and folds the
 * middle into an ellipsis whose tooltip lists what it hides. The `nav`'s
 * tooltip is the whole path.
 *
 * Desktop's folder menus (the chevron that lists a folder's entries) read the
 * filesystem, so they stay in the app.
 */
export function EditorBreadcrumbs({ segments, maxVisible = 4, dirty, onSelect, className, }) {
    if (segments.length === 0)
        return null;
    const items = collapseSegments(segments, maxVisible);
    const last = segments.length - 1;
    return (_jsx(Breadcrumb, { "aria-label": "File path", title: segments.join("/"), "data-slot": "editor-breadcrumbs", className: cn("min-w-0", className), children: _jsx(BreadcrumbList, { className: "flex-nowrap gap-0 overflow-hidden", children: items.map((item, i) => {
                const separator = i < items.length - 1 && (_jsx(BreadcrumbSeparator, { className: "mx-0.5 shrink-0 text-muted-foreground" }));
                if (item.kind === "ellipsis") {
                    return (_jsxs(Fragment, { children: [_jsx(BreadcrumbItem, { className: "shrink-0", title: item.hidden.join("/"), children: _jsx(BreadcrumbEllipsis, {}) }), separator] }, "ellipsis"));
                }
                const crumb = item.index === last ? (_jsxs(BreadcrumbItem, { className: "min-w-0", children: [_jsx(BreadcrumbPage, { className: "block min-w-0 truncate px-0.5", children: item.label }), dirty && (_jsx("span", { role: "img", "aria-label": "Unsaved changes", className: "size-1.5 shrink-0 rounded-full bg-primary" }))] })) : (_jsx(BreadcrumbItem, { className: "shrink-0", children: onSelect ? (_jsx(BreadcrumbLink, { render: _jsx("button", { type: "button", onClick: () => onSelect(item.index) }), className: "block max-w-40 cursor-pointer truncate rounded-sm px-0.5 text-left outline-none hover:bg-element-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset", children: item.label })) : (_jsx("span", { className: "block max-w-40 truncate px-0.5", children: item.label })) }));
                return (_jsxs(Fragment, { children: [crumb, separator] }, item.index));
            }) }) }));
}
//# sourceMappingURL=editor-breadcrumbs.js.map
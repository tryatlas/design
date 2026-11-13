"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRightIcon, SlidersHorizontalIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
/**
 * The card of this system.
 *
 * `surface-card` — desktop's card: a hairline on a lighter step of the
 * ramp, never a shadow. A panel may carry a top-right action cluster
 * (filter, expand) of round ghost icon buttons; nothing in it is filled,
 * since the panel's content is the thing to read.
 *
 * Panels settle in with `animate-card-rise` (180ms, 4px up and a fade, a
 * fade alone under reduced motion), and a page staggers them down with
 * `index`, 30ms apart, so the eye is led rather than presented. CSS, not
 * `motion`: it plays while the page is busiest (the data just landed), and
 * a CSS animation stays off the main thread. The stagger stops at the sixth
 * panel; past that a wait is latency, not a lead.
 */
function Panel({ title, subtitle, actions, onExpand, onFilter, className, bodyClassName, children, index = 0, }) {
    return (_jsxs("section", { "data-slot": "panel", className: cn("flex min-w-0 animate-card-rise flex-col overflow-hidden surface-card", className), style: { "--i": Math.min(Math.max(index, 0), 5) }, children: [(title || actions || onExpand || onFilter) && (_jsxs("header", { className: "flex items-start justify-between gap-3 px-3.5 pt-3 pb-2", children: [_jsxs("div", { className: "min-w-0", children: [title && _jsx("h3", { className: "truncate text-sm font-medium text-foreground", children: title }), subtitle && _jsx("p", { className: "mt-0.5 truncate caption", children: subtitle })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [actions, onFilter && (_jsx(IconButton, { icon: SlidersHorizontalIcon, label: "Filter", size: "sm", shape: "round", onClick: onFilter })), onExpand && (_jsx(IconButton, { icon: ArrowUpRightIcon, label: "Open", size: "sm", shape: "round", onClick: onExpand }))] })] })), _jsx("div", { className: cn("min-h-0 flex-1 px-3.5 pt-1 pb-3.5", bodyClassName), children: children })] }));
}
export { Panel };
//# sourceMappingURL=panel.js.map
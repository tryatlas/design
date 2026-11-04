"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { ArrowUpRightIcon, SlidersHorizontalIcon } from "lucide-react";
import { EASE_PANEL } from "../../lib/motion.js";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
/**
 * The card of this system.
 *
 * `rounded-lg border border-element-selected bg-card` — desktop's card: a
 * hairline on a lighter step of the ramp, never a shadow. A panel may carry
 * a top-right action cluster (filter, expand) of round ghost icon buttons;
 * nothing in it is filled, since the panel's content is the thing to read.
 * Panels enter with a small rise, and a page staggers them down with `delay`
 * so the eye is led rather than presented.
 */
function Panel({ title, subtitle, actions, onExpand, onFilter, className, bodyClassName, children, delay = 0, }) {
    return (_jsxs(motion.section, { "data-slot": "panel", initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28, delay, ease: EASE_PANEL }, className: cn("flex min-w-0 flex-col overflow-hidden rounded-lg border border-element-selected bg-card", className), children: [(title || actions || onExpand || onFilter) && (_jsxs("header", { className: "flex items-start justify-between gap-3 px-3.5 pt-3 pb-2", children: [_jsxs("div", { className: "min-w-0", children: [title && _jsx("h3", { className: "truncate text-sm font-medium text-foreground", children: title }), subtitle && _jsx("p", { className: "mt-0.5 truncate caption", children: subtitle })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [actions, onFilter && (_jsx(IconButton, { icon: SlidersHorizontalIcon, label: "Filter", size: "sm", shape: "round", onClick: onFilter })), onExpand && (_jsx(IconButton, { icon: ArrowUpRightIcon, label: "Open", size: "sm", shape: "round", onClick: onExpand }))] })] })), _jsx("div", { className: cn("min-h-0 flex-1 px-3.5 pt-1 pb-3.5", bodyClassName), children: children })] }));
}
export { Panel };
//# sourceMappingURL=panel.js.map
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils.js";
import { SPRING_INDICATOR } from "../../lib/motion.js";
/**
 * Page-level tabs with a sliding underline. The active rule is ONE
 * shared-`layoutId` element that slides between tabs on `SPRING_INDICATOR`,
 * rather than two rules cross-fading.
 */
function UnderlineTabs({ options, value, onChange, className, }) {
    const layoutId = useId();
    return (_jsx("div", { "data-slot": "underline-tabs", role: "tablist", className: cn("flex items-center gap-4 border-b border-border-subtle", className), children: options.map((option) => {
            const active = option.value === value;
            return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, onClick: () => onChange(option.value), className: cn("relative flex h-control-lg items-center gap-1.5 text-xs font-medium outline-none", "transition-colors duration-fast ease-out-strong", active ? "text-foreground" : "text-muted-foreground hover:text-foreground"), children: [option.icon, option.label, option.count !== undefined && (_jsx("span", { className: "rounded-full bg-element-hover px-1 text-3xs tabular-nums", children: option.count })), active && (_jsx(motion.span, { layoutId: layoutId, transition: SPRING_INDICATOR, className: "absolute inset-x-0 -bottom-px h-px bg-foreground" }))] }, option.value));
        }) }));
}
/** The `muted label │ value ⌄` toolbar pill. */
function CompoundFilter({ label, children, className, onClick, }) {
    return (_jsxs("button", { type: "button", "data-slot": "compound-filter", onClick: onClick, className: cn("inline-flex h-control-sm shrink-0 items-center overflow-hidden rounded-full border border-border text-xs outline-none", "transition-colors duration-fast ease-out-strong hover:bg-element-hover", className), children: [_jsx("span", { className: "border-r border-border-subtle px-2 text-muted-foreground", children: label }), _jsx("span", { className: "flex items-center gap-1 px-2 font-medium text-foreground", children: children })] }));
}
/**
 * Icon buttons set into one track — the same hairline pill as `Segmented`,
 * for a cluster of related tools rather than a choice between views. Each
 * child is its own button; a pressed one (`aria-pressed`) takes the
 * selected fill, as `IconButton` already does.
 */
function SegmentedIconGroup({ orientation = "horizontal", className, ...props }) {
    return (_jsx("div", { role: "group", "data-slot": "segmented-icon-group", "data-orientation": orientation, className: cn("flex w-fit items-center gap-0.5 rounded-full border border-border p-0.5", "data-[orientation=vertical]:flex-col", "[&_[data-slot=icon-button]]:rounded-full", className), ...props }));
}
export { CompoundFilter, SegmentedIconGroup, UnderlineTabs };
//# sourceMappingURL=segmented.js.map
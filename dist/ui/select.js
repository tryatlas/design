"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils.js";
import { POPUP_EXIT } from "./popup-motion.js";
const POPUP = [
    "max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto overflow-x-hidden",
    "rounded-lg p-0.5",
    "bg-popover border border-border text-foreground shadow-md",
    "origin-[var(--transform-origin)] animate-scale-in outline-none",
    POPUP_EXIT,
];
const ITEM = [
    "relative flex cursor-pointer items-center gap-2 rounded py-1 pr-2 pl-7",
    "text-xs select-none outline-none",
    "text-secondary-foreground",
    "focus:bg-element-hover focus:text-foreground",
    "data-selected:text-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
];
export function Select({ value, onValueChange, options, disabled, placeholder, empty, id, name, required, size = "md", variant = "bordered", className, indicator = true, shape = "default", leading, ...props }) {
    const selected = value === null ? undefined : options.find((option) => option.value === value);
    const shown = selected?.label ?? placeholder;
    return (_jsxs(SelectPrimitive.Root, { value: value, onValueChange: (next) => {
            if (next !== null)
                onValueChange(next);
        }, disabled: disabled, name: name, required: required, children: [_jsxs(SelectPrimitive.Trigger, { id: id, "data-slot": "select-trigger", "data-size": size, "data-variant": variant, "data-shape": shape, "aria-label": props["aria-label"], "aria-labelledby": props["aria-labelledby"], "aria-describedby": props["aria-describedby"], "aria-invalid": props["aria-invalid"], className: cn("flex w-fit min-w-0 cursor-pointer items-center justify-between gap-1.5 rounded-md px-2", "data-[shape=pill]:rounded-full data-[shape=pill]:pr-2 data-[shape=pill]:pl-2.5", "text-xs whitespace-nowrap select-none outline-none", "transition-colors duration-fast ease-out-strong", "data-[size=md]:h-control-md data-[size=sm]:h-control-sm", "data-[variant=bordered]:border data-[variant=bordered]:border-border data-[variant=bordered]:bg-panel-input", "data-[variant=bordered]:text-foreground data-[variant=bordered]:hover:border-border-strong", "data-[variant=ghost]:text-secondary-foreground data-[variant=ghost]:hover:bg-element-hover data-[variant=ghost]:hover:text-foreground", "data-popup-open:bg-element-active", "data-disabled:cursor-not-allowed data-disabled:opacity-50", "aria-invalid:border-destructive", "[&_svg]:pointer-events-none [&_svg]:shrink-0", className), children: [_jsxs("span", { "data-slot": "select-value", className: cn("flex min-w-0 items-center gap-1.5 truncate", !selected && "text-muted-foreground"), children: [leading && (_jsx("span", { className: "flex shrink-0 items-center text-muted-foreground", children: leading })), selected?.icon, _jsx("span", { className: "truncate", children: shown })] }), _jsx(SelectPrimitive.Icon, { render: _jsx(ChevronDown, { className: "size-3.5 text-muted-foreground" }) })] }), _jsx(SelectPrimitive.Portal, { children: _jsx(SelectPrimitive.Positioner, { className: "isolate z-popover outline-none", side: "bottom", align: "start", sideOffset: 4, alignItemWithTrigger: false, children: _jsxs(SelectPrimitive.Popup, { "data-slot": "select-content", className: cn(POPUP), ...(options.length === 0 && { role: "presentation" }), children: [options.length === 0 && empty !== undefined && (_jsx("div", { "data-slot": "select-empty", className: "px-2 py-1.5 text-xs text-muted-foreground", children: empty })), options.map((option) => (_jsxs(SelectPrimitive.Item, { value: option.value, "data-slot": "select-item", className: cn(ITEM, !indicator && "pl-2"), children: [indicator && (_jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: _jsx(SelectPrimitive.ItemIndicator, { children: _jsx(Check, { className: "size-3.5" }) }) })), option.icon, _jsxs("span", { className: "flex min-w-0 flex-col", children: [_jsx(SelectPrimitive.ItemText, { children: option.label }), option.description && (_jsx("span", { className: "caption text-muted-foreground", children: option.description }))] })] }, option.value)))] }) }) })] }));
}
//# sourceMappingURL=select.js.map
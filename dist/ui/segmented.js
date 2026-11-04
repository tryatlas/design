"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useId, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils.js";
import { SPRING_INDICATOR } from "../lib/motion.js";
export function Segmented({ value, onValueChange, options, disabled, size = "md", className, ...props }) {
    const layoutId = useId();
    const buttons = useRef([]);
    const selected = options.findIndex((option) => option.value === value);
    const tabStop = selected === -1 ? 0 : selected;
    const move = (from, to) => {
        if (options.length === 0)
            return;
        const index = (to + options.length) % options.length;
        // Staying put on the selected option is a no-op; staying put with
        // nothing selected (Home on the first) selects it.
        if (index === from && index === selected)
            return;
        onValueChange(options[index].value);
        buttons.current[index]?.focus();
    };
    const onKeyDown = (event, index) => {
        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                move(index, index + 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                move(index, index - 1);
                break;
            case "Home":
                event.preventDefault();
                move(index, 0);
                break;
            case "End":
                event.preventDefault();
                move(index, options.length - 1);
                break;
        }
    };
    return (_jsx("div", { "data-slot": "segmented", role: "radiogroup", "aria-label": props["aria-label"], "aria-disabled": disabled || undefined, className: cn("flex w-fit max-w-full items-center gap-0.5 rounded-full border border-border p-0.5", disabled && "cursor-not-allowed opacity-50", className), children: options.map((option, index) => {
            const active = option.value === value;
            // An icon-only option shows no text, so its name has to be spelled
            // out; any other option is named by what it shows unless told.
            const name = option.ariaLabel ??
                (option.iconOnly && typeof option.label === "string" ? option.label : undefined);
            return (_jsxs("button", { ref: (node) => {
                    buttons.current[index] = node;
                }, type: "button", role: "radio", "aria-checked": active, "aria-label": name, title: option.iconOnly ? name : undefined, tabIndex: index === tabStop ? 0 : -1, disabled: disabled, onClick: () => {
                    if (!active)
                        onValueChange(option.value);
                }, onKeyDown: (event) => onKeyDown(event, index), className: cn("relative shrink-0 cursor-pointer rounded-full font-medium whitespace-nowrap outline-none", "transition-colors duration-fast ease-out-strong", "disabled:cursor-not-allowed", size === "sm" ? "h-control-xs text-2xs" : "h-control-sm text-xs", option.iconOnly
                    ? size === "sm"
                        ? "px-1"
                        : "px-1.5"
                    : size === "sm"
                        ? "px-2"
                        : "px-2.5", active ? "text-foreground" : "text-muted-foreground hover:text-foreground"), children: [active && (_jsx(motion.span, { layoutId: layoutId, transition: SPRING_INDICATOR, className: "absolute inset-0 rounded-full bg-element-selected" })), _jsxs("span", { className: "relative flex items-center gap-1.5", children: [option.icon, !option.iconOnly && option.label, !option.iconOnly && option.count !== undefined && (_jsx("span", { className: cn("rounded-full px-1 text-3xs tabular-nums", active ? "bg-element-active" : "bg-element-hover"), children: option.count }))] })] }, option.value));
        }) }));
}
//# sourceMappingURL=segmented.js.map
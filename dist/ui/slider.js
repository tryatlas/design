"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "../lib/utils.js";
export function Slider({ value, min, max, step = 1, disabled, onValueChange, onValueCommitted, className, ...props }) {
    return (_jsx(SliderPrimitive.Root, { value: value, min: min, max: max, step: step, disabled: disabled, onValueChange: (next) => onValueChange(next), onValueCommitted: (next) => onValueCommitted?.(next), className: cn("w-full data-disabled:opacity-50", className), children: _jsx(SliderPrimitive.Control, { className: "flex h-5 w-full cursor-pointer touch-none items-center select-none", children: _jsxs(SliderPrimitive.Track, { className: "relative h-1 w-full rounded-full bg-element-selected", children: [_jsx(SliderPrimitive.Indicator, { className: "rounded-full bg-primary" }), _jsx(SliderPrimitive.Thumb, { "aria-label": props["aria-label"], className: cn("size-3.5 rounded-full border border-border-strong bg-foreground shadow-sm outline-none", "transition-transform duration-fast ease-out-strong", "focus-visible:ring-2 focus-visible:ring-ring data-dragging:scale-110") })] }) }) }));
}
//# sourceMappingURL=slider.js.map
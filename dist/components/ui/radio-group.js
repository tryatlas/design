"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "../../lib/utils.js";
function RadioGroup({ className, ...props }) {
    return (_jsx(RadioGroupPrimitive, { "data-slot": "radio-group", className: cn("grid gap-2", className), ...props }));
}
function RadioGroupItem({ className, ...props }) {
    return (_jsx(RadioPrimitive.Root, { "data-slot": "radio-group-item", className: cn("relative flex size-3.5 shrink-0 items-center justify-center", "rounded-full border border-border bg-panel-input", "transition-colors duration-fast ease-out-strong", "after:absolute after:-inset-x-2 after:-inset-y-2", "data-checked:border-primary data-checked:bg-primary", "disabled:cursor-not-allowed disabled:opacity-50", "aria-invalid:border-destructive", className), ...props, children: _jsx(RadioPrimitive.Indicator, { "data-slot": "radio-group-indicator", className: "size-1.5 rounded-full bg-primary-foreground" }) }));
}
export { RadioGroup, RadioGroupItem };
//# sourceMappingURL=radio-group.js.map
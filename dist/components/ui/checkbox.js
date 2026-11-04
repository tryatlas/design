"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
/** A checkbox. `indeterminate` renders the dash for a partial selection. */
function Checkbox({ className, ...props }) {
    return (_jsx(CheckboxPrimitive.Root, { "data-slot": "checkbox", className: cn("peer relative flex size-3.5 shrink-0 items-center justify-center", "rounded-sm border border-border-strong bg-panel-input", "transition-colors duration-fast ease-out-strong", 
        // Widen the hit target without widening the box.
        "after:absolute after:-inset-x-2 after:-inset-y-2", "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground", "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground", "disabled:cursor-not-allowed disabled:opacity-50", "group-has-disabled/field:opacity-50", "aria-invalid:border-destructive", className), ...props, children: _jsx(CheckboxPrimitive.Indicator, { "data-slot": "checkbox-indicator", className: "grid place-content-center text-current", children: props.indeterminate ? (_jsx(MinusIcon, { className: "size-3", strokeWidth: 2.5 })) : (_jsx(CheckIcon, { className: "size-3", strokeWidth: 2.5 })) }) }));
}
export { Checkbox };
//# sourceMappingURL=checkbox.js.map
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "../../lib/utils.js";
import { toggleVariants } from "./toggle-variants.js";
function Toggle({ className, variant = "default", size = "default", ...props }) {
    return (_jsx(TogglePrimitive, { "data-slot": "toggle", className: cn(toggleVariants({ variant, size, className })), ...props }));
}
export { Toggle, toggleVariants };
//# sourceMappingURL=toggle.js.map
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { inputVariants } from "./input-variants.js";
function Input({ className, size, variant, type = "text", ...props }) {
    return (_jsx("input", { "data-slot": "input", "data-variant": variant === "code" ? variant : undefined, type: type, className: cn(inputVariants({ size, variant }), className), ...props }));
}
export { Input, inputVariants };
//# sourceMappingURL=input.js.map
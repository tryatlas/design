"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { inputVariants } from "./input-variants.js";
function Input({ className, size, type = "text", ...props }) {
    return (_jsx("input", { "data-slot": "input", type: type, className: cn(inputVariants({ size }), className), ...props }));
}
export { Input, inputVariants };
//# sourceMappingURL=input.js.map
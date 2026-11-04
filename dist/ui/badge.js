"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { badgeVariants } from "./badge-variants.js";
function Badge({ className, variant, size, ...props }) {
    return (_jsx("span", { "data-slot": "badge", className: cn(badgeVariants({ variant, size }), className), ...props }));
}
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map
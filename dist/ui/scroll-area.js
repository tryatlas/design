"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
import { forwardRef } from "react";
const ScrollArea = forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("overflow-auto", className), ...props, children: children }));
});
ScrollArea.displayName = "ScrollArea";
export { ScrollArea };
//# sourceMappingURL=scroll-area.js.map
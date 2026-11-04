"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "../../lib/utils.js";
/**
 * A hairline rule.
 *
 * Defaults to `border-subtle`, not `border`: a separator inside a card is
 * dividing things that already share a surface, so it should be quieter than
 * the card's own edge. Pass `strong` where it separates two regions.
 */
function Separator({ className, orientation = "horizontal", strong = false, ...props }) {
    return (_jsx(SeparatorPrimitive, { "data-slot": "separator", orientation: orientation, className: cn("shrink-0", strong ? "bg-border" : "bg-border-subtle", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className), ...props }));
}
export { Separator };
//# sourceMappingURL=separator.js.map
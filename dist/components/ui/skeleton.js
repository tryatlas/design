import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * A loading placeholder.
 *
 * Animates opacity only (Tailwind's `animate-pulse`). A shimmer that moves a
 * gradient repaints the whole list on every frame, which on a 200-row board
 * costs more than the request it is standing in for.
 */
function Skeleton({ className, ...props }) {
    return (_jsx("div", { "data-slot": "skeleton", className: cn("animate-pulse rounded-sm bg-element-selected", className), ...props }));
}
export { Skeleton };
//# sourceMappingURL=skeleton.js.map
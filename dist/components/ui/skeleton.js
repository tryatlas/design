import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
const RADIUS = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
};
/**
 * A loading placeholder.
 *
 * Animates opacity only (Tailwind's `animate-pulse`). A shimmer that moves a
 * gradient repaints the whole list on every frame, which on a 200-row board
 * costs more than the request it is standing in for.
 *
 * `animated={false}` holds it still: for a placeholder that stands in for a
 * whole panel while its code loads (desktop's `PanelSkeleton`), where a block
 * of pulsing rows is louder than the wait. `radius` takes the radius scale's
 * steps, so a row can match what it stands in for without a `rounded-*`
 * override at the call site.
 *
 * Filled with `muted`, the same grey as a progress track: the translucent
 * `element-*` fills are hover and selection washes, and over a black ground
 * they all but vanish.
 */
function Skeleton({ className, animated = true, radius = "sm", ...props }) {
    return (_jsx("div", { "data-slot": "skeleton", "data-static": animated ? undefined : "", className: cn(animated && "animate-pulse", RADIUS[radius], "bg-muted", className), ...props }));
}
export { Skeleton };
//# sourceMappingURL=skeleton.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * A chevron that says "this opens something". When its trigger is hovered
 * the chevron shifts forward and its two arms spread apart about the apex,
 * opening into an arrow; it eases back on leave, on the motion scale
 * (`duration-base`, `ease-out-strong`).
 *
 * The trigger is whichever ancestor carries `group/go` — a row, a card, a
 * link — so the whole target acknowledges the hover, not just the glyph.
 * Hover-only: focus and touch show the resting chevron, so nothing is
 * communicated by the motion alone. Reduced motion drops the transition.
 */
function GoChevron({ className }) {
    const arm = cn("origin-[10px_8px] [transform-box:view-box] [vector-effect:non-scaling-stroke]", "transition-transform duration-base ease-out-strong motion-reduce:transition-none");
    return (_jsx("span", { "aria-hidden": "true", "data-slot": "go-chevron", className: cn("inline-flex shrink-0 transition-transform duration-base ease-out-strong", "group-hover/go:translate-x-0.5 motion-reduce:transition-none", className), children: _jsxs("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", className: "overflow-visible", children: [_jsx("path", { d: "M6 4L10 8", className: cn(arm, "group-hover/go:rotate-8") }), _jsx("path", { d: "M10 8L6 12", className: cn(arm, "group-hover/go:-rotate-8") })] }) }));
}
export { GoChevron };
//# sourceMappingURL=go-chevron.js.map
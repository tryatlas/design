import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * The session timeline's rail, for any history drawn the same way (desktop's
 * Memory activity): a hairline down a 32px gutter, a round node per row, the
 * row's content 14px to its right.
 *
 * `first` and `last` stop the hairline at the end nodes' centres, so it runs
 * from node to node rather than off the top and bottom of the list. The node
 * is the caller's; `RailNode` is the timeline's round one, opaque so the
 * hairline behind it does not cross the glyph.
 */
/** Centre of a node from the top of its row: the hairline starts and stops there. */
const RAIL_NODE_CENTRE = 16;
/** One row on the rail: its node in the gutter and its slice of the hairline, half-height at the ends. */
function Rail({ node, first = false, last = false, className, style, contentClassName, children, }) {
    return (_jsxs("div", { className: cn("grid grid-cols-[32px_minmax(0,1fr)] gap-3.5", className), style: style, children: [_jsxs("div", { className: "relative flex justify-center", children: [_jsx("span", { "aria-hidden": true, className: "absolute left-1/2 -ml-px w-px bg-border-subtle", style: {
                            top: first ? RAIL_NODE_CENTRE : 0,
                            bottom: last ? `calc(100% - ${RAIL_NODE_CENTRE}px)` : 0,
                        } }), node] }), _jsx("div", { className: cn("min-w-0 pb-4", contentClassName), children: children })] }));
}
/** The round node a row hangs from: 32px, a quiet border, opaque over the hairline. */
function RailNode({ children, className }) {
    return (_jsx("span", { "data-slot": "rail-node", className: cn("relative flex size-8 shrink-0 items-center justify-center rounded-full border bg-card", "border-border-strong/50 text-secondary-foreground", className), children: children }));
}
export { Rail, RailNode };
//# sourceMappingURL=rail.js.map
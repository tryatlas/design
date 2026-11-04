"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { CANVAS_GLASS } from "./canvas-chrome.js";
/** Room around the content, as a share of its larger side. */
const PAD = 0.08;
function union(boxes) {
    const x = Math.min(...boxes.map((b) => b.x));
    const y = Math.min(...boxes.map((b) => b.y));
    const right = Math.max(...boxes.map((b) => b.x + b.w));
    const bottom = Math.max(...boxes.map((b) => b.y + b.h));
    return { x, y, w: right - x, h: bottom - y };
}
/**
 * The whole canvas in a corner: every node as a block, the viewport as a
 * frame, fitted to the union of both. With `onNavigate` it is a button: a
 * click reports the canvas point under the pointer, in canvas px, for the
 * app to centre on, and Enter or Space (which have no point) report the
 * centre of the nodes, which brings the content back into view.
 */
export function CanvasMinimap({ nodes, viewport, onNavigate, className, }) {
    const all = union([...nodes, viewport]);
    const pad = Math.max(all.w, all.h) * PAD;
    const viewBox = `${all.x - pad} ${all.y - pad} ${all.w + pad * 2} ${all.h + pad * 2}`;
    const navigate = (e) => {
        if (!onNavigate)
            return;
        // A keyboard press has no pointer position: go to the content.
        if (e.detail === 0) {
            const content = nodes.length > 0 ? union(nodes) : viewport;
            onNavigate({ x: content.x + content.w / 2, y: content.y + content.h / 2 });
            return;
        }
        const svg = e.currentTarget.querySelector("svg");
        const matrix = svg?.getScreenCTM();
        if (!svg || !matrix)
            return;
        const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
        onNavigate({ x: point.x, y: point.y });
    };
    const map = (_jsxs("svg", { viewBox: viewBox, width: 160, height: 112, "aria-hidden": "true", className: "block", children: [nodes.map((n, i) => (_jsx("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: Math.min(n.w, n.h) * 0.08, className: "fill-muted-foreground/30" }, i))), _jsx("rect", { x: viewport.x, y: viewport.y, width: viewport.w, height: viewport.h, className: "fill-foreground/5 stroke-foreground/40", strokeWidth: 1, vectorEffect: "non-scaling-stroke" })] }));
    const frame = cn("absolute right-3 bottom-3 z-panel overflow-hidden p-1", CANVAS_GLASS, className);
    return onNavigate ? (_jsx("button", { type: "button", "data-slot": "canvas-minimap", "aria-label": "Minimap", onClick: navigate, className: cn(frame, "cursor-pointer"), children: map })) : (_jsx("div", { "data-slot": "canvas-minimap", role: "img", "aria-label": "Minimap", className: frame, children: map }));
}
//# sourceMappingURL=canvas-minimap.js.map
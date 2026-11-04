import type { CanvasBounds } from "./types.ts";
/**
 * The whole canvas in a corner: every node as a block, the viewport as a
 * frame, fitted to the union of both. With `onNavigate` it is a button: a
 * click reports the canvas point under the pointer, in canvas px, for the
 * app to centre on, and Enter or Space (which have no point) report the
 * centre of the nodes, which brings the content back into view.
 */
export declare function CanvasMinimap({ nodes, viewport, onNavigate, className, }: {
    nodes: CanvasBounds[];
    viewport: CanvasBounds;
    onNavigate?: (point: {
        x: number;
        y: number;
    }) => void;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=canvas-minimap.d.ts.map
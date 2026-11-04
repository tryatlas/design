"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
import { Hint } from "../../ui/tooltip.js";
/**
 * The floating chrome every canvas is cut from: one glass, the pills that sit
 * in its corners, the dotted plane under the nodes. Desktop's Canvas and
 * Spaces tabs and web's Spaces all draw this; the live canvas (pan, zoom,
 * gestures, the document) stays in each app.
 */
/**
 * The glass of every floating control group: the card at 70% under a blur,
 * a subtle edge and the menu shadow, so a pill reads as floating over the
 * canvas without a hard bar. Desktop's recipe, on the package's one blur.
 */
export const CANVAS_GLASS = "rounded-xl border border-border-subtle bg-card/70 shadow-md backdrop-blur-glass";
const CORNER = {
    "top-left": "left-3 top-3",
    "top-right": "right-3 top-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
};
/** A glass pill pinned to a corner of the canvas, 12px in. */
export function CanvasPill({ corner, className, children, ...props }) {
    return (_jsx("div", { "data-slot": "canvas-pill", className: cn("absolute z-panel flex h-8 items-center gap-1 px-1", CANVAS_GLASS, CORNER[corner], className), ...props, children: children }));
}
/**
 * The hairline between groups in a pill. `vertical` is a vertical line,
 * between items in a row; `horizontal` separates items in a column.
 */
export function CanvasPillDivider({ orientation = "vertical", className, }) {
    return (_jsx("div", { "aria-hidden": "true", className: cn("shrink-0 bg-border-subtle", orientation === "vertical" ? "mx-0.5 h-4 w-px" : "my-0.5 h-px w-5", className) }));
}
/**
 * A 24px icon control in a pill, its label (and shortcut) in a tooltip.
 * `pressed`, when given, makes it a toggle (`aria-pressed`).
 */
export function CanvasPillButton({ icon, label, onClick, pressed, disabled, shortcut, side = "bottom", className, }) {
    return (_jsx(Hint, { label: label, shortcut: shortcut, side: side, children: _jsx(IconButton, { icon: icon, label: label, size: "sm", onClick: onClick, disabled: disabled, "aria-pressed": pressed, className: className }) }));
}
/**
 * A short line of state at the bottom centre of the canvas, clear of a bottom
 * dock: "Uploading media…", "Following Ana — press Esc to stop". Pass
 * `role="status"` when the change should be announced.
 */
export function CanvasStatusChip({ className, children, ...props }) {
    return (_jsx("div", { "data-slot": "canvas-status-chip", className: cn("absolute bottom-18 left-1/2 z-panel flex h-8 max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-2 px-3", CANVAS_GLASS, "rounded-full text-xs font-medium text-secondary-foreground", className), ...props, children: children }));
}
/** The dot grid, from the theme. An inline `var()` follows every theme. */
const DOTS = {
    backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
};
/**
 * The plane a canvas draws on: the background with a dotted grid, filling its
 * parent. Pills, the dock and the minimap position against it. An xyflow
 * canvas can set its own `<Background>` transparent and sit inside this, or
 * draw the dots itself.
 */
export function CanvasSurface({ className, style, children, ...props }) {
    return (_jsx("div", { "data-slot": "canvas-surface", className: cn("relative size-full overflow-hidden bg-background", className), style: { ...DOTS, ...style }, ...props, children: children }));
}
/** The box a tool draws while it is being dragged out, in canvas px. */
export function CanvasDraftBox({ bounds, className, }) {
    return (_jsx("div", { "data-slot": "canvas-draft-box", "aria-hidden": "true", className: cn("pointer-events-none absolute rounded-sm border border-primary bg-primary/10", className), style: { left: bounds.x, top: bounds.y, width: bounds.w, height: bounds.h } }));
}
//# sourceMappingURL=canvas-chrome.js.map
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { CanvasBounds } from "./types.ts";
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
export declare const CANVAS_GLASS = "rounded-xl border border-border-subtle bg-card/70 shadow-md backdrop-blur-glass";
declare const CORNER: {
    readonly "top-left": "left-3 top-3";
    readonly "top-right": "right-3 top-3";
    readonly "bottom-left": "bottom-3 left-3";
    readonly "bottom-right": "bottom-3 right-3";
};
export type CanvasCorner = keyof typeof CORNER;
/** A glass pill pinned to a corner of the canvas, 12px in. */
export declare function CanvasPill({ corner, className, children, ...props }: {
    corner: CanvasCorner;
    className?: string;
    children: ReactNode;
} & Omit<React.ComponentProps<"div">, "children">): import("react").JSX.Element;
/**
 * The hairline between groups in a pill. `vertical` is a vertical line,
 * between items in a row; `horizontal` separates items in a column.
 */
export declare function CanvasPillDivider({ orientation, className, }: {
    orientation?: "vertical" | "horizontal";
    className?: string;
}): import("react").JSX.Element;
/**
 * A 24px icon control in a pill, its label (and shortcut) in a tooltip.
 * `pressed`, when given, makes it a toggle (`aria-pressed`).
 */
export declare function CanvasPillButton({ icon, label, onClick, pressed, disabled, shortcut, side, className, }: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    pressed?: boolean;
    disabled?: boolean;
    shortcut?: string;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}): import("react").JSX.Element;
/**
 * A short line of state at the bottom centre of the canvas, clear of a bottom
 * dock: "Uploading media…", "Following Ana — press Esc to stop". Pass
 * `role="status"` when the change should be announced.
 */
export declare function CanvasStatusChip({ className, children, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/**
 * The plane a canvas draws on: the background with a dotted grid, filling its
 * parent. Pills, the dock and the minimap position against it. An xyflow
 * canvas can set its own `<Background>` transparent and sit inside this, or
 * draw the dots itself.
 */
export declare function CanvasSurface({ className, style, children, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** The box a tool draws while it is being dragged out, in canvas px. */
export declare function CanvasDraftBox({ bounds, className, }: {
    bounds: CanvasBounds;
    className?: string;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=canvas-chrome.d.ts.map
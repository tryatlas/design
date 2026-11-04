import { type LucideIcon } from "lucide-react";
import type { CanvasDock } from "./types.ts";
/**
 * One control in the dock. A tool (`note`, `text`, `frame`, `shape:<kind>`)
 * arms for the next click on the canvas; an `action` (media, image) runs at
 * once and is never pressed.
 */
export interface CanvasToolItem {
    id: string;
    icon: LucideIcon;
    label: string;
    shortcut?: string;
    action?: boolean;
}
/** Spaces' dock: blocks | the contract's four shapes | media. */
export declare const SPACES_TOOL_GROUPS: CanvasToolItem[][];
/** The local canvas's dock: note and text | its four flowchart shapes | image. */
export declare const LOCAL_CANVAS_TOOL_GROUPS: CanvasToolItem[][];
/**
 * The floating tool dock: the app's tool groups, then undo and redo, then
 * (when the app lets it move) where the dock sits.
 *
 * Along the bottom it is a row, centred, and its controls share one sliding
 * tooltip; docked to a side it is a column pinned to that edge's middle, and
 * each tooltip opens away from the edge so it never covers the canvas.
 * Presentational: clicking the armed tool calls `onTool(null)`, and the app
 * decides what arming means.
 */
export declare function CanvasToolbar({ groups, activeTool, onTool, onAction, history, dock, onDock, disabled, className, }: {
    groups: CanvasToolItem[][];
    activeTool: string | null;
    onTool: (id: string | null) => void;
    onAction?: (id: string) => void;
    history?: {
        canUndo: boolean;
        canRedo: boolean;
        onUndo: () => void;
        onRedo: () => void;
    };
    dock: CanvasDock;
    onDock?: (dock: CanvasDock) => void;
    /** A read-only canvas: the dock stays, so the canvas does not change shape, but nothing works. */
    disabled?: boolean;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=canvas-toolbar.d.ts.map
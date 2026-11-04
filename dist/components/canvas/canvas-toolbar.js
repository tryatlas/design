"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleIcon, DiamondIcon, FrameIcon, ImageIcon, PanelBottomIcon, PanelLeftIcon, PanelRightIcon, Redo2Icon, RectangleHorizontalIcon, Settings2Icon, SquareIcon, StickyNoteIcon, TriangleIcon, TypeIcon, Undo2Icon, } from "lucide-react";
import { Fragment } from "react";
import { cn } from "../../lib/utils.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { HintGroup, HintItem } from "../../ui/hint-group.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
import { Hint } from "../../ui/tooltip.js";
import { CANVAS_GLASS } from "./canvas-chrome.js";
/** Spaces' dock: blocks | the contract's four shapes | media. */
export const SPACES_TOOL_GROUPS = [
    [
        { id: "note", icon: StickyNoteIcon, label: "Note" },
        { id: "text", icon: TypeIcon, label: "Text" },
        { id: "frame", icon: FrameIcon, label: "Frame" },
    ],
    [
        { id: "shape:rectangle", icon: SquareIcon, label: "Rectangle" },
        { id: "shape:ellipse", icon: CircleIcon, label: "Ellipse" },
        { id: "shape:diamond", icon: DiamondIcon, label: "Diamond" },
        { id: "shape:triangle", icon: TriangleIcon, label: "Triangle" },
    ],
    [{ id: "media", icon: ImageIcon, label: "Insert image or video", action: true }],
];
/** The local canvas's dock: note and text | its four flowchart shapes | image. */
export const LOCAL_CANVAS_TOOL_GROUPS = [
    [
        { id: "note", icon: StickyNoteIcon, label: "Note" },
        { id: "text", icon: TypeIcon, label: "Text" },
    ],
    [
        { id: "shape:rectangle", icon: SquareIcon, label: "Rectangle" },
        { id: "shape:rounded", icon: RectangleHorizontalIcon, label: "Rounded rectangle" },
        { id: "shape:ellipse", icon: CircleIcon, label: "Ellipse" },
        { id: "shape:diamond", icon: DiamondIcon, label: "Diamond" },
    ],
    [{ id: "image", icon: ImageIcon, label: "Insert image", action: true }],
];
const DOCKS = [
    { dock: "left", label: "Dock left", icon: PanelLeftIcon },
    { dock: "bottom", label: "Dock bottom", icon: PanelBottomIcon },
    { dock: "right", label: "Dock right", icon: PanelRightIcon },
];
/** A 32px dock square; an armed tool takes the primary tint, as on desktop. */
const DOCK_BUTTON = "rounded-lg text-secondary-foreground aria-pressed:bg-primary/20";
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
export function CanvasToolbar({ groups, activeTool, onTool, onAction, history, dock, onDock, disabled = false, className, }) {
    const row = dock === "bottom";
    const side = row ? "top" : dock === "left" ? "right" : "left";
    const divider = (_jsx("div", { "aria-hidden": "true", className: cn("shrink-0 bg-border-subtle", row ? "mx-0.5 h-5 w-px" : "my-0.5 h-px w-5") }));
    // A row shares one sliding tooltip; a column, which the group cannot
    // follow, gives each control its own, opening away from the edge.
    const hint = (label, shortcut, control) => row ? (_jsx(HintItem, { label: shortcut ? `${label} (${shortcut})` : label, children: control })) : (_jsx(Hint, { label: label, shortcut: shortcut, side: side, children: control }));
    const dockButton = (item, onClick, opts = {}) => hint(item.label, item.shortcut, _jsx(IconButton, { icon: item.icon, label: item.label, size: "lg", iconSize: "lg", "aria-pressed": opts.pressed, disabled: disabled || opts.disabled, onClick: onClick, className: DOCK_BUTTON }));
    const body = (_jsxs("div", { "data-slot": "canvas-toolbar", "data-dock": dock, role: "toolbar", "aria-label": "Canvas tools", "aria-orientation": row ? "horizontal" : "vertical", "aria-disabled": disabled || undefined, className: cn("absolute z-panel flex items-center gap-1 p-1", CANVAS_GLASS, row
            ? "bottom-3 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-row overflow-x-auto [scrollbar-width:none]"
            : "top-1/2 -translate-y-1/2 flex-col", dock === "left" && "left-3", dock === "right" && "right-3", disabled && "pointer-events-none opacity-40", className), children: [groups.map((group, i) => (_jsxs(Fragment, { children: [i > 0 && divider, group.map((item) => (_jsx(Fragment, { children: item.action
                            ? dockButton(item, () => onAction?.(item.id))
                            : dockButton(item, () => onTool(activeTool === item.id ? null : item.id), {
                                pressed: activeTool === item.id,
                            }) }, item.id)))] }, group.map((t) => t.id).join("|")))), history && (_jsxs(_Fragment, { children: [divider, dockButton({ id: "undo", icon: Undo2Icon, label: "Undo", shortcut: "⌘Z" }, history.onUndo, {
                        disabled: !history.canUndo,
                    }), dockButton({ id: "redo", icon: Redo2Icon, label: "Redo", shortcut: "⌘⇧Z" }, history.onRedo, { disabled: !history.canRedo })] })), onDock && (_jsxs(_Fragment, { children: [divider, _jsxs(DropdownMenu, { children: [hint("Dock position", undefined, _jsx(DropdownMenuTrigger, { disabled: disabled, render: _jsx(IconButton, { icon: Settings2Icon, label: "Dock position", size: "lg", iconSize: "lg", className: cn(DOCK_BUTTON, "aria-expanded:bg-element-active") }) })), _jsx(DropdownMenuContent, { side: side, align: "end", sideOffset: 8, className: "w-40", children: _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Dock position" }), _jsx(DropdownMenuRadioGroup, { value: dock, onValueChange: (value) => onDock(value), children: DOCKS.map((d) => (_jsxs(DropdownMenuRadioItem, { value: d.dock, children: [_jsx(Icon, { icon: d.icon, size: "sm", className: "text-muted-foreground" }), d.label] }, d.dock))) })] }) })] })] }))] }));
    return row ? _jsx(HintGroup, { side: "top", children: body }) : body;
}
//# sourceMappingURL=canvas-toolbar.js.map
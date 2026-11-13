"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageOffIcon, StickyNoteIcon } from "lucide-react";
import { PEER_INK } from "../../lib/actor-hue.js";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Spinner } from "../ui/spinner.js";
/**
 * The canvas's nodes, as desktop draws them: glass notes, bare text,
 * stretched SVG shapes, dashed frames, media. `CanvasNodeFrame` is the box
 * (position, selection, a colleague's claim, anchors, the resize handle);
 * the bodies fill it. Inside an xyflow node renderer the frame is
 * `size-full` and xyflow positions it; on a hand-rolled canvas pass `bounds`.
 *
 * Bodies follow the frame's selection (`data-selected`), so a body needs no
 * `selected` prop of its own inside one.
 */
/**
 * The type of each editable field, so an app's editor (an input over a note
 * title, a textarea for a shape label) matches the static text it replaces.
 */
export const CANVAS_FIELD_CLASS = {
    noteTitle: "w-full min-w-0 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground",
    noteBody: "w-full min-h-0 resize-none bg-transparent text-sm leading-relaxed text-secondary-foreground outline-none placeholder:text-muted-foreground placeholder:italic",
    text: "w-full resize-none bg-transparent text-lg leading-snug text-foreground caret-primary outline-none placeholder:text-muted-foreground",
    shapeLabel: "w-full resize-none bg-transparent text-center text-sm leading-snug text-foreground caret-primary outline-none",
    frameLabel: "bg-transparent text-xs font-medium text-muted-foreground outline-none placeholder:text-muted-foreground",
};
/** The frame hugs each body's own corner. */
const RADIUS = {
    note: "rounded-2xl",
    text: "rounded",
    shape: "rounded-md",
    frame: "rounded-xl",
    media: "rounded-xl",
};
/** Where each connector dot sits on the box. */
const ANCHOR_AT = {
    n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    e: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    w: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
};
const ANCHORS = ["n", "e", "s", "w"];
/**
 * The box a node is drawn in. `claimedBy` is a colleague who has it selected:
 * outlined in their hue while it is not yours. Anchors and the resize handle
 * show only when it is selected and the app gives the handler.
 */
export function CanvasNodeFrame({ kind, bounds, selected = false, claimedBy, anchors = ANCHORS, onAnchorPointerDown, onResizePointerDown, className, style, children, ...props }) {
    const claimed = !selected && claimedBy;
    return (_jsxs("div", { "data-slot": "canvas-node", "data-kind": kind, "data-selected": selected || undefined, "data-claimed-by": claimed ? claimedBy.name : undefined, className: cn("group/node", bounds ? "absolute" : "relative size-full", RADIUS[kind], claimed && cn("outline-2 outline-offset-4", PEER_INK[claimedBy.hue].outline), className), style: bounds
            ? { left: bounds.x, top: bounds.y, width: bounds.w, height: bounds.h, ...style }
            : style, ...props, children: [children, selected &&
                onAnchorPointerDown &&
                anchors.map((a) => (_jsx("div", { role: "presentation", "data-anchor": a, onPointerDown: (e) => onAnchorPointerDown(a, e), className: cn("absolute size-3 cursor-crosshair rounded-full border border-background bg-primary", "transition-transform duration-fast ease-out-strong hover:scale-125", ANCHOR_AT[a]) }, a))), selected && onResizePointerDown && (_jsx("div", { role: "presentation", "data-slot": "canvas-resize-handle", onPointerDown: onResizePointerDown, className: "absolute -right-1 -bottom-1 size-2 cursor-nwse-resize rounded-sm border border-border-strong bg-primary" }))] }));
}
/**
 * A note: a glass card, an icon and title over the body. A string body is
 * clipped to the card with a fade at the bottom edge, so a long one dissolves
 * rather than cutting off mid-line.
 */
export function CanvasNote({ title, body, icon, meta, empty = false, className, }) {
    const fades = !empty && typeof body === "string";
    return (_jsxs("div", { "data-slot": "canvas-note", className: cn("relative flex size-full flex-col overflow-hidden rounded-2xl border shadow-lg", "bg-card/70 backdrop-blur-glass backdrop-saturate-150 transition-colors duration-fast", "border-border-subtle group-hover/node:border-border group-data-selected/node:border-primary/60", className), children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0 opacity-60", style: {
                    backgroundImage: "linear-gradient(to bottom, var(--element-highlight), transparent)",
                } }), _jsxs("div", { className: "relative flex shrink-0 items-center gap-2 border-b border-border-subtle px-3 py-2", children: [_jsx("div", { className: "flex size-7 shrink-0 items-center justify-center rounded-lg bg-element-hover", children: icon ? (_jsx("span", { className: "text-lg leading-none", children: icon })) : (_jsx(Icon, { icon: StickyNoteIcon, size: "sm", className: "text-secondary-foreground" })) }), _jsxs("div", { className: "min-w-0 flex-1", children: [typeof title === "string" ? (_jsx("div", { className: cn(CANVAS_FIELD_CLASS.noteTitle, "truncate"), children: title || "Untitled" })) : (title), meta && _jsx("div", { className: "truncate text-2xs text-muted-foreground", children: meta })] })] }), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2.5", children: [empty ? (_jsx("div", { className: "text-xs text-muted-foreground italic", children: "Empty note \u2014 open to edit." })) : typeof body === "string" ? (_jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap text-secondary-foreground", children: body })) : (body), fades && (_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-x-0 bottom-0 h-8", style: {
                            backgroundImage: "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--card) 85%, transparent))",
                        } }))] })] }));
}
/** Free text: no chrome, outlined while selected. */
export function CanvasText({ text, className }) {
    return (_jsx("div", { "data-slot": "canvas-text", className: cn("size-full overflow-hidden rounded px-1 py-0.5 break-words whitespace-pre-wrap", "group-data-selected/node:outline group-data-selected/node:outline-1 group-data-selected/node:outline-primary/50", CANVAS_FIELD_CLASS.text, className), children: text === "" ? _jsx("span", { className: "text-muted-foreground", children: "Text" }) : text }));
}
const SHAPE_COMMON = {
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke",
};
/**
 * A shape in a 100×100 box stretched to the node. The stroke does not scale
 * with the stretch or the zoom, so a wide rectangle and a tall one have the
 * same edge.
 */
export function CanvasShape({ shape, label, selected, className, }) {
    const paint = cn("fill-card/70 stroke-border-strong transition-[stroke] duration-fast", "group-data-selected/node:stroke-primary", selected && "stroke-primary");
    return (_jsxs("div", { "data-slot": "canvas-shape", className: cn("relative size-full", className), children: [_jsx("svg", { "aria-hidden": "true", className: "absolute inset-0 size-full overflow-visible", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: shape === "ellipse" ? (_jsx("ellipse", { cx: 50, cy: 50, rx: 49, ry: 49, className: paint, ...SHAPE_COMMON })) : shape === "diamond" ? (_jsx("polygon", { points: "50,1 99,50 50,99 1,50", className: paint, ...SHAPE_COMMON })) : shape === "triangle" ? (_jsx("polygon", { points: "50,1 99,99 1,99", className: paint, ...SHAPE_COMMON })) : (_jsx("rect", { x: 1, y: 1, width: 98, height: 98, rx: shape === "rounded" ? 14 : 0, className: paint, ...SHAPE_COMMON })) }), label !== undefined && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center p-3", children: typeof label === "string" ? (_jsx("span", { className: cn(CANVAS_FIELD_CLASS.shapeLabel, "line-clamp-3 break-words"), children: label })) : (label) }))] }));
}
/** A titled frame: a dashed region with its label above the top-left corner. */
export function CanvasFrame({ label, className }) {
    return (_jsx("div", { "data-slot": "canvas-frame", className: cn("relative size-full rounded-xl border-2 border-dashed border-border-subtle bg-element-hover transition-colors duration-fast", "group-data-selected/node:border-primary/50", className), children: _jsx("div", { className: "absolute -top-6 left-1 max-w-full", children: typeof label === "string" || label === undefined ? (_jsx("span", { className: cn(CANVAS_FIELD_CLASS.frameLabel, "block truncate"), children: label || "Frame" })) : (label) }) }));
}
/** An image or video, with its loading and failed states. `loadingLabel`
 *  ("Loading image…") is shown under the spinner, as a status line that
 *  assistive tech reads in the spinner's place; without it the spinner stands
 *  alone, named "Loading". */
export function CanvasMedia({ state, src, kind, alt, loadingLabel, className, }) {
    return (_jsx("div", { "data-slot": "canvas-media", className: cn("size-full overflow-hidden rounded-xl border border-border-subtle bg-card transition-colors duration-fast", "group-data-selected/node:border-primary/60", className), children: state === "error" || (state === "ready" && !src) ? (_jsxs("div", { className: "flex size-full flex-col items-center justify-center gap-1 text-muted-foreground", children: [_jsx(Icon, { icon: ImageOffIcon, size: "lg" }), _jsx("span", { className: "text-2xs", children: "Media unavailable" })] })) : state === "loading" ? (_jsx("div", { className: "flex size-full flex-col items-center justify-center gap-1 text-muted-foreground", children: loadingLabel ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { size: "lg", label: "" }), _jsx("span", { role: "status", className: "text-2xs", children: loadingLabel })] })) : (_jsx(Spinner, { size: "lg" })) })) : kind === "video" ? (_jsx("video", { src: src, controls: true, "aria-label": alt, className: "size-full object-contain" })) : (_jsx("img", { src: src, alt: alt, draggable: false, className: "size-full object-contain select-none [-webkit-user-drag:none]" })) }));
}
//# sourceMappingURL=canvas-nodes.js.map
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import type { LabelTone } from "../../lib/types.ts";
import type { CanvasAnchor, CanvasBounds, CanvasNodeKind, CanvasShapeKind } from "./types.ts";
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
export declare const CANVAS_FIELD_CLASS: {
    readonly noteTitle: "w-full min-w-0 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground";
    readonly noteBody: "w-full min-h-0 resize-none bg-transparent text-sm leading-relaxed text-secondary-foreground outline-none placeholder:text-muted-foreground placeholder:italic";
    readonly text: "w-full resize-none bg-transparent text-lg leading-snug text-foreground caret-primary outline-none placeholder:text-muted-foreground";
    readonly shapeLabel: "w-full resize-none bg-transparent text-center text-sm leading-snug text-foreground caret-primary outline-none";
    readonly frameLabel: "bg-transparent text-xs font-medium text-muted-foreground outline-none placeholder:text-muted-foreground";
};
/**
 * The box a node is drawn in. `claimedBy` is a colleague who has it selected:
 * outlined in their hue while it is not yours. Anchors and the resize handle
 * show only when it is selected and the app gives the handler.
 */
export declare function CanvasNodeFrame({ kind, bounds, selected, claimedBy, anchors, onAnchorPointerDown, onResizePointerDown, className, style, children, ...props }: {
    kind: CanvasNodeKind;
    bounds?: CanvasBounds;
    selected?: boolean;
    claimedBy?: {
        hue: LabelTone;
        name: string;
    } | null;
    anchors?: CanvasAnchor[];
    onAnchorPointerDown?: (anchor: CanvasAnchor, e: PointerEvent<HTMLDivElement>) => void;
    onResizePointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
} & Omit<React.ComponentProps<"div">, "children" | "style" | "className">): import("react").JSX.Element;
/**
 * A note: a glass card, an icon and title over the body. A string body is
 * clipped to the card with a fade at the bottom edge, so a long one dissolves
 * rather than cutting off mid-line.
 */
export declare function CanvasNote({ title, body, icon, meta, empty, className, }: {
    /** A string, or the app's editor (use `CANVAS_FIELD_CLASS.noteTitle`). */
    title: ReactNode;
    /** A string, rendered markdown, or the app's editor (`CANVAS_FIELD_CLASS.noteBody`). */
    body?: ReactNode;
    /** An emoji in place of the sticky-note glyph. */
    icon?: string;
    /** A line under the title, e.g. "Edited 5m ago". */
    meta?: ReactNode;
    /** Draws "Empty note — open to edit." in place of the body. */
    empty?: boolean;
    className?: string;
}): import("react").JSX.Element;
/** Free text: no chrome, outlined while selected. */
export declare function CanvasText({ text, className }: {
    text: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/**
 * A shape in a 100×100 box stretched to the node. The stroke does not scale
 * with the stretch or the zoom, so a wide rectangle and a tall one have the
 * same edge.
 */
export declare function CanvasShape({ shape, label, selected, className, }: {
    shape: CanvasShapeKind;
    /** A string, or the app's editor (`CANVAS_FIELD_CLASS.shapeLabel`). */
    label?: ReactNode;
    /** Outside a `CanvasNodeFrame`; inside one, the frame's selection applies. */
    selected?: boolean;
    className?: string;
}): import("react").JSX.Element;
/** A titled frame: a dashed region with its label above the top-left corner. */
export declare function CanvasFrame({ label, className }: {
    label?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/** An image or video, with its loading and failed states. `loadingLabel`
 *  ("Loading image…") is shown under the spinner, as a status line that
 *  assistive tech reads in the spinner's place; without it the spinner stands
 *  alone, named "Loading". */
export declare function CanvasMedia({ state, src, kind, alt, loadingLabel, className, }: {
    state: "loading" | "error" | "ready";
    src?: string;
    kind: "image" | "video";
    alt: string;
    loadingLabel?: string;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=canvas-nodes.d.ts.map
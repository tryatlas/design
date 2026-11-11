import type { LucideIcon } from "lucide-react";
import type { LabelTone } from "../../lib/types.ts";
/**
 * The canvas family's shapes: the props the canvas blocks take, shared by
 * desktop's two xyflow canvases (Canvas and Spaces) and web's hand-rolled
 * Spaces canvas. Presentational only: no node graph, no document, no
 * viewport maths. Each app keeps its own model and maps it onto these.
 */
/** A box in canvas px. */
export interface CanvasBounds {
    x: number;
    y: number;
    w: number;
    h: number;
}
/** The shapes a shape node draws. `rounded` is the local canvas's; `triangle` is Spaces'. */
export type CanvasShapeKind = "rectangle" | "rounded" | "ellipse" | "diamond" | "triangle";
/** What a node is, for its frame's radius. */
export type CanvasNodeKind = "note" | "text" | "shape" | "frame" | "media";
/** Where a connector leaves a node: the middle of an edge. */
export type CanvasAnchor = "n" | "e" | "s" | "w";
/** The edge the tool dock hugs. */
export type CanvasDock = "bottom" | "left" | "right";
/**
 * Where the canvas stands with the room, as the header pill's dot says it:
 * `live` sharing, `syncing` reconnecting, `offline` holding edits,
 * `archived` read-only, `viewing` present but not sharing.
 */
export type CanvasLinkStatus = "live" | "syncing" | "offline" | "archived" | "viewing";
/** Somebody else on the canvas. `hue` comes from `actorHue`. */
export interface PresencePeer {
    id: string;
    name: string;
    image?: string;
    hue: LabelTone;
}
/** Who created a page, where the app can know it. */
export interface CanvasPageAuthor {
    name: string;
    image?: string | null;
}
/**
 * One row of the pages panel. The app flattens its tree (and its collapsed
 * folders) before handing rows over; `depth` indents.
 */
export interface CanvasPageRow {
    id: string;
    kind: "page" | "folder";
    name: string;
    /** An emoji. */
    icon?: string;
    /** A pre-rendered line under the name, e.g. "Updated 5m ago". */
    subtitle?: string;
    depth?: number;
    author?: CanvasPageAuthor;
}
/** A per-row control in the pages panel, e.g. a folder's "New page inside". */
export interface CanvasPageRowAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onSelect: (rowId: string) => void;
}
//# sourceMappingURL=types.d.ts.map
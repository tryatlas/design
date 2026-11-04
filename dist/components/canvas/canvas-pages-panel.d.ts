import { type HTMLAttributes, type ReactNode } from "react";
import type { CanvasPageRow, CanvasPageRowAction } from "./types.ts";
/** Where a dragged row would land: above, below, or inside a folder. */
export interface CanvasPageDropIndicator {
    id: string;
    where: "before" | "after" | "into";
}
/**
 * The pages column beside a canvas: a quiet "Pages" header with create
 * buttons, then one row per page or folder, already flattened by the app
 * (collapsed folders' children left out, `depth` set).
 *
 * Presentational. Reordering is the app's: it spreads its pointer handlers
 * on each row through `getRowProps` and passes back `dropIndicator`. Rename
 * is controlled when `renamingId` is given, else the panel keeps it.
 *
 * Without the optional props (authors, row actions, `deleteMode`) it is the
 * local canvas's panel; Spaces turns them on.
 */
export declare function CanvasPagesPanel({ rows, activeId, collapsedIds, onToggleFolder, onOpen, onCreate, allowFolders, renamingId: renamingIdProp, onRenamingChange, onRename, onDelete, onIconClick, dropIndicator, getRowProps, header, emptyLabel, rowActions, deleteMode, deleteLabel, pageCount: pageCountProp, className, }: {
    rows: CanvasPageRow[];
    activeId: string | null;
    collapsedIds?: ReadonlySet<string>;
    onToggleFolder?: (id: string) => void;
    onOpen: (id: string) => void;
    onCreate?: (kind: "page" | "folder") => void;
    allowFolders?: boolean;
    /** Controlled rename: the row being renamed, or null. */
    renamingId?: string | null;
    onRenamingChange?: (id: string | null) => void;
    onRename?: (id: string, name: string) => void;
    onDelete?: (id: string) => void;
    /** The emoji is a button when set; `rect` anchors the app's picker. */
    onIconClick?: (id: string, rect: DOMRect) => void;
    dropIndicator?: CanvasPageDropIndicator | null;
    /** Spread on each row: the app's drag handlers and data attributes. */
    getRowProps?: (id: string) => HTMLAttributes<HTMLDivElement>;
    /** Above the "Pages" header, e.g. the app's back link. */
    header?: ReactNode;
    emptyLabel?: string;
    rowActions?: (row: CanvasPageRow) => CanvasPageRowAction[];
    /** `always` draws delete on every row (Spaces); `hover` reveals it. */
    deleteMode?: "hover" | "always";
    deleteLabel?: (row: CanvasPageRow) => string;
    /**
     * How many pages the whole tree holds, for "the last page cannot be
     * deleted". Pass it when a collapsed folder hides pages from `rows`;
     * without it the visible pages are counted.
     */
    pageCount?: number;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=canvas-pages-panel.d.ts.map
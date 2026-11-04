import { Group, Panel, Separator } from "react-resizable-panels";
import type { Layout } from "react-resizable-panels";
/**
 * Split panes, on react-resizable-panels v4 (`Group / Panel / Separator`),
 * side by side or stacked:
 *
 *   <ResizableSplit id="editor" orientation="vertical" onLayoutCommit={save}>
 *     <ResizablePane id="code" minSize="20">…</ResizablePane>
 *     <ResizableHandle />
 *     <ResizablePane id="terminal" defaultSize="30">…</ResizablePane>
 *   </ResizableSplit>
 *
 * The split keeps nothing. Where a layout is remembered (desktop's store, a
 * cookie, nowhere) is the app's business: it passes the saved layout back as
 * `defaultLayout` and hears about a new one through `onLayoutCommit`, which
 * fires once per drag, when the drag ends, and only for a drag. A layout
 * the library settled on by itself (a pane mounting, the window resizing)
 * is not the person's choice and is not reported.
 *
 * Sizes: v4 reads a bare number as pixels and a string as a percentage, so
 * `minSize="15"` is 15% and `minSize={15}` is 15px.
 *
 * The handle is a 1px rule, not a grab bar. A visible gutter between two panes
 * costs space permanently to advertise an interaction that happens once a
 * week; the hit area is widened invisibly with `after:` instead, so the line
 * stays 1px and the target stays ~10px. It lights in the primary colour
 * while hovered or dragged, as desktop's splits do.
 */
export type ResizableOrientation = "horizontal" | "vertical";
/** A split's sizes, keyed by pane id, in percent. */
export type ResizableLayout = Layout;
declare function ResizableSplit({ id, orientation, defaultLayout, onLayoutCommit, className, children, onLayoutChanged: _onLayoutChanged, ...props }: Omit<React.ComponentProps<typeof Group>, "id" | "orientation" | "defaultLayout"> & {
    /** Required: v4 matches a saved layout to its group by id. */
    id: string;
    /** `horizontal` lays the panes out side by side; `vertical` stacks them. */
    orientation?: ResizableOrientation;
    defaultLayout?: ResizableLayout;
    /** The layout after the person finished dragging a handle. */
    onLayoutCommit?: (layout: ResizableLayout) => void;
    /** Not used: pass `onLayoutCommit`. */
    onLayoutChanged?: never;
}): import("react").JSX.Element;
/**
 * One pane. Every `Panel` prop passes through, including `panelRef`, so a
 * pane that must stay mounted while hidden is collapsed and expanded through
 * its imperative handle rather than unmounted.
 */
declare function ResizablePane({ id, className, ...props }: Omit<React.ComponentProps<typeof Panel>, "id"> & {
    /** Required: the layout is keyed by pane id. */
    id: string;
}): import("react").JSX.Element;
declare function ResizableHandle({ hidden, className, ...props }: Omit<React.ComponentProps<typeof Separator>, "hidden"> & {
    /**
     * Inert and invisible, but still mounted: a split whose pane is collapsed
     * keeps its handle in the tree, so expanding the pane again needs no
     * remount (and the layout keeps its shape).
     */
    hidden?: boolean;
}): import("react").JSX.Element;
export { ResizableHandle, ResizablePane, ResizableSplit };
//# sourceMappingURL=resizable-split.d.ts.map
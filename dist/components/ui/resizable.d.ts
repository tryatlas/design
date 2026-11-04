import { Group, Separator } from "react-resizable-panels";
/**
 * Split panes, on react-resizable-panels v4 (`Group / Panel / Separator` —
 * the v3 `PanelGroup / PanelResizeHandle` names are gone).
 *
 * The handle is a 1px rule, not a grab bar. A visible gutter between two panes
 * costs horizontal space permanently to advertise an interaction that happens
 * once a week; the hit area is widened invisibly with `after:` instead, so the
 * line stays 1px and the target stays ~10px.
 */
declare function ResizableGroup({ className, ...props }: React.ComponentProps<typeof Group>): import("react").JSX.Element;
declare const ResizablePanel: (({ children, className, collapsedSize, collapsedThreshold, collapsible, defaultSize, disabled, elementRef: elementRefProp, groupResizeBehavior, id: idProp, maxSize, minSize, onResize: onResizeUnstable, panelRef, style, ...rest }: import("react-resizable-panels").PanelProps) => import("react").JSX.Element) & {
    displayName: string;
};
declare function ResizableHandle({ className, ...props }: React.ComponentProps<typeof Separator>): import("react").JSX.Element;
export { ResizableGroup, ResizableHandle, ResizablePanel };
//# sourceMappingURL=resizable.d.ts.map
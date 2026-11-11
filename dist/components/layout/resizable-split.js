"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "../../lib/utils.js";
const OrientationContext = createContext("horizontal");
function ResizableSplit({ id, orientation = "horizontal", defaultLayout, onLayoutCommit, className, children, 
// Dropped: the commit gate below owns it, and a caller's would replace it.
onLayoutChanged: _onLayoutChanged, ...props }) {
    return (_jsx(OrientationContext.Provider, { value: orientation, children: _jsx(Group, { id: id, "data-slot": "resizable-split", orientation: orientation, defaultLayout: defaultLayout, onLayoutChanged: (layout, meta) => {
                if (meta?.isUserInteraction)
                    onLayoutCommit?.(layout);
            }, className: cn("flex h-full w-full", className), ...props, children: children }) }));
}
/**
 * One pane. Every `Panel` prop passes through, including `panelRef`, so a
 * pane that must stay mounted while hidden is collapsed and expanded through
 * its imperative handle rather than unmounted.
 */
function ResizablePane({ id, className, ...props }) {
    return (_jsx(Panel, { id: id, "data-slot": "resizable-pane", className: cn("min-h-0 min-w-0", className), ...props }));
}
function ResizableHandle({ hidden = false, className, ...props }) {
    const orientation = useContext(OrientationContext);
    const horizontal = orientation === "horizontal";
    return (_jsx(Separator, { "data-slot": "resizable-handle", "data-orientation": orientation, className: cn("relative shrink-0 bg-border", "transition-colors duration-fast ease-out-strong", "hover:bg-primary data-[separator=active]:bg-primary", 
        // The invisible ~10px target around the 1px line, across its axis.
        "after:absolute after:content-['']", horizontal
            ? "w-px cursor-col-resize after:inset-y-0 after:-left-1 after:w-2.5"
            : "h-px cursor-row-resize after:inset-x-0 after:-top-1 after:h-2.5", hidden && "pointer-events-none invisible", className), ...props }));
}
export { ResizableHandle, ResizablePane, ResizableSplit };
//# sourceMappingURL=resizable-split.js.map
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "../../lib/utils.js";
import { toggleVariants } from "./toggle.js";
const ToggleGroupContext = React.createContext({
    size: "default",
    variant: "default",
    spacing: 2,
    orientation: "horizontal",
});
function ToggleGroup({ className, variant, size, spacing = 2, orientation = "horizontal", children, ...props }) {
    return (_jsx(ToggleGroupPrimitive, { "data-slot": "toggle-group", "data-variant": variant, "data-size": size, "data-spacing": spacing, orientation: orientation, className: cn(
        // Base UI writes `data-orientation`; `spacing={0}` joins the items
        // into one strip, so the gap goes too.
        "group/toggle-group flex w-fit flex-row items-center gap-0.5 rounded data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[spacing=0]:gap-0", className), ...props, children: _jsx(ToggleGroupContext.Provider, { value: { variant, size, spacing, orientation }, children: children }) }));
}
function ToggleGroupItem({ className, children, variant = "default", size = "default", ...props }) {
    const context = React.useContext(ToggleGroupContext);
    return (_jsx(TogglePrimitive, { "data-slot": "toggle-group-item", "data-variant": context.variant || variant, "data-size": context.size || size, "data-spacing": context.spacing, className: cn("shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:first:rounded-l-sm group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:first:rounded-t-sm group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:last:rounded-r-sm group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:last:rounded-b-sm group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t", toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
        }), className), ...props, children: children }));
}
export { ToggleGroup, ToggleGroupItem };
//# sourceMappingURL=toggle-group.js.map
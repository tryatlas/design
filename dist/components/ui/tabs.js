"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
/**
 * Tabs, in two shapes that do different jobs:
 *
 * - `segmented` — `Segmented`'s look (a hairline track, the chosen tab on
 *   the selected fill) for when the switch also owns panels. This is the
 *   `1d / 7d / 30d` control: a small, local switch between renderings of the
 *   same data. Keep it short; it does not scroll. With no panels to own,
 *   reach for `Segmented` itself.
 * - `line` — an underline rail. This is a section-level switch between
 *   different content, and it sits directly on the page surface.
 *
 * Neither is a substitute for navigation. A tab that changes the URL and can
 * be linked to is a nav item; put it in the sidebar or the settings rail.
 */
function Tabs({ className, orientation = "horizontal", ...props }) {
    return (_jsx(TabsPrimitive.Root, { "data-slot": "tabs", "data-orientation": orientation, className: cn("group/tabs flex gap-3 data-[orientation=horizontal]:flex-col", className), ...props }));
}
const tabsListVariants = cva([
    "group/tabs-list inline-flex w-fit items-center justify-center",
    "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
], {
    variants: {
        variant: {
            segmented: "gap-0.5 rounded-full border border-border p-0.5 text-muted-foreground",
            line: "h-control-lg w-full justify-start gap-4 rounded-none border-b border-border-subtle",
        },
    },
    defaultVariants: { variant: "segmented" },
});
function TabsList({ className, variant, ...props }) {
    return (_jsx(TabsPrimitive.List, { "data-slot": "tabs-list", "data-variant": variant ?? "segmented", className: cn(tabsListVariants({ variant }), className), ...props }));
}
function TabsTrigger({ className, ...props }) {
    return (_jsx(TabsPrimitive.Tab, { "data-slot": "tabs-trigger", className: cn("relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap", "text-xs font-medium text-muted-foreground select-none", "transition-colors duration-fast ease-out-strong", "hover:text-foreground", "data-disabled:pointer-events-none data-disabled:opacity-50", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5", 
        // segmented: the active tab is a raised pill on the recessed track
        "group-data-[variant=segmented]/tabs-list:h-control-sm", "group-data-[variant=segmented]/tabs-list:flex-1", "group-data-[variant=segmented]/tabs-list:rounded-full", "group-data-[variant=segmented]/tabs-list:px-2.5", "group-data-[variant=segmented]/tabs-list:data-active:bg-element-selected", "group-data-[variant=segmented]/tabs-list:data-active:text-foreground", 
        // line: a 2px rule under the active tab, overlapping the list's border
        "group-data-[variant=line]/tabs-list:h-full", "group-data-[variant=line]/tabs-list:rounded-none", "group-data-[variant=line]/tabs-list:data-active:text-foreground", "group-data-[variant=line]/tabs-list:after:absolute", "group-data-[variant=line]/tabs-list:after:inset-x-0", "group-data-[variant=line]/tabs-list:after:-bottom-px", "group-data-[variant=line]/tabs-list:after:h-px", "group-data-[variant=line]/tabs-list:after:bg-foreground", "group-data-[variant=line]/tabs-list:after:opacity-0", "group-data-[variant=line]/tabs-list:after:transition-opacity", "group-data-[variant=line]/tabs-list:data-active:after:opacity-100", className), ...props }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Panel, { "data-slot": "tabs-content", className: cn("flex-1 outline-none", className), ...props }));
}
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
//# sourceMappingURL=tabs.js.map
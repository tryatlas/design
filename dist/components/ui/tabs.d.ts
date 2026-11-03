import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { VariantProps } from "class-variance-authority";
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
declare function Tabs({ className, orientation, ...props }: TabsPrimitive.Root.Props): import("react").JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "line" | "segmented" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function TabsList({ className, variant, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>): import("react").JSX.Element;
declare function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): import("react").JSX.Element;
declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): import("react").JSX.Element;
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
//# sourceMappingURL=tabs.d.ts.map
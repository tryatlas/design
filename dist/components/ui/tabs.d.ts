import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { VariantProps } from "class-variance-authority";
import { tabsListVariants } from "./tabs-variants.ts";
/**
 * Tabs, in two shapes that do different jobs:
 *
 * - `segmented` — `Segmented`'s look with Tabs' semantics, for when the
 *   switch also owns panels. One hairline track, tabs at their own width,
 *   and the chosen one on a thumb (`bg-element-selected`) that slides
 *   between them, in `Segmented`'s two sizes (`size="sm" | "md"`). This is
 *   the `1d / 7d / 30d` control: a small, local switch between renderings of
 *   the same data. Keep it short; it does not scroll. It is a `tablist` of
 *   `tab`s with panels, where `Segmented` is a radio group; with no panels
 *   to own, reach for `Segmented` itself.
 * - `line` — an underline rail. This is a section-level switch between
 *   different content, and it sits directly on the page surface.
 *
 * Neither is a substitute for navigation. A tab that changes the URL and can
 * be linked to is a nav item; put it in the sidebar or the settings rail.
 */
declare function Tabs({ className, orientation, ...props }: TabsPrimitive.Root.Props): import("react").JSX.Element;
declare function TabsList({ className, variant, size, children, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>): import("react").JSX.Element;
declare function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): import("react").JSX.Element;
declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): import("react").JSX.Element;
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
//# sourceMappingURL=tabs.d.ts.map
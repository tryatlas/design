import { cva } from "class-variance-authority";
/** `TabsList`'s class recipe, without `"use client"` so a server component can call it. */
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
export { tabsListVariants };
//# sourceMappingURL=tabs-variants.js.map
import { cva } from "class-variance-authority";
/** `Kbd`'s class recipe, without `"use client"` so a server component can call it. */
const kbdVariants = cva([
    "pointer-events-none inline-flex w-fit items-center justify-center gap-1 select-none",
    "rounded border border-border bg-card text-muted-foreground",
    "px-1.5 font-sans leading-none",
    "[&_svg:not([class*='size-'])]:size-3",
], {
    variants: {
        // `inverse` is a cap sitting on a primary-filled control (the ↵ on a
        // dialog's default action): the background colour, at low alpha for the
        // fill and edge, so it reads on whatever the primary token is.
        variant: {
            default: "",
            inverse: "border-background/20 bg-background/10 text-background",
            // `soft` is a borderless filled cap in the foreground colour, for a
            // legend of keys beside their labels (the command palette's footer:
            // "↑ ↓ Navigate · Enter Select · Esc Close").
            soft: "border-transparent bg-element-active text-foreground",
        },
        size: {
            xs: "h-control-xs min-w-(--control-xs) text-2xs",
            sm: "h-control-sm min-w-(--control-sm) text-xs",
        },
    },
    defaultVariants: { variant: "default", size: "xs" },
});
export { kbdVariants };
//# sourceMappingURL=kbd-variants.js.map
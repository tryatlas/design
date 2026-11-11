import { cva } from "class-variance-authority";
/** `Kbd`'s class recipe, without `"use client"` so a server component can call it. */
const kbdVariants = cva([
    "pointer-events-none inline-flex w-fit items-center justify-center gap-1 select-none",
    "rounded border border-border bg-card text-muted-foreground",
    "px-1.5 font-sans leading-none",
    "[&_svg:not([class*='size-'])]:size-3",
], {
    variants: {
        // `inverse` is a cap sitting on a primary fill that is not a `Button`:
        // the background colour, at low alpha for the fill and edge. Inside a
        // `default` or `destructive` `Button` any cap already takes the button's
        // ink, whatever its own variant (`button-variants.ts`).
        variant: {
            default: "",
            inverse: "border-background/20 bg-background/10 text-background",
            // `soft` is a borderless filled cap in the foreground colour, for a
            // legend of keys beside their labels (the command palette's footer:
            // "↑ ↓ Navigate · Enter Select · Esc Close").
            soft: "border-transparent bg-element-active text-foreground",
            // `inherit` takes every colour from the text around it: the ink at
            // full strength, and the same ink thinned for the fill and edge. For
            // a cap inside a tooltip, which may be inverted or themed, where a
            // muted ink on a card fill would not be legible.
            inherit: "border-current/25 bg-current/10 text-current",
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
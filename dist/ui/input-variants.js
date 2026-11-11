import { cva } from "class-variance-authority";
/** `Input`'s class recipe, without `"use client"` so a server component can call it. */
const inputVariants = cva([
    "w-full min-w-0 rounded border bg-panel-input text-foreground",
    "border-border transition-colors duration-fast ease-out-strong",
    "placeholder:text-muted-foreground",
    // A text field draws no outline (decision 31): the border is the focus
    // signal, in the keyboard ring's colour so it clears 3:1 on the fill.
    "focus:border-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive",
], {
    variants: {
        size: {
            xs: "h-control-xs px-1.5 text-2xs",
            sm: "h-control-sm px-2 text-xs",
            md: "h-control-md px-2 text-xs",
            lg: "h-control-lg px-2.5 text-sm",
        },
    },
    defaultVariants: { size: "md" },
});
export { inputVariants };
//# sourceMappingURL=input-variants.js.map
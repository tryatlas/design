import { cva } from "class-variance-authority";
/**
 * `Button`'s class recipe, in a module of its own with no `"use client"`, so
 * a React Server Component can call it: a link that should look like a
 * button is an `<a className={buttonVariants({ variant, size })}>`, and in
 * a server component that `<a>` never needs to be a client component.
 * Reached from `@tryatlas/design/variants` (server-safe) or the root entry.
 */
const buttonVariants = cva([
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded border border-transparent font-medium select-none",
    // Colour eases on hover; `scale` is the press dip ("Respond on press"):
    // the button sinks to 0.97 the moment it is pressed, not when the click
    // lands. `active:duration-instant` times the way down (80ms), the release
    // eases back at `duration-fast`. Disabled buttons don't dip, and reduced
    // motion keeps the colour feedback without the movement. Tailwind's
    // `scale-*` writes the `scale` property, so that is what transitions.
    "transition-[color,background-color,border-color,scale] duration-fast ease-out-strong",
    "motion-safe:not-data-disabled:active:scale-97 active:duration-instant",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    // A toggle (`aria-pressed`) that is on reads as selected, in any variant —
    // the same rule as `IconButton`.
    "aria-pressed:border-border-strong aria-pressed:bg-element-selected aria-pressed:text-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
], {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary-hover",
            destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
            outline: "border-border bg-transparent text-foreground hover:bg-element-hover",
            secondary: "bg-card text-foreground hover:bg-element-hover",
            ghost: "bg-transparent text-secondary-foreground hover:bg-element-hover hover:text-foreground",
            // A quiet action that throws work away (discard, drop): ghost at rest,
            // the error tone only under the pointer.
            "ghost-destructive": "bg-transparent text-secondary-foreground hover:bg-error-muted hover:text-error",
            // An action that answers a problem: conflicts to resolve, runs waiting
            // for approval. The border and text carry the tone; hover tints it.
            "destructive-outline": "border-error bg-transparent text-error hover:bg-error-muted",
            "warning-outline": "border-warning bg-transparent text-warning hover:bg-warning-muted",
            link: "bg-transparent text-foreground underline-offset-2 hover:underline",
        },
        size: {
            xs: "h-control-xs gap-1 px-1.5 text-2xs",
            sm: "h-control-sm px-2 text-xs",
            md: "h-control-md px-2.5 text-xs",
            lg: "h-control-lg px-3 text-sm",
        },
    },
    defaultVariants: { variant: "default", size: "md" },
});
export { buttonVariants };
//# sourceMappingURL=button-variants.js.map
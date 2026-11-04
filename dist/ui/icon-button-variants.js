import { cva } from "class-variance-authority";
/**
 * `IconButton`'s class recipe, without `"use client"` so a server component
 * can call it. See `icon-button.tsx` for the component and its rules.
 */
const iconButtonVariants = cva([
    "inline-flex shrink-0 items-center justify-center",
    "rounded border border-transparent select-none",
    // The press dip, the same as `Button`'s (see `button-variants.ts`).
    "transition-[color,background-color,border-color,scale] duration-fast ease-out-strong",
    "motion-safe:not-data-disabled:active:scale-97 active:duration-instant",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    // A toggle (`aria-pressed`) that is on reads as selected, in any variant.
    "aria-pressed:bg-element-selected aria-pressed:text-foreground",
    "[&_svg]:pointer-events-none",
], {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary-hover",
            destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
            outline: "border-border bg-transparent text-foreground hover:bg-element-hover",
            secondary: "bg-card text-foreground hover:bg-element-hover",
            ghost: "bg-transparent text-muted-foreground hover:bg-element-hover hover:text-foreground",
            // The row affordance that throws work away (discard, delete): ghost at
            // rest, the error tone only under the pointer.
            "ghost-destructive": "bg-transparent text-muted-foreground hover:bg-error-muted hover:text-error",
            // `hairline` is the rail footer's pair (help, interface scale): a
            // quiet glyph inside a subtle ring, so the controls read as present
            // but sit back from the card. Both open a popup, and stay lit while
            // it is open (`aria-expanded`, which only popup triggers set — a
            // tooltip's own open state must not light it).
            hairline: [
                "border-border-subtle bg-transparent text-muted-foreground",
                "hover:bg-element-hover hover:text-foreground",
                "aria-expanded:bg-element-hover aria-expanded:text-foreground",
            ],
        },
        size: {
            xs: "size-control-xs",
            sm: "size-control-sm",
            md: "size-control-md",
            lg: "size-control-lg",
        },
        // `round` is the stepper's shape (the −/+ either side of a value), where a
        // pair of circles reads as one control rather than two square buttons.
        shape: {
            square: "",
            round: "rounded-full",
        },
        // `active` is a control whose setting is on at rest — a filter that is
        // narrowing the list — so the square keeps the active fill rather than
        // only lighting on hover. It is a look, not a toggle: a menu trigger
        // carrying it is still a menu trigger, so no `aria-pressed`.
        active: {
            true: "bg-element-active text-foreground",
            false: "",
        },
    },
    defaultVariants: { variant: "ghost", size: "md", shape: "square", active: false },
});
export { iconButtonVariants };
//# sourceMappingURL=icon-button-variants.js.map
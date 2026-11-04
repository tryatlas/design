import { cva } from "class-variance-authority";
/**
 * `Toggle`'s class recipe, without `"use client"` so a server component can
 * call it. It sets no outline of its own: the toggle keeps the house
 * `:focus-visible` ring (decision 31, `utilities.css`), so a keyboard user
 * can see which toggle has focus. A mouse click draws nothing, since `:focus`
 * is bare.
 */
const toggleVariants = cva("group/toggle inline-flex items-center justify-center gap-1 rounded text-xs font-medium whitespace-nowrap text-secondary-foreground transition-colors duration-fast ease-out-strong hover:bg-element-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-pressed:bg-element-selected data-pressed:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5", {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border border-border bg-transparent data-pressed:border-border-strong",
        },
        size: {
            default: "h-control-md min-w-(--control-md) px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
            sm: "h-control-sm min-w-(--control-sm) px-1.5 text-2xs has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg:not([class*='size-'])]:size-3",
            lg: "h-control-lg min-w-(--control-lg) px-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
export { toggleVariants };
//# sourceMappingURL=toggle-variants.js.map
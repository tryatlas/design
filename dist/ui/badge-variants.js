import { cva } from "class-variance-authority";
/** `Badge`'s class recipe, without `"use client"` so a server component can call it. */
const badgeVariants = cva([
    "inline-flex w-fit shrink-0 items-center justify-center gap-1",
    "rounded border px-1.5 py-px font-medium whitespace-nowrap select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
], {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground",
            secondary: "border-transparent bg-card text-secondary-foreground",
            outline: "border-border bg-transparent text-secondary-foreground",
            destructive: "border-transparent bg-error-muted text-error",
            success: "border-transparent bg-success-muted text-success",
            warning: "border-transparent bg-warning-muted text-warning",
            severe: "border-transparent bg-severe-muted text-severe",
            info: "border-transparent bg-info-muted text-info",
        },
        size: {
            sm: "text-3xs",
            md: "text-2xs",
        },
    },
    defaultVariants: { variant: "secondary", size: "md" },
});
export { badgeVariants };
//# sourceMappingURL=badge-variants.js.map
/** `Badge`'s class recipe, without `"use client"` so a server component can call it. */
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "info" | "outline" | "secondary" | "severe" | "success" | "warning" | null | undefined;
    size?: "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { badgeVariants };
//# sourceMappingURL=badge-variants.d.ts.map
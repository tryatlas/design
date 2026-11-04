/**
 * `IconButton`'s class recipe, without `"use client"` so a server component
 * can call it. See `icon-button.tsx` for the component and its rules.
 */
declare const iconButtonVariants: (props?: ({
    variant?: "default" | "destructive" | "floating" | "ghost" | "ghost-destructive" | "hairline" | "outline" | "secondary" | null | undefined;
    size?: "2xs" | "lg" | "md" | "sm" | "xs" | null | undefined;
    shape?: "round" | "square" | null | undefined;
    active?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { iconButtonVariants };
//# sourceMappingURL=icon-button-variants.d.ts.map
/**
 * `Toggle`'s class recipe, without `"use client"` so a server component can
 * call it. It sets no outline of its own: the toggle keeps the house
 * `:focus-visible` ring (decision 31, `utilities.css`), so a keyboard user
 * can see which toggle has focus. A mouse click draws nothing, since `:focus`
 * is bare.
 */
declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "lg" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { toggleVariants };
//# sourceMappingURL=toggle-variants.d.ts.map
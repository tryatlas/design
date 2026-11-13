/** `Kbd`'s class recipe, without `"use client"` so a server component can call it. */
declare const kbdVariants: (props?: ({
    variant?: "default" | "inherit" | "inverse" | "soft" | null | undefined;
    size?: "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { kbdVariants };
//# sourceMappingURL=kbd-variants.d.ts.map
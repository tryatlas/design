/**
 * `Button`'s class recipe, in a module of its own with no `"use client"`, so
 * a React Server Component can call it: a link that should look like a
 * button is an `<a className={buttonVariants({ variant, size })}>`, and in
 * a server component that `<a>` never needs to be a client component.
 * Reached from `@tryatlas/design/variants` (server-safe) or the root entry.
 */
declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "destructive-outline" | "ghost" | "ghost-destructive" | "link" | "outline" | "secondary" | "success" | "success-subtle" | "warning-outline" | null | undefined;
    size?: "lg" | "md" | "sm" | "xs" | null | undefined;
    shape?: "default" | "pill" | null | undefined;
    elevated?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { buttonVariants };
//# sourceMappingURL=button-variants.d.ts.map
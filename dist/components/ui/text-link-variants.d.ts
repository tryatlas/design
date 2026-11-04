/**
 * `TextLink`'s class recipe, without `"use client"` so a server component can
 * call it on a plain `<a>`.
 *
 * The underline rule, everywhere in the package: a link that stands on its
 * own in the interface (a "View all", a footer link, a "Learn more" after a
 * sentence of UI copy) has **no underline at rest**, and underlines on hover
 * and on keyboard focus. Its place and its ink already say it is a link; a
 * rule under every one of them is noise. A link inside running text — prose,
 * rendered markdown, a field's description — **keeps its underline at rest**,
 * because there the underline is the only thing telling it apart from the
 * words around it. `.prose-session a` does that for the session blocks'
 * markdown; `Button variant="link"` follows the standalone rule.
 *
 *   default  foreground ink: a link that is the point of its line
 *   muted    secondary ink, foreground on hover: a link beside the content
 */
declare const linkVariants: (props?: ({
    tone?: "default" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export { linkVariants };
//# sourceMappingURL=text-link-variants.d.ts.map
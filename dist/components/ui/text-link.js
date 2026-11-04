"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useLinks } from "../../lib/link.js";
import { cn } from "../../lib/utils.js";
import { linkVariants } from "./text-link-variants.js";
/**
 * A standalone text link: no underline at rest, underlined on hover and on
 * keyboard focus (the rule is in `text-link-variants.ts`). It renders through
 * `LinkProvider`'s `Link`, so an app's router handles `href`; without a
 * provider it is a plain `<a href>`.
 *
 * Not for a link inside running text: prose keeps its underline at rest, and
 * an `<a>` in markdown or a description is styled by the text around it.
 */
function TextLink({ className, tone, ...props }) {
    const { Link } = useLinks();
    return (_jsx(Link, { "data-slot": "text-link", className: cn(linkVariants({ tone }), className), ...props }));
}
export { TextLink, linkVariants };
//# sourceMappingURL=text-link.js.map
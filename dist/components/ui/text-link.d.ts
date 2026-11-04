import type { VariantProps } from "class-variance-authority";
import { type LinkProps } from "../../lib/link.tsx";
import { linkVariants } from "./text-link-variants.ts";
/**
 * A standalone text link: no underline at rest, underlined on hover and on
 * keyboard focus (the rule is in `text-link-variants.ts`). It renders through
 * `LinkProvider`'s `Link`, so an app's router handles `href`; without a
 * provider it is a plain `<a href>`.
 *
 * Not for a link inside running text: prose keeps its underline at rest, and
 * an `<a>` in markdown or a description is styled by the text around it.
 */
declare function TextLink({ className, tone, ...props }: LinkProps & VariantProps<typeof linkVariants>): import("react").JSX.Element;
export { TextLink, linkVariants };
//# sourceMappingURL=text-link.d.ts.map
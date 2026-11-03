import { Button as BaseButton } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
/**
 * The house button (decision 32), built on `@base-ui/react/button`.
 *
 * Shaped like shadcn's base-style `Button` — same file, same `buttonVariants`
 * export, same `variant` / `size` prop pair, same `data-slot` — so a later
 * `shadcn add <component>` that renders a button drops in without a rewrite.
 * What differs is deliberate:
 *
 *  - **Sizes are Atlas control heights**, not shadcn's 32/36/40px. Atlas is a
 *    dense, px-based UI; `md` (26px) is the compact control the audit found
 *    everywhere, and it is the default.
 *  - **No `asChild`.** shadcn's version leans on a Slot primitive; this one
 *    takes Base UI's own `render` prop instead — `<Button render={<a
 *    href="/x" />}>` composes the element the same way, with props merged by
 *    Base UI rather than a Slot clone. (Base UI's own guidance is to reserve
 *    `render` for composing with *other components*, e.g. a Dialog/Menu
 *    trigger — a plain link that should look like a button is styled
 *    directly with `buttonVariants({ variant, size })` on an `<a>`, since a
 *    link has its own keyboard semantics that Button's `role="button"`
 *    handling isn't meant to replace.)
 *  - **Hover uses real tokens**, not `/90` opacity modifiers, which Tailwind v4
 *    compiles to `color-mix()`.
 *
 * `focusableWhenDisabled` defaults to Base UI's own default (`false`) — a
 * disabled button is out of the tab order unless a call site opts in. See
 * `IconButton` for why icon-only controls with a hint explaining the disabled
 * state are the case that wants it.
 */
declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "destructive-outline" | "ghost" | "link" | "outline" | "secondary" | "warning-outline" | null | undefined;
    size?: "lg" | "md" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends BaseButton.Props, VariantProps<typeof buttonVariants> {
}
declare function Button({ className, variant, size, type, ...props }: ButtonProps): import("react").JSX.Element;
/** `className` accepts Base UI's plain-string form as well as its state-function form. */
declare function resolveClassName<S>(className: string | ((state: S) => string | undefined) | undefined, state: S): string | undefined;
export { Button, buttonVariants, resolveClassName };
//# sourceMappingURL=button.d.ts.map
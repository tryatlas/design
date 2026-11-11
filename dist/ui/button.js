"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as BaseButton } from "@base-ui/react/button";
import { Spinner } from "../components/ui/spinner.js";
import { cn } from "../lib/utils.js";
import { buttonVariants } from "./button-variants.js";
/**
 * The house button (decision 32), built on `@base-ui/react/button`.
 *
 * Shaped like shadcn's base-style `Button` — same `buttonVariants`
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
 *  - **The recipe lives in `button-variants.ts`**, a module without
 *    `"use client"`, so a server component can style a link with
 *    `buttonVariants()` (import it from `@tryatlas/design/variants`).
 *
 * `focusableWhenDisabled` defaults to Base UI's own default (`false`) — a
 * disabled button is out of the tab order unless a call site opts in. See
 * `IconButton` for why icon-only controls with a hint explaining the disabled
 * state are the case that wants it.
 */
function Button({ className, variant, size, shape, elevated, loading = false, type = "button", onClick, children, ...props }) {
    return (_jsx(BaseButton, { "data-slot": "button", "data-loading": loading || undefined, "aria-busy": loading || undefined, type: type, className: (state) => cn(buttonVariants({ variant, size, shape, elevated }), loading && "relative", resolveClassName(className, state)), 
        // A busy button swallows the press, a form's submit included.
        onClick: loading ? (event) => event.preventDefault() : onClick, ...props, children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "contents text-transparent *:opacity-0", children: children }), _jsx(Spinner, { size: "sm", label: "", "data-slot": "button-spin", className: "absolute inset-0 m-auto text-current" })] })) : (children) }));
}
/** `className` accepts Base UI's plain-string form as well as its state-function form. */
function resolveClassName(className, state) {
    return typeof className === "function" ? className(state) : className;
}
export { Button, buttonVariants, resolveClassName };
//# sourceMappingURL=button.js.map
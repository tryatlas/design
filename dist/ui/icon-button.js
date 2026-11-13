"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Button as BaseButton } from "@base-ui/react/button";
import { isValidElement } from "react";
import { cn } from "../lib/utils.js";
import { resolveClassName } from "./button.js";
import { iconButtonVariants } from "./icon-button-variants.js";
import { Icon } from "./icon.js";
/** The glyph step that sits inside each square. */
const GLYPH_FOR_SIZE = {
    "2xs": "xs",
    xs: "xs",
    sm: "sm",
    md: "sm",
    lg: "md",
    xl: "xl",
};
/**
 * A square, icon-only button (decision 32), built on `@base-ui/react/button`
 * — see `button.tsx` for why and what that buys.
 *
 * shadcn covers this with `<Button size="icon">`; Atlas gives it its own
 * component because the icon-only control is the single most common thing in
 * this UI (titlebar, every panel header, every row affordance) and it has one
 * rule the text button does not: **it must carry a label**. `label` is required,
 * becomes the `aria-label`, and is what a `Tooltip` wrapper should show.
 *
 * The square is a control height, and the glyph inside is one step down from
 * it, so the icon never crowds its box:
 *
 *     xs 20px → icon xs (10)   sm 24px → icon sm (12)
 *     md 26px → icon sm (12)   lg 32px → icon md (14)
 *     xl 48px → icon xl (20), the call dock's controls
 *
 * `2xs` (16px, icon xs) sits below the ladder: a corner affordance on a tile,
 * not a control in a row. It is too small to be the only way to an action
 * that matters, so keep it for something the tile also exposes elsewhere or
 * that is cheap to redo (removing a staged image).
 *
 * `reveal` hides a row affordance until its row (the nearest `group`) is
 * hovered or focused; see `icon-button-variants.ts`.
 *
 * `focusableWhenDisabled` defaults to `false`, same as `Button` — see there.
 * Atlas's own hint system (`Hint` / `HintGroup`, `src/ui/tooltip.tsx`) already
 * puts a tooltip on a disabled icon button explaining why; that tooltip is
 * only reachable by keyboard when the call site opts into
 * `focusableWhenDisabled` explicitly, since most disabled icon buttons in this
 * UI carry no such explanation and keeping them out of the tab order by
 * default is the less surprising choice.
 */
function IconButton({ className, variant, size, shape, active, reveal, icon, label, iconSize, loading = false, type = "button", ...props }) {
    const glyph = isValidElement(icon) ? (icon) : (_jsx(Icon, { icon: icon, size: iconSize ?? GLYPH_FOR_SIZE[size ?? "md"] }));
    return (_jsx(BaseButton, { "data-slot": "icon-button", "data-loading": loading || undefined, "aria-busy": loading || undefined, type: type, "aria-label": label, className: (state) => cn(iconButtonVariants({ variant, size, shape, active, reveal }), resolveClassName(className, state)), ...props, children: loading ? (_jsx("span", { "data-slot": "icon-button-spin", className: "flex shrink-0 animate-spin", children: glyph })) : (glyph) }));
}
export { IconButton, iconButtonVariants };
//# sourceMappingURL=icon-button.js.map
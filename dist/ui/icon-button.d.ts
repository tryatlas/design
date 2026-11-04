import { Button as BaseButton } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { iconButtonVariants } from "./icon-button-variants.ts";
import { type IconSize } from "./icon.tsx";
export interface IconButtonProps extends Omit<BaseButton.Props, "children">, VariantProps<typeof iconButtonVariants> {
    icon: LucideIcon;
    /** Required: an icon-only control has no visible name. */
    label: string;
    /** Override the glyph step. Rarely needed — the square picks a sensible one. */
    iconSize?: IconSize;
}
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
 *
 * `focusableWhenDisabled` defaults to `false`, same as `Button` — see there.
 * Atlas's own hint system (`Hint` / `HintGroup`, `src/ui/tooltip.tsx`) already
 * puts a tooltip on a disabled icon button explaining why; that tooltip is
 * only reachable by keyboard when the call site opts into
 * `focusableWhenDisabled` explicitly, since most disabled icon buttons in this
 * UI carry no such explanation and keeping them out of the tab order by
 * default is the less surprising choice.
 */
declare function IconButton({ className, variant, size, shape, active, icon, label, iconSize, type, ...props }: IconButtonProps): import("react").JSX.Element;
export { IconButton, iconButtonVariants };
//# sourceMappingURL=icon-button.d.ts.map
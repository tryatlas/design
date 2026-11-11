import { Button as BaseButton } from "@base-ui/react/button";
import { type ReactElement } from "react";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { iconButtonVariants } from "./icon-button-variants.ts";
import { type IconSize } from "./icon.tsx";
export interface IconButtonProps extends Omit<BaseButton.Props, "children">, VariantProps<typeof iconButtonVariants> {
    /**
     * The glyph. A Lucide component (`icon={Download}`) is drawn through `Icon`
     * at the square's step. An element is drawn as given, for a glyph that is
     * not a plain Lucide icon: a refresh glyph spinning while a read is in
     * flight (an `Icon` with its own class), or one of the package's own
     * (`<RailGlyph open size="xs" />`). Size an element yourself; `iconSize` does not reach it. Prefer `Icon`
     * or a package glyph inside it: a raw Lucide element is not `aria-hidden`
     * or `shrink-0` by default.
     */
    icon: LucideIcon | ReactElement;
    /** Required: an icon-only control has no visible name. */
    label: string;
    /** Override the glyph step. Rarely needed — the square picks a sensible one.
     *  Applies to a Lucide component only. */
    iconSize?: IconSize;
    /**
     * Work this button started is running: its own glyph turns (a refresh glyph
     * while the read is in flight, as desktop's refresh buttons do) and the
     * button is `aria-busy`. It stays pressable; pass `disabled` too when a
     * second press would start the work twice.
     */
    loading?: boolean;
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
 * `2xs` (16px, icon xs) sits below the ladder: a corner affordance on a tile,
 * not a control in a row. It is too small to be the only way to an action
 * that matters, so keep it for something the tile also exposes elsewhere or
 * that is cheap to redo (removing a staged image).
 *
 * `focusableWhenDisabled` defaults to `false`, same as `Button` — see there.
 * Atlas's own hint system (`Hint` / `HintGroup`, `src/ui/tooltip.tsx`) already
 * puts a tooltip on a disabled icon button explaining why; that tooltip is
 * only reachable by keyboard when the call site opts into
 * `focusableWhenDisabled` explicitly, since most disabled icon buttons in this
 * UI carry no such explanation and keeping them out of the tab order by
 * default is the less surprising choice.
 */
declare function IconButton({ className, variant, size, shape, active, icon, label, iconSize, loading, type, ...props }: IconButtonProps): import("react").JSX.Element;
export { IconButton, iconButtonVariants };
//# sourceMappingURL=icon-button.d.ts.map
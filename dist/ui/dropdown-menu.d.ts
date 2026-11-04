import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { menuContentVariants, menuItemVariants, menuLabelVariants, menuShortcutVariants } from "./menu-variants.ts";
/**
 * The house dropdown menu (decision 16), built on `@base-ui/react/menu`.
 *
 * Base UI has no "DropdownMenu": a trigger-anchored menu *is* `Menu`. The
 * public names stay shadcn's `DropdownMenu*` so call sites read the same as
 * everywhere else, and the file keeps shadcn's base-style shape — same exports,
 * same `data-slot`, same `inset` / `variant` prop pair — so a later
 * `shadcn add` drops in with the classes swapped rather than the structure
 * rewritten.
 *
 * Anatomy is `Portal > Positioner > Popup`. Positioning props belong to the
 * Positioner; they are declared on `DropdownMenuContent` and forwarded, because
 * left in `...props` they would land on the Popup and positioning would break
 * with no type error.
 *
 * Scales: `rounded-lg`, `shadow-md` (`--elevation-menu`), and the `z-popover`
 * layer — which is *above* `z-modal` on purpose, so a menu opened inside a
 * dialog escapes it.
 */
declare function DropdownMenu(props: MenuPrimitive.Root.Props): React.JSX.Element;
declare function DropdownMenuPortal(props: MenuPrimitive.Portal.Props): React.JSX.Element;
declare function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props): React.JSX.Element;
declare function DropdownMenuGroup(props: MenuPrimitive.Group.Props): React.JSX.Element;
declare function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props): React.JSX.Element;
declare function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props): React.JSX.Element;
/** `anchor` positions the menu against another element than its trigger:
 *  a split row's ⌄ opens a menu lined up with (and as wide as) the row. */
type PositionerProps = Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "anchor">;
declare function DropdownMenuContent({ className, align, alignOffset, side, sideOffset, anchor, ...props }: MenuPrimitive.Popup.Props & PositionerProps): React.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: MenuPrimitive.GroupLabel.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ...props }: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}): React.JSX.Element;
/**
 * Composes the public Content wrapper. The four positioning defaults are the
 * submenu's visual alignment with its parent item and are load-bearing: Radix's
 * `SubContent` implied them, Base UI's Positioner does not.
 */
declare function DropdownMenuSubContent({ className, align, alignOffset, side, sideOffset, ...props }: React.ComponentProps<typeof DropdownMenuContent>): React.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: MenuPrimitive.CheckboxItem.Props): React.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props): React.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>): React.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, };
export { menuContentVariants, menuItemVariants, menuLabelVariants, menuShortcutVariants };
export type { MenuHighlight } from "./menu-variants.ts";
//# sourceMappingURL=dropdown-menu.d.ts.map
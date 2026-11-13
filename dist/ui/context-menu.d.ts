import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
/**
 * Atlas-themed shadcn base-style context menu built on
 * `@base-ui/react/context-menu`. Used by the file-tree row menu, the
 * keybindings table and any future surface that needs right-click actions.
 *
 * Anatomy is Base UI's: `Portal > Positioner > Popup`. The positioning props
 * are declared on `ContextMenuContent` and forwarded to the Positioner — left
 * in `...props` they would land on the Popup, which is the wrong node, and
 * nothing would type-error.
 *
 * Styling is the house scale: `rounded-lg` (menus), `shadow-md`
 * (`--elevation-menu`), the `z-popover` layer — which sits *above* `z-modal` on
 * purpose, so a menu opened inside a dialog escapes it — and `duration-base`
 * with `ease-out-strong` for the entrance.
 */
declare const ContextMenu: typeof ContextMenuPrimitive.Root;
declare const ContextMenuTrigger: React.ForwardRefExoticComponent<Omit<import("@base-ui/react").ContextMenuTriggerProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuGroup: React.ForwardRefExoticComponent<Omit<import("@base-ui/react").MenuGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuPortal: React.ForwardRefExoticComponent<Omit<import("@base-ui/react").MenuPortalProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuSub: typeof ContextMenuPrimitive.SubmenuRoot;
declare const ContextMenuRadioGroup: React.NamedExoticComponent<Omit<import("@base-ui/react").MenuRadioGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type PositionerProps = Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;
declare function ContextMenuContent({ className, align, alignOffset, side, sideOffset, ...props }: ContextMenuPrimitive.Popup.Props & PositionerProps): React.JSX.Element;
declare function ContextMenuItem({ className, inset, variant, ...props }: ContextMenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React.JSX.Element;
declare function ContextMenuSubTrigger({ className, inset, children, ...props }: ContextMenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}): React.JSX.Element;
/**
 * Composes the public Content wrapper rather than rebuilding from primitives.
 * The `align`/`alignOffset`/`side`/`sideOffset` quartet is the submenu's
 * visual alignment with its parent item and is load-bearing — Radix's
 * SubContent implied them, Base UI's Positioner does not.
 */
declare function ContextMenuSubContent({ className, align, alignOffset, side, sideOffset, ...props }: React.ComponentProps<typeof ContextMenuContent>): React.JSX.Element;
declare function ContextMenuCheckboxItem({ className, children, checked, inset, ...props }: ContextMenuPrimitive.CheckboxItem.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function ContextMenuLabel({ className, inset, ...props }: ContextMenuPrimitive.GroupLabel.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>): React.JSX.Element;
declare function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
export { ContextMenu, ContextMenuTrigger, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuRadioGroup, ContextMenuContent, ContextMenuItem, ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuCheckboxItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, };
//# sourceMappingURL=context-menu.d.ts.map
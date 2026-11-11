"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils.js";
import { menuContentVariants, menuItemVariants, menuLabelVariants, menuShortcutVariants, } from "./menu-variants.js";
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
function DropdownMenu(props) {
    return _jsx(MenuPrimitive.Root, { ...props });
}
function DropdownMenuPortal(props) {
    return _jsx(MenuPrimitive.Portal, { ...props });
}
function DropdownMenuTrigger(props) {
    return _jsx(MenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuGroup(props) {
    return _jsx(MenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuRadioGroup(props) {
    return _jsx(MenuPrimitive.RadioGroup, { "data-slot": "dropdown-menu-radio-group", ...props });
}
function DropdownMenuSub(props) {
    return _jsx(MenuPrimitive.SubmenuRoot, { ...props });
}
function DropdownMenuContent({ className, align = "start", alignOffset = 0, side = "bottom", sideOffset = 4, anchor, ...props }) {
    return (_jsx(MenuPrimitive.Portal, { children: _jsx(MenuPrimitive.Positioner, { className: "isolate z-popover outline-none", anchor: anchor, align: align, alignOffset: alignOffset, side: side, sideOffset: sideOffset, children: _jsx(MenuPrimitive.Popup, { "data-slot": "dropdown-menu-content", className: menuContentVariants({ className }), ...props }) }) }));
}
function DropdownMenuLabel({ className, inset, ...props }) {
    return (_jsx(MenuPrimitive.GroupLabel, { "data-slot": "dropdown-menu-label", "data-inset": inset ? "" : undefined, className: menuLabelVariants({ className }), ...props }));
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
    return (_jsx(MenuPrimitive.Item, { "data-slot": "dropdown-menu-item", "data-inset": inset ? "" : undefined, "data-variant": variant, className: menuItemVariants({ className }), ...props }));
}
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return (_jsxs(MenuPrimitive.SubmenuTrigger, { "data-slot": "dropdown-menu-sub-trigger", "data-inset": inset ? "" : undefined, className: menuItemVariants({
            className: cn("data-popup-open:bg-element-hover data-popup-open:text-foreground", className),
        }), ...props, children: [children, _jsx(ChevronRight, { className: "ml-auto" })] }));
}
/**
 * Composes the public Content wrapper. The four positioning defaults are the
 * submenu's visual alignment with its parent item and are load-bearing: Radix's
 * `SubContent` implied them, Base UI's Positioner does not.
 */
function DropdownMenuSubContent({ className, align = "start", alignOffset = -3, side = "right", sideOffset = 0, ...props }) {
    return (_jsx(DropdownMenuContent, { "data-slot": "dropdown-menu-sub-content", align: align, alignOffset: alignOffset, side: side, sideOffset: sideOffset, className: cn("w-auto min-w-[10rem]", className), ...props }));
}
const MARKED_ITEM = [
    "relative flex items-center gap-2 rounded py-1 pr-2 pl-7",
    "text-xs cursor-pointer select-none outline-none",
    "text-secondary-foreground",
    "focus:bg-element-hover focus:text-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
];
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return (_jsxs(MenuPrimitive.CheckboxItem, { "data-slot": "dropdown-menu-checkbox-item", className: cn(MARKED_ITEM, className), checked: checked, ...props, children: [_jsx("span", { className: "pointer-events-none absolute left-2 inline-flex size-3 items-center justify-center", children: _jsx(MenuPrimitive.CheckboxItemIndicator, { children: _jsx(Check, { size: 12 }) }) }), children] }));
}
function DropdownMenuRadioItem({ className, children, ...props }) {
    return (_jsxs(MenuPrimitive.RadioItem, { "data-slot": "dropdown-menu-radio-item", className: cn(MARKED_ITEM, className), ...props, children: [_jsx("span", { className: "pointer-events-none absolute left-2 inline-flex size-3 items-center justify-center", children: _jsx(MenuPrimitive.RadioItemIndicator, { children: _jsx(Check, { size: 12 }) }) }), children] }));
}
function DropdownMenuSeparator({ className, ...props }) {
    return (_jsx(MenuPrimitive.Separator, { "data-slot": "dropdown-menu-separator", className: cn("-mx-1 my-1 h-px bg-border", className), ...props }));
}
function DropdownMenuShortcut({ className, ...props }) {
    return (_jsx("span", { "data-slot": "dropdown-menu-shortcut", className: menuShortcutVariants({ className }), ...props }));
}
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, };
// The class recipes, for a menu that cannot be a Base UI `Menu` (see `menu-variants.ts`).
export { menuContentVariants, menuItemVariants, menuLabelVariants, menuShortcutVariants };
//# sourceMappingURL=dropdown-menu.js.map
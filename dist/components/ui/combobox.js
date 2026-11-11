"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { POPUP_EXIT } from "../../ui/popup-motion.js";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group.js";
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react";
const Combobox = ComboboxPrimitive.Root;
function ComboboxValue({ ...props }) {
    return _jsx(ComboboxPrimitive.Value, { "data-slot": "combobox-value", ...props });
}
function ComboboxTrigger({ className, children, ...props }) {
    return (_jsxs(ComboboxPrimitive.Trigger, { "data-slot": "combobox-trigger", className: cn("[&_svg:not([class*='size-'])]:size-3.5", className), ...props, children: [children, _jsx(ChevronDownIcon, { className: "pointer-events-none size-3.5 text-muted-foreground" })] }));
}
function ComboboxClear({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Clear, { "data-slot": "combobox-clear", render: _jsx(InputGroupButton, { variant: "ghost", size: "icon-xs" }), className: cn(className), "aria-label": "Clear", ...props, children: _jsx(XIcon, { className: "pointer-events-none" }) }));
}
function ComboboxInput({ className, children, disabled = false, showTrigger = true, showClear = false, ...props }) {
    return (_jsxs(InputGroup, { className: cn("w-auto", className), children: [_jsx(ComboboxPrimitive.Input, { render: _jsx(InputGroupInput, { disabled: disabled }), ...props }), _jsxs(InputGroupAddon, { align: "inline-end", children: [showTrigger && (_jsx(InputGroupButton, { size: "icon-xs", variant: "ghost", render: _jsx(ComboboxTrigger, {}), "data-slot": "input-group-button", className: "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent", disabled: disabled, "aria-label": "Show options", 
                        // Out of the tab order, as Base UI's own trigger is when the input
                        // sits outside the popup: the input opens the list from the
                        // keyboard, and while it is open everything else is aria-hidden.
                        // Our `Button` (Base UI's `useButton`) would otherwise set
                        // tabIndex 0 over the trigger's own -1.
                        tabIndex: -1 })), showClear && _jsx(ComboboxClear, { disabled: disabled })] }), children] }));
}
function ComboboxContent({ className, side = "bottom", sideOffset = 6, align = "start", alignOffset = 0, anchor, ...props }) {
    return (_jsx(ComboboxPrimitive.Portal, { children: _jsx(ComboboxPrimitive.Positioner, { side: side, sideOffset: sideOffset, align: align, alignOffset: alignOffset, anchor: anchor, className: "isolate z-popover", children: _jsx(ComboboxPrimitive.Popup, { "data-slot": "combobox-content", "data-chips": !!anchor, className: cn("group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) animate-scale-in overflow-hidden rounded-lg border border-border bg-popover text-foreground shadow-md data-[chips=true]:min-w-(--anchor-width) *:data-[slot=input-group]:m-0.5 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-control-md *:data-[slot=input-group]:border-none *:data-[slot=input-group]:bg-element-hover", POPUP_EXIT, className), ...props }) }) }));
}
function ComboboxList({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.List, { "data-slot": "combobox-list", className: cn("max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-0.5 overflow-y-auto overscroll-contain p-0.5 data-empty:p-0", className), ...props }));
}
function ComboboxItem({ className, children, ...props }) {
    return (_jsxs(ComboboxPrimitive.Item, { "data-slot": "combobox-item", className: cn("relative flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 pr-7 text-xs text-secondary-foreground outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-element-hover data-highlighted:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5", className), ...props, children: [children, _jsx(ComboboxPrimitive.ItemIndicator, { render: _jsx("span", { className: "pointer-events-none absolute right-2 flex items-center justify-center" }), children: _jsx(CheckIcon, { className: "pointer-events-none" }) })] }));
}
function ComboboxGroup({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Group, { "data-slot": "combobox-group", className: cn(className), ...props }));
}
function ComboboxLabel({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.GroupLabel, { "data-slot": "combobox-label", className: cn("eyebrow px-2 py-1", className), ...props }));
}
function ComboboxCollection({ ...props }) {
    return _jsx(ComboboxPrimitive.Collection, { "data-slot": "combobox-collection", ...props });
}
function ComboboxEmpty({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Empty, { "data-slot": "combobox-empty", className: cn("hidden w-full justify-center py-2 text-center text-xs text-muted-foreground group-data-empty/combobox-content:flex", className), ...props }));
}
function ComboboxSeparator({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Separator, { "data-slot": "combobox-separator", className: cn("-mx-0.5 my-0.5 h-px bg-border", className), ...props }));
}
function ComboboxChips({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Chips, { "data-slot": "combobox-chips", className: cn("flex min-h-(--control-md) flex-wrap items-center gap-1 rounded-sm border border-border bg-transparent px-2 py-0.5 text-xs transition-colors duration-fast ease-out-strong focus-within:border-ring has-data-[slot=combobox-chip]:px-1 has-aria-invalid:border-destructive", className), ...props }));
}
function ComboboxChip({ className, children, showRemove = true, ...props }) {
    return (_jsxs(ComboboxPrimitive.Chip, { "data-slot": "combobox-chip", className: cn("flex h-control-xs w-fit items-center justify-center gap-1 rounded-sm bg-element-selected px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0", className), ...props, children: [children, showRemove && (_jsx(ComboboxPrimitive.ChipRemove, { render: _jsx(Button, { variant: "ghost", size: "xs", className: "aspect-square px-0" }), className: "-ml-1 opacity-50 hover:opacity-100", "data-slot": "combobox-chip-remove", "aria-label": "Remove", children: _jsx(XIcon, { className: "pointer-events-none size-3" }) }))] }));
}
function ComboboxChipsInput({ className, ...props }) {
    return (_jsx(ComboboxPrimitive.Input, { "data-slot": "combobox-chip-input", className: cn("min-w-16 flex-1 outline-none", className), ...props }));
}
function useComboboxAnchor() {
    return React.useRef(null);
}
export { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxGroup, ComboboxLabel, ComboboxCollection, ComboboxEmpty, ComboboxSeparator, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxTrigger, ComboboxValue, useComboboxAnchor, };
//# sourceMappingURL=combobox.js.map
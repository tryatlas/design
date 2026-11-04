"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "../lib/utils.js";
/**
 * The house popover (decision 16), built on `@base-ui/react/popover`.
 *
 * Shaped like shadcn's base-style `popover` — same exports, same `data-slot`,
 * the positioning quartet declared on `PopoverContent` — so a later
 * `shadcn add` drops in with the classes swapped rather than the structure
 * rewritten.
 *
 * Anatomy is `Portal > Positioner > Popup`. The positioning props must be
 * *forwarded* to the Positioner: left in `...props` they land on the Popup,
 * which is the wrong node, and nothing type-errors.
 *
 * Scales: `rounded-lg` (the popover step), `shadow-md` (`--elevation-menu`),
 * and the `z-popover` layer on the Positioner — the Popup is static inside it,
 * so a z-index on the Popup would do nothing at all.
 *
 * `anchor` places the popup against any element, with no Trigger at all —
 * how a Tip points at the feature it explains. `arrow` draws the pointer
 * toward that anchor; it sits outside the popup's box, so an arrowed popup
 * does not clip its overflow (scroll inside the content instead).
 */
function Popover(props) {
    return _jsx(PopoverPrimitive.Root, { ...props });
}
function PopoverTrigger(props) {
    return _jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverPortal(props) {
    return _jsx(PopoverPrimitive.Portal, { ...props });
}
function PopoverClose(props) {
    return _jsx(PopoverPrimitive.Close, { "data-slot": "popover-close", ...props });
}
function PopoverContent({ className, align = "center", alignOffset = 0, side = "bottom", sideOffset = 4, surface = "default", anchor, arrow = false, children, ...props }) {
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Positioner, { className: "isolate z-popover outline-none", align: align, alignOffset: alignOffset, side: side, sideOffset: sideOffset, anchor: anchor, children: _jsxs(PopoverPrimitive.Popup, { "data-slot": "popover-content", className: cn("max-h-(--available-height) w-72 rounded-lg", !arrow && "overflow-hidden", surface === "tinted"
                    ? "bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] p-1.5 shadow-sm"
                    : surface === "glass"
                        ? "rounded-xl bg-card/95 p-1.5 shadow-lg inset-highlight backdrop-blur-glass"
                        : "bg-popover p-2.5 shadow-md", "border border-border text-foreground", "text-sm outline-none", "origin-[var(--transform-origin)] animate-scale-in", className), ...props, children: [children, arrow && (_jsx(PopoverPrimitive.Arrow, { "data-slot": "popover-arrow", className: cn(
                        // Matches the default surface; `tinted` and `glass` have no arrowed use.
                        "size-2.5 rotate-45 border-border bg-popover", "data-[side=bottom]:-top-1.25 data-[side=bottom]:border-t data-[side=bottom]:border-l", "data-[side=top]:-bottom-1.25 data-[side=top]:border-b data-[side=top]:border-r", "data-[side=left]:-right-1.25 data-[side=left]:border-t data-[side=left]:border-r", "data-[side=right]:-left-1.25 data-[side=right]:border-b data-[side=right]:border-l") }))] }) }) }));
}
function PopoverHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "popover-header", className: cn("flex flex-col gap-0.5 pb-1.5", className), ...props }));
}
function PopoverTitle({ className, ...props }) {
    return (_jsx(PopoverPrimitive.Title, { "data-slot": "popover-title", className: cn("label text-foreground", className), ...props }));
}
function PopoverDescription({ className, ...props }) {
    return (_jsx(PopoverPrimitive.Description, { "data-slot": "popover-description", className: cn("caption", className), ...props }));
}
export { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverHeader, PopoverPortal, PopoverTitle, PopoverTrigger, };
//# sourceMappingURL=popover.js.map
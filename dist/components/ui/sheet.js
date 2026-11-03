"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
function Sheet({ ...props }) {
    return _jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({ ...props }) {
    return _jsx(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetClose({ ...props }) {
    return _jsx(SheetPrimitive.Close, { "data-slot": "sheet-close", ...props });
}
function SheetPortal({ ...props }) {
    return _jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
    return (_jsx(SheetPrimitive.Backdrop, { "data-slot": "sheet-overlay", className: cn("fixed inset-0 z-drawer scrim-soft transition-opacity duration-slow ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0", className), ...props }));
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
    return (_jsxs(SheetPortal, { children: [_jsx(SheetOverlay, {}), _jsxs(SheetPrimitive.Popup, { "data-slot": "sheet-content", "data-side": side, className: cn("fixed z-drawer flex flex-col border-border bg-card text-xs text-foreground shadow-lg transition duration-slow ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className), ...props, children: [children, showCloseButton && (_jsx(SheetPrimitive.Close, { "data-slot": "sheet-close", render: _jsx(IconButton, { icon: XIcon, label: "Close", size: "sm", className: "absolute top-2 right-2" }) }))] })] }));
}
function SheetHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "sheet-header", className: cn("flex flex-col gap-1 p-4", className), ...props }));
}
function SheetFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "sheet-footer", className: cn("mt-auto flex flex-col gap-2 p-4", className), ...props }));
}
function SheetTitle({ className, ...props }) {
    return (_jsx(SheetPrimitive.Title, { "data-slot": "sheet-title", className: cn("heading text-foreground", className), ...props }));
}
function SheetDescription({ className, ...props }) {
    return (_jsx(SheetPrimitive.Description, { "data-slot": "sheet-description", className: cn("body text-secondary-foreground", className), ...props }));
}
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, };
//# sourceMappingURL=sheet.js.map
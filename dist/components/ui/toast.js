"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon, } from "lucide-react";
const toast = ToastPrimitive.createToastManager();
function ToastProvider({ ...props }) {
    return _jsx(ToastPrimitive.Provider, { ...props });
}
function ToastPortal({ ...props }) {
    return _jsx(ToastPrimitive.Portal, { "data-slot": "toast-portal", ...props });
}
function ToastViewport({ className, ...props }) {
    return (_jsx(ToastPrimitive.Viewport, { "data-slot": "toast-viewport", className: cn("pointer-events-none fixed inset-x-4 bottom-4 z-toast mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full", className), ...props }));
}
function Toast({ className, ...props }) {
    return (_jsx(ToastPrimitive.Root, { "data-slot": "toast", 
        // A stack needs a per-toast z so the frontmost one wins, but it still
        // has to live inside the named toast layer rather than at an arbitrary
        // 1000. Subtracting the index keeps the whole stack between z-popover
        // and z-tooltip, which is where a toast belongs.
        // ratchet-allow: stacks toasts within the named toast layer, counting down from it by Base UI's index
        style: { zIndex: "calc(var(--z-toast) - var(--toast-index))" }, className: cn("group/toast pointer-events-auto absolute right-0 bottom-0 w-full origin-bottom rounded-lg border border-border bg-popover text-foreground shadow-md will-change-transform outline-none select-none", "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]", "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]", "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']", "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]", "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]", "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]", "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", className), ...props }));
}
function ToastContent({ className, ...props }) {
    return (_jsx(ToastPrimitive.Content, { "data-slot": "toast-content", className: cn("flex h-full items-center gap-2.5 overflow-hidden px-3 py-2.5 transition-opacity duration-slow ease-out-strong data-behind:opacity-0 data-expanded:opacity-100", className), ...props }));
}
function ToastTitle({ className, ...props }) {
    return (_jsx(ToastPrimitive.Title, { "data-slot": "toast-title", className: cn("label text-foreground", className), ...props }));
}
function ToastDescription({ className, ...props }) {
    return (_jsx(ToastPrimitive.Description, { "data-slot": "toast-description", className: cn("text-xs text-secondary-foreground", className), ...props }));
}
function ToastAction({ className, render = _jsx(Button, { variant: "outline", size: "sm" }), ...props }) {
    return (_jsx(ToastPrimitive.Action, { "data-slot": "toast-action", render: render, className: cn("shrink-0", className), ...props }));
}
function ToastClose({ className, children, render = _jsx(Button, { variant: "ghost", size: "sm", className: "size-control-sm px-0" }), ...props }) {
    return (_jsx(ToastPrimitive.Close, { "data-slot": "toast-close", "aria-label": "Close toast", render: render, className: cn("relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground", 
        // The glyph on the icon ladder's `sm`, like an `IconButton` of this size.
        "[&_svg:not([class*='size-'])]:size-3", className), ...props, children: children ?? _jsx(XIcon, { "aria-hidden": "true" }) }));
}
function ToastIcon({ type }) {
    let icon = null;
    if (type === "success") {
        icon = _jsx(CircleCheckIcon, { "aria-hidden": "true", className: "text-success" });
    }
    if (type === "info") {
        icon = _jsx(InfoIcon, { "aria-hidden": "true" });
    }
    if (type === "warning") {
        icon = _jsx(TriangleAlertIcon, { "aria-hidden": "true", className: "text-warning" });
    }
    if (type === "error") {
        icon = _jsx(OctagonXIcon, { className: "text-error", "aria-hidden": "true" });
    }
    if (type === "loading") {
        icon = _jsx(Loader2Icon, { className: "animate-spin", "aria-hidden": "true" });
    }
    if (!icon) {
        return null;
    }
    return (_jsx("span", { "data-slot": "toast-icon", className: "shrink-0 text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5", children: icon }));
}
function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager();
    return toasts.map((toastItem) => (_jsx(Toast, { toast: toastItem, children: _jsxs(ToastContent, { children: [_jsx(ToastIcon, { type: toastItem.type }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [_jsx(ToastTitle, {}), _jsx(ToastDescription, {})] }), _jsx(ToastAction, {}), _jsx(ToastClose, {})] }) }, toastItem.id)));
}
function Toaster({ children, toastManager = toast, ...props }) {
    return (_jsxs(ToastProvider, { toastManager: toastManager, ...props, children: [children, _jsx(ToastPortal, { children: _jsx(ToastViewport, { children: _jsx(ToastList, {}) }) })] }));
}
const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;
export { Toaster, Toast, ToastAction, ToastClose, ToastContent, ToastDescription, ToastPortal, ToastProvider, ToastTitle, ToastViewport, createToastManager, toast, useToastManager, };
//# sourceMappingURL=toast.js.map
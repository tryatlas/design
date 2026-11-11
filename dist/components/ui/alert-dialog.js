"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { SCRIM_BLUR } from "../../ui/scrim.js";
/**
 * A dialog that must be answered — no backdrop dismiss (unless
 * `dismissOnBackdrop`), no close button.
 *
 * Desktop's `Dialog` surface without the close button. The action defaults
 * to `<Button variant="destructive">`, the solid fill: a dialog that must be
 * answered is nearly always confirming something destructive, and there the
 * destruction IS the action, so it carries the weight. Pass another
 * `variant` when it is not.
 */
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
/** `blur` frosts what is behind the scrim, as `DialogOverlay blur` does (`SCRIM_BLUR`). */
function AlertDialogOverlay({ className, blur = false, ...props }) {
    return (_jsx(AlertDialogPrimitive.Backdrop, { "data-slot": "alert-dialog-overlay", className: cn("fixed inset-0 z-overlay scrim", blur && SCRIM_BLUR, "data-closed:animate-fade-out data-open:animate-fade-in", className), ...props }));
}
/**
 * `dismissOnBackdrop` lets a click on the scrim cancel, for a prompt that
 * may be waved away (a "discard changes?" where leaving is also an answer).
 * Base UI's alert dialog has no pointer dismissal of its own, so this puts a
 * transparent close layer between the scrim and the dialog: a pointer path
 * only, out of the tab order and hidden from assistive tech, which already
 * has Cancel and Escape. Leave it off when the question must be answered.
 * Being a close button, it reports `onOpenChange(false)` with the reason
 * `"close-press"`, the same as Cancel: treat a backdrop click as a cancel.
 */
function AlertDialogContent({ className, blur = false, dismissOnBackdrop = false, ...props }) {
    return (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, { blur: blur }), dismissOnBackdrop && (_jsx(AlertDialogPrimitive.Close, { "data-slot": "alert-dialog-backdrop-close", nativeButton: false, "aria-hidden": "true", tabIndex: -1, render: _jsx("div", {}), className: "fixed inset-0 z-overlay cursor-default" })), _jsx(AlertDialogPrimitive.Popup, { "data-slot": "alert-dialog-content", className: cn("fixed top-1/2 left-1/2 z-modal -translate-x-1/2 -translate-y-1/2", "flex w-full max-w-[min(26rem,calc(100vw-2rem))] flex-col gap-3 p-4", "rounded-xl border border-border bg-card text-foreground shadow-lg outline-none", "data-closed:animate-scale-out data-open:animate-scale-in", className), ...props })] }));
}
function AlertDialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-header", className: cn("flex flex-col gap-1", className), ...props }));
}
function AlertDialogFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "alert-dialog-footer", className: cn("flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end", className), ...props }));
}
function AlertDialogTitle({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Title, { "data-slot": "alert-dialog-title", className: cn("heading", className), ...props }));
}
function AlertDialogDescription({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Description, { "data-slot": "alert-dialog-description", className: cn("body text-secondary-foreground", className), ...props }));
}
function AlertDialogAction({ variant = "destructive", ...props }) {
    // The solid destructive fill by default. See the note at the top of the file.
    return _jsx(Button, { "data-slot": "alert-dialog-action", variant: variant, ...props });
}
function AlertDialogCancel({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Close, { "data-slot": "alert-dialog-cancel", className: cn(className), render: _jsx(Button, { variant: "outline" }), ...props }));
}
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
//# sourceMappingURL=alert-dialog.js.map
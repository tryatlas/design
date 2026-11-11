import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Button } from "../../ui/button.tsx";
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
declare const AlertDialog: typeof AlertDialogPrimitive.Root;
declare const AlertDialogTrigger: AlertDialogPrimitive.Trigger;
declare const AlertDialogPortal: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").DialogPortalProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
/** `blur` frosts what is behind the scrim, as `DialogOverlay blur` does (`SCRIM_BLUR`). */
declare function AlertDialogOverlay({ className, blur, ...props }: AlertDialogPrimitive.Backdrop.Props & {
    blur?: boolean;
}): import("react").JSX.Element;
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
declare function AlertDialogContent({ className, blur, dismissOnBackdrop, ...props }: AlertDialogPrimitive.Popup.Props & {
    blur?: boolean;
    dismissOnBackdrop?: boolean;
}): import("react").JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
declare function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props): import("react").JSX.Element;
declare function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props): import("react").JSX.Element;
declare function AlertDialogAction({ variant, ...props }: React.ComponentProps<typeof Button>): import("react").JSX.Element;
declare function AlertDialogCancel({ className, ...props }: AlertDialogPrimitive.Close.Props): import("react").JSX.Element;
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
//# sourceMappingURL=alert-dialog.d.ts.map
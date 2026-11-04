import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Button } from "../../ui/button.tsx";
/**
 * A dialog that must be answered — no backdrop dismiss, no close button.
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
declare function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props): import("react").JSX.Element;
declare function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.Popup.Props): import("react").JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
declare function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props): import("react").JSX.Element;
declare function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props): import("react").JSX.Element;
declare function AlertDialogAction({ variant, ...props }: React.ComponentProps<typeof Button>): import("react").JSX.Element;
declare function AlertDialogCancel({ className, ...props }: AlertDialogPrimitive.Close.Props): import("react").JSX.Element;
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
//# sourceMappingURL=alert-dialog.d.ts.map
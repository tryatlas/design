import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
/**
 * The house dialog (decision 16), built on `@base-ui/react/dialog`.
 *
 * Shaped like shadcn's base-style `dialog` — same exports (including the
 * `DialogOverlay` name for what Base UI calls the Backdrop), same `data-slot`,
 * `showCloseButton` on the content — so a later `shadcn add` drops in with the
 * classes swapped rather than the structure rewritten.
 *
 * A centred modal has **no Positioner**: the Popup places itself. Only anchored
 * popups (popover, menu, tooltip) need one.
 *
 * Scales: `rounded-xl` (the dialog step), `shadow-lg` (`--elevation-dialog`),
 * `z-overlay` for the scrim and `z-modal` for the dialog. `z-popover` sits
 * above both on purpose, so a menu opened inside a dialog escapes it.
 */
declare function Dialog(props: DialogPrimitive.Root.Props): React.JSX.Element;
declare function DialogTrigger(props: DialogPrimitive.Trigger.Props): React.JSX.Element;
declare function DialogPortal(props: DialogPrimitive.Portal.Props): React.JSX.Element;
declare function DialogClose(props: DialogPrimitive.Close.Props): React.JSX.Element;
/** Radix called this the Overlay; Base UI calls it the Backdrop. */
/**
 * `blur` frosts what is behind the scrim as well as dimming it — for the
 * blocking prompts (permission, elicitation, sign-in) where the app behind
 * should read as unavailable rather than merely dimmed.
 */
declare function DialogOverlay({ className, blur, ...props }: DialogPrimitive.Backdrop.Props & {
    blur?: boolean;
}): React.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: DialogPrimitive.Popup.Props & {
    showCloseButton?: boolean;
}): React.JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props): React.JSX.Element;
declare function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props): React.JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
//# sourceMappingURL=dialog.d.ts.map
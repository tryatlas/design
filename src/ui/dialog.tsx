"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "../lib/utils.ts";
import { IconButton } from "./icon-button.tsx";
import { SCRIM_BLUR } from "./scrim.ts";

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

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** Radix called this the Overlay; Base UI calls it the Backdrop. */
/**
 * `blur` frosts what is behind the scrim as well as dimming it — for the
 * blocking prompts (permission, elicitation, sign-in) where the app behind
 * should read as unavailable rather than merely dimmed. `instant` drops the
 * fade both ways (see `DialogContent`).
 */
function DialogOverlay({
  className,
  blur = false,
  instant = false,
  ...props
}: DialogPrimitive.Backdrop.Props & { blur?: boolean; instant?: boolean }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-overlay scrim",
        blur && SCRIM_BLUR,
        instant ? "animate-none" : "data-open:animate-fade-in data-closed:animate-fade-out",
        className,
      )}
      {...props}
    />
  );
}

/**
 * `variant="media"` is the full-bleed viewer (an image, a video, a gallery):
 * a large fixed box centred with `inset-0 m-auto` instead of a translate, so
 * nothing but an open animation ever writes the element's transform or
 * translate — a caller can grow it out of the thumbnail that opened it. No
 * padding or gap (the media runs to the edges; put a header row inside), and
 * `bg-background` rather than the card, so the media sits on the page colour.
 */
type DialogContentVariant = "default" | "media";

/**
 * The default dialog's width. `sm` is 24rem, for a confirm or a one-field
 * prompt. `default` is 32rem, for a prompt or a short form. `lg` is 44rem,
 * desktop's larger dialogs (adding an agent, a skill, the theme and
 * icon-theme pickers), for a list or a form with a preview. All three stop
 * 1rem short of each window edge, measured on `--app-vw` where the app sets
 * it: an interface scale that is a CSS `zoom` inflates `100vw`, so a
 * dialog sized on it would overflow. `media` sizes itself; `size` does not
 * apply to it.
 */
type DialogContentSize = "sm" | "default" | "lg";

function DialogContent({
  className,
  children,
  showCloseButton = true,
  variant = "default",
  size = "default",
  blur = false,
  instant = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  variant?: DialogContentVariant;
  size?: DialogContentSize;
  /** Frost the page behind the scrim as well as dimming it (`DialogOverlay blur`). */
  blur?: boolean;
  /**
   * Open and close with no animation, scrim included: for a dialog opened from
   * the keyboard (a shortcuts sheet on `?`), where an entrance on every
   * keystroke reads as latency.
   */
  instant?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay blur={blur} instant={instant} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-variant={variant === "media" ? variant : undefined}
        data-size={variant !== "media" && size !== "default" ? size : undefined}
        className={cn(
          variant === "media"
            ? [
                "fixed inset-0 z-modal m-auto h-[min(82vh,860px)] w-[min(88vw,1180px)]",
                "flex flex-col overflow-hidden",
                "rounded-xl border border-border bg-background text-foreground shadow-lg",
              ]
            : [
                "fixed top-1/2 left-1/2 z-modal -translate-x-1/2 -translate-y-1/2",
                "flex w-full max-w-[min(32rem,calc(var(--app-vw,100vw)-2rem))] flex-col gap-3 p-4",
                "rounded-xl border border-border bg-card text-foreground shadow-lg",
                size === "sm" && "max-w-[min(24rem,calc(var(--app-vw,100vw)-2rem))]",
                size === "lg" && "max-w-[min(44rem,calc(var(--app-vw,100vw)-2rem))]",
              ],
          "outline-none",
          instant ? "animate-none" : "data-open:animate-scale-in data-closed:animate-scale-out",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <IconButton icon={X} label="Close" size="sm" className="absolute top-2 right-2" />
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

/**
 * `quiet` is a title that names a thing rather than heading a task: a
 * filename above an image in a `variant="media"` lightbox, set as desktop's
 * lightbox header sets it (body size, secondary ink, one truncated line that
 * fills the header row beside its controls).
 */
function DialogTitle({
  className,
  variant = "default",
  ...props
}: DialogPrimitive.Title.Props & { variant?: "default" | "quiet" }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      data-variant={variant === "quiet" ? variant : undefined}
      className={cn(
        variant === "quiet"
          ? "min-w-0 flex-1 truncate text-sm text-secondary-foreground"
          : "heading text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("body text-secondary-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
export type { DialogContentSize, DialogContentVariant };

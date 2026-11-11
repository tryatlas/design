"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import { IconButton } from "../../ui/icon-button.tsx";

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * A drawer comes in slowly and leaves quickly: `duration-slow` on
 * `ease-drawer` to arrive (it travels a whole edge, and is opened on
 * purpose), `duration-base` on `ease-out-strong` to go (the user has already
 * moved on). The scrim keeps the same time both ways, so it fades in step
 * with the panel. Only `translate` and `opacity` move.
 */
const SHEET_MOTION =
  "duration-slow ease-drawer data-ending-style:duration-base data-ending-style:ease-out-strong";

type SheetSide = "top" | "right" | "bottom" | "left";

/**
 * Where each side sits, and the edge it travels from: the whole of its own
 * size, so it slides in from off-screen rather than popping in 2.5rem short.
 * `motion-safe:`, so under reduced motion it only fades.
 */
const SIDE: Record<SheetSide, string> = {
  right:
    "inset-y-0 right-0 h-full w-full border-l motion-safe:data-starting-style:translate-x-full motion-safe:data-ending-style:translate-x-full",
  left: "inset-y-0 left-0 h-full w-full border-r motion-safe:data-starting-style:-translate-x-full motion-safe:data-ending-style:-translate-x-full",
  top: "inset-x-0 top-0 h-auto border-b motion-safe:data-starting-style:-translate-y-full motion-safe:data-ending-style:-translate-y-full",
  bottom:
    "inset-x-0 bottom-0 h-auto max-h-5/6 min-h-1/2 rounded-t-xl border-t motion-safe:data-starting-style:translate-y-full motion-safe:data-ending-style:translate-y-full",
};

/** A side sheet's width from `sm` up: `sm` 24rem, `md` 28rem, `lg` 42rem. */
type SheetSize = "sm" | "md" | "lg";

const SIZE: Record<SheetSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-2xl",
};

function SheetOverlay({
  className,
  instant = false,
  ...props
}: SheetPrimitive.Backdrop.Props & { instant?: boolean }) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-drawer scrim-soft transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0",
        instant ? "duration-0" : SHEET_MOTION,
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  size = "sm",
  flush = false,
  instant = false,
  surface = "card",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide;
  /** The width of a `left` or `right` sheet from `sm` up; full width below. */
  size?: SheetSize;
  /** No padding and no gap: the content runs to the sheet's edge. */
  flush?: boolean;
  /** Open and close with no slide and no fade, scrim included. */
  instant?: boolean;
  /**
   * The sheet's fill. `card` (the default) lifts it off the page, for a form
   * or a detail panel; `background` is the page's own fill, for a sheet that
   * carries a page (a reader, a session) and should read as one.
   */
  surface?: "card" | "background";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay instant={instant} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-size={side === "left" || side === "right" ? size : undefined}
        data-surface={surface}
        className={cn(
          "fixed z-drawer flex flex-col border-border text-xs text-foreground shadow-lg",
          surface === "background" ? "bg-background" : "bg-card",
          "transition-[translate,opacity] data-ending-style:opacity-0 data-starting-style:opacity-0",
          instant ? "duration-0" : SHEET_MOTION,
          SIDE[side],
          (side === "left" || side === "right") && SIZE[size],
          flush && "gap-0 p-0",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <IconButton icon={XIcon} label="Close" size="sm" className="absolute top-2 right-2" />
            }
          />
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

/**
 * `divided` rules the header off from the body below it, for a `flush`
 * sheet whose body scrolls under a fixed header (a detail panel).
 * `compact` tightens the bottom edge, for a header straight over a list.
 */
function SheetHeader({
  className,
  divided = false,
  compact = false,
  ...props
}: React.ComponentProps<"div"> & { divided?: boolean; compact?: boolean }) {
  return (
    <div
      data-slot="sheet-header"
      data-divided={divided || undefined}
      // `pr-10` keeps a long title clear of the close button in the corner.
      className={cn(
        "flex shrink-0 flex-col gap-1 p-4 pr-10",
        compact && "pb-2",
        divided && "border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      // The dialog footer's order: actions on the right, the primary last.
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("heading text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("body text-secondary-foreground", className)}
      {...props}
    />
  );
}

export type { SheetSide, SheetSize };
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

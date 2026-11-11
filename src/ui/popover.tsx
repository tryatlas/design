"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "../lib/utils.ts";
import { POPUP_EXIT } from "./popup-motion.ts";

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

function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPortal(props: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal {...props} />;
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  surface = "default",
  anchor,
  arrow = false,
  flush = false,
  instant = false,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  > & {
    /** Draw an arrow pointing at the anchor. */
    arrow?: boolean;
    /**
     * No padding and no gap: the content runs to the popup's edge (a list
     * with its own rows, a picker with its own header). Widths stay at the
     * call site.
     */
    flush?: boolean;
    /**
     * No entrance and no exit: for a popup opened by typing (an @-mention
     * list, a slash picker), which would otherwise replay its scale-in on
     * every keystroke that reopens it.
     */
    instant?: boolean;
    /**
     * `tinted` is the two-surface recipe the agent/model picker and org
     * switcher use: the popup is the foreground at 4% over the background (the
     * popover token is a grey slab beside an inset card) under the raised-rung
     * shadow, and the controls sit in an inset card on the app's own
     * background inside it.
     *
     * `glass` is desktop's team-chat menu (pinned messages, a new DM, a new
     * channel, the call menu): the card at 95% under the one glass blur
     * (`backdrop-blur-glass`), the top of the radius scale, a raised top
     * edge and the dialog-rung shadow. The blur radius never animates, but
     * the 150ms scale-in re-samples the backdrop each frame of the open, and
     * so does anything moving under it; once open over still content it
     * costs nothing more. Keep it to small menus: the cost grows with the
     * blurred area.
     */
    surface?: "default" | "tinted" | "glass";
  }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        className="isolate z-popover outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "max-h-(--available-height) w-72 rounded-lg",
            !arrow && "overflow-hidden",
            surface === "tinted"
              ? "bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] p-1.5 shadow-sm"
              : surface === "glass"
                ? "rounded-xl bg-card/95 p-1.5 shadow-lg inset-highlight backdrop-blur-glass"
                : "bg-popover p-2.5 shadow-md",
            "border border-border text-foreground",
            "text-sm outline-none",
            flush && "gap-0 p-0",
            instant
              ? "animate-none"
              : ["origin-[var(--transform-origin)] animate-scale-in", POPUP_EXIT],
            className,
          )}
          {...props}
        >
          {children}
          {arrow && (
            <PopoverPrimitive.Arrow
              data-slot="popover-arrow"
              className={cn(
                // Matches the default surface; `tinted` and `glass` have no arrowed use.
                "size-2.5 rotate-45 border-border bg-popover",
                "data-[side=bottom]:-top-1.25 data-[side=bottom]:border-t data-[side=bottom]:border-l",
                "data-[side=top]:-bottom-1.25 data-[side=top]:border-b data-[side=top]:border-r",
                "data-[side=left]:-right-1.25 data-[side=left]:border-t data-[side=left]:border-r",
                "data-[side=right]:-left-1.25 data-[side=right]:border-b data-[side=right]:border-l",
              )}
            />
          )}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 pb-1.5", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("label text-foreground", className)}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("caption", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
};

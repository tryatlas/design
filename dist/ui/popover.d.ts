import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
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
declare function Popover(props: PopoverPrimitive.Root.Props): React.JSX.Element;
declare function PopoverTrigger(props: PopoverPrimitive.Trigger.Props): React.JSX.Element;
declare function PopoverPortal(props: PopoverPrimitive.Portal.Props): React.JSX.Element;
declare function PopoverClose(props: PopoverPrimitive.Close.Props): React.JSX.Element;
declare function PopoverContent({ className, align, alignOffset, side, sideOffset, surface, anchor, arrow, children, ...props }: PopoverPrimitive.Popup.Props & Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "anchor"> & {
    /** Draw an arrow pointing at the anchor. */
    arrow?: boolean;
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
}): React.JSX.Element;
declare function PopoverHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props): React.JSX.Element;
declare function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props): React.JSX.Element;
export { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverHeader, PopoverPortal, PopoverTitle, PopoverTrigger, };
//# sourceMappingURL=popover.d.ts.map
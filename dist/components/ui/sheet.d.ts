import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
declare function Sheet({ ...props }: SheetPrimitive.Root.Props): React.JSX.Element;
declare function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props): React.JSX.Element;
declare function SheetClose({ ...props }: SheetPrimitive.Close.Props): React.JSX.Element;
type SheetSide = "top" | "right" | "bottom" | "left";
/** A side sheet's width from `sm` up: `sm` 24rem, `md` 28rem, `lg` 42rem. */
type SheetSize = "sm" | "md" | "lg";
declare function SheetContent({ className, children, side, size, flush, instant, surface, showCloseButton, ...props }: SheetPrimitive.Popup.Props & {
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
}): React.JSX.Element;
/**
 * `divided` rules the header off from the body below it, for a `flush`
 * sheet whose body scrolls under a fixed header (a detail panel).
 * `compact` tightens the bottom edge, for a header straight over a list.
 */
declare function SheetHeader({ className, divided, compact, ...props }: React.ComponentProps<"div"> & {
    divided?: boolean;
    compact?: boolean;
}): React.JSX.Element;
declare function SheetFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props): React.JSX.Element;
declare function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props): React.JSX.Element;
export type { SheetSide, SheetSize };
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, };
//# sourceMappingURL=sheet.d.ts.map
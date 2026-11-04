import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";
/**
 * Base UI names the shared delay `delay` (Radix: `delayDuration`) and the
 * skip-delay window `timeout` (Radix: `skipDelayDuration`). Both live on the
 * Provider; Base UI has no delay prop on the Root at all — a per-tooltip
 * override goes on the Trigger.
 */
declare function TooltipProvider({ delay, timeout, ...props }: TooltipPrimitive.Provider.Props): React.JSX.Element;
type TooltipProps = Omit<TooltipPrimitive.Root.Props, "onOpenChange"> & {
    onOpenChange?: (open: boolean, eventDetails?: TooltipPrimitive.Root.ChangeEventDetails) => void;
    /**
     * Override the shared open delay for this tooltip. Was `delayDuration` on the
     * Radix wrapper; Base UI spells the same idea `delay` (and puts it on the
     * Trigger, which is where this ends up when Atlas is not managing timing).
     */
    delay?: number;
};
/**
 * Wraps itself in a provider only when none is mounted above, so a
 * `<Tooltip>` works anywhere without setup. Base UI reads the NEAREST
 * provider, so wrapping unconditionally would give every tooltip a skip-delay
 * group of its own.
 *
 * Uncontrolled tooltips take their timing from `tooltip-timing.ts` instead of
 * Base UI's provider: the trigger is told to open at once (`delay={0}`) and
 * this component applies the shared delay, so the skip-delay window also
 * spans `HintGroup` and the titlebar dock. A controlled tooltip (`open`
 * passed) is left entirely to its owner.
 */
declare function Tooltip({ open: openProp, defaultOpen, onOpenChange, delay, ...props }: TooltipProps): React.JSX.Element;
/**
 * While the delay runs, Base UI is held at `open={false}`, so leaving the
 * trigger changes nothing Base UI knows about and it never reports a close.
 * The trigger cancels the pending open itself on leave, blur and press.
 *
 * `delay={0}` hands the wait to `tooltip-timing.ts`; Base UI's own per-trigger
 * default is 600ms and its provider delay would otherwise apply twice.
 */
declare function TooltipTrigger({ onPointerLeave, onBlur, onPointerDown, delay, ...props }: TooltipPrimitive.Trigger.Props): React.JSX.Element;
type Side = TooltipPrimitive.Positioner.Props["side"];
type Align = TooltipPrimitive.Positioner.Props["align"];
/**
 * The positioning props are declared here and forwarded to the Positioner.
 * Left in `...props` they would land on the Popup — the wrong DOM node — and
 * positioning would silently stop working.
 */
declare function TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">): React.JSX.Element;
type TriggerProps = Record<string, unknown> & {
    "aria-label"?: string;
    "aria-labelledby"?: string;
    disabled?: boolean;
};
export declare function isFocusVisible(el: EventTarget): boolean;
/**
 * Props for the element a hint wraps. The tooltip does not name its trigger
 * (Base UI only adds `aria-describedby` while it is open), so a string label
 * becomes the `aria-label` unless the element already has a name. The native
 * `title` is dropped: it would open a second, unstyled tooltip on top.
 *
 * A `title` set on an inner element (e.g. a button inside a menu trigger's
 * `render`) is out of reach here — remove it at the source.
 */
export declare function hintTriggerProps(props: TriggerProps, label: React.ReactNode): {
    title: undefined;
    "aria-label": string | undefined;
};
/**
 * The tooltip for one icon-only control:
 *
 *   <Hint label="Refresh"><button onClick={refresh}><RefreshCw /></button></Hint>
 *
 * A disabled control fires no pointer events, so its tooltip could never
 * open. When the child has a `disabled` prop at all, the trigger is a wrapping
 * span instead. The check is on the prop being present rather than true so
 * the DOM shape does not change (and focus is not lost) when it toggles.
 * Pass `wrap={false}` where the extra span would break the layout.
 */
declare function Hint({ label, shortcut, side, align, sideOffset, wrap, children, }: {
    label: React.ReactNode;
    /** Keys shown dimmed after the label, e.g. "⌘K". */
    shortcut?: React.ReactNode;
    side?: Side;
    align?: Align;
    sideOffset?: number;
    wrap?: boolean;
    children: React.ReactElement;
}): React.JSX.Element;
export { Hint, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
//# sourceMappingURL=tooltip.d.ts.map
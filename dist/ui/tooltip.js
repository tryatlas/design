"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { isTooltipWarm, markTooltipClosed, markTooltipOpen, TOOLTIP_OPEN_DELAY, TOOLTIP_WARM_WINDOW, } from "./tooltip-timing.js";
/**
 * Border-arrow tooltip: house token classes, the house `animate-scale-in`
 * (`animate-in` is a tailwindcss-animate utility this repo does not ship),
 * and the arrow SVG's `--color-*` vars bound inline so
 * the notch matches the panel fill and hairline exactly.
 *
 * Built on `@base-ui/react/tooltip`. Shaped like shadcn's base-style tooltip —
 * `Portal > Positioner > Popup`, positioning props declared on the content
 * wrapper and forwarded to the Positioner — with Atlas's own timing layered on
 * top (see `Tooltip` below).
 */
const HasProvider = React.createContext(false);
/**
 * Base UI names the shared delay `delay` (Radix: `delayDuration`) and the
 * skip-delay window `timeout` (Radix: `skipDelayDuration`). Both live on the
 * Provider; Base UI has no delay prop on the Root at all — a per-tooltip
 * override goes on the Trigger.
 */
function TooltipProvider({ delay = TOOLTIP_OPEN_DELAY, timeout = TOOLTIP_WARM_WINDOW, ...props }) {
    return (_jsx(HasProvider.Provider, { value: true, children: _jsx(TooltipPrimitive.Provider, { delay: delay, timeout: timeout, ...props }) }));
}
const Timing = React.createContext({
    instant: false,
    cancelPending: () => { },
    managed: false,
});
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
function Tooltip({ open: openProp, defaultOpen, onOpenChange, delay, ...props }) {
    const controlled = openProp !== undefined;
    const [open, setOpen] = React.useState(defaultOpen ?? false);
    const [instant, setInstant] = React.useState(false);
    const openRef = React.useRef(open);
    openRef.current = open;
    const timer = React.useRef(undefined);
    // An unmount while open must not leave the shared state warm forever.
    React.useEffect(() => () => {
        clearTimeout(timer.current);
        if (openRef.current)
            markTooltipClosed();
    }, []);
    const handleOpenChange = React.useCallback((next, eventDetails) => {
        clearTimeout(timer.current);
        if (!next) {
            if (openRef.current)
                markTooltipClosed();
            setOpen(false);
            onOpenChange?.(false, eventDetails);
            return;
        }
        if (openRef.current)
            return;
        const show = (warm) => {
            markTooltipOpen();
            setInstant(warm);
            setOpen(true);
            onOpenChange?.(true, eventDetails);
        };
        const wait = delay ?? TOOLTIP_OPEN_DELAY;
        if (isTooltipWarm() || wait === 0)
            show(isTooltipWarm());
        else
            timer.current = setTimeout(() => show(false), wait);
    }, [delay, onOpenChange]);
    const cancelPending = React.useCallback(() => clearTimeout(timer.current), []);
    const timing = React.useMemo(() => ({ instant, cancelPending, managed: true }), [instant, cancelPending]);
    const root = controlled ? (_jsx(TooltipPrimitive.Root, { open: openProp, onOpenChange: onOpenChange, ...props })) : (_jsx(Timing.Provider, { value: timing, children: _jsx(TooltipPrimitive.Root, { open: open, onOpenChange: handleOpenChange, ...props }) }));
    return React.useContext(HasProvider) ? root : _jsx(TooltipProvider, { children: root });
}
/**
 * While the delay runs, Base UI is held at `open={false}`, so leaving the
 * trigger changes nothing Base UI knows about and it never reports a close.
 * The trigger cancels the pending open itself on leave, blur and press.
 *
 * `delay={0}` hands the wait to `tooltip-timing.ts`; Base UI's own per-trigger
 * default is 600ms and its provider delay would otherwise apply twice.
 */
function TooltipTrigger({ onPointerLeave, onBlur, onPointerDown, delay, ...props }) {
    const { cancelPending, managed } = React.useContext(Timing);
    return (_jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", delay: managed ? 0 : delay, onPointerLeave: (e) => {
            cancelPending();
            onPointerLeave?.(e);
        }, onBlur: (e) => {
            cancelPending();
            onBlur?.(e);
        }, onPointerDown: (e) => {
            cancelPending();
            onPointerDown?.(e);
        }, ...props }));
}
/**
 * Radix's `Popper.Arrow` rotated the notch itself; Base UI's Arrow only sets
 * `position`, and the cross-axis `top`/`left` the floating-ui middleware
 * computed. The main-axis offset, the rotation and the origin it turns about
 * are restated here with exactly the values Radix used, so the notch lands in
 * the same place on every side.
 */
const ARROW_OFFSET = {
    top: { bottom: 0, transform: "translateY(100%)" },
    bottom: { top: 0, transformOrigin: "center 0", transform: "rotate(180deg)" },
    right: {
        left: 0,
        transformOrigin: "0 0",
        transform: "translateY(50%) rotate(90deg) translateX(-50%)",
    },
    left: {
        right: 0,
        transformOrigin: "100% 0",
        transform: "translateY(50%) rotate(-90deg) translateX(50%)",
    },
};
function arrowStyle(side) {
    if (side === "inline-start")
        return ARROW_OFFSET.left;
    if (side === "inline-end")
        return ARROW_OFFSET.right;
    return ARROW_OFFSET[side] ?? ARROW_OFFSET.top;
}
/**
 * The positioning props are declared here and forwarded to the Positioner.
 * Left in `...props` they would land on the Popup — the wrong DOM node — and
 * positioning would silently stop working.
 */
function TooltipContent({ className, side = "top", sideOffset = 0, align = "center", alignOffset = 0, children, ...props }) {
    const { instant } = React.useContext(Timing);
    return (_jsx(TooltipPrimitive.Portal, { children: _jsx(TooltipPrimitive.Positioner, { side: side, sideOffset: sideOffset, align: align, alignOffset: alignOffset, className: "isolate z-tooltip", children: _jsxs(TooltipPrimitive.Popup, { "data-slot": "tooltip-content", style: {
                    "--color-background": "var(--popover)",
                    "--color-border": "var(--border)",
                }, className: cn("group w-fit text-balance rounded-md px-2.5 py-1 text-xs", "bg-[var(--popover)] text-foreground", "outline outline-1 outline-[var(--border)]", "animate-scale-in origin-[var(--transform-origin)]", instant && "animate-none", className), ...props, children: [children, _jsx(TooltipPrimitive.Arrow, { "data-slot": "tooltip-arrow", style: (state) => arrowStyle(state.side), children: _jsx(ArrowSvg, {}) })] }) }) }));
}
export function isFocusVisible(el) {
    try {
        return el instanceof Element && el.matches(":focus-visible");
    }
    catch {
        // Engines without the selector: treat every focus as keyboard focus.
        return true;
    }
}
/**
 * Props for the element a hint wraps. The tooltip does not name its trigger
 * (Base UI only adds `aria-describedby` while it is open), so a string label
 * becomes the `aria-label` unless the element already has a name. The native
 * `title` is dropped: it would open a second, unstyled tooltip on top.
 *
 * A `title` set on an inner element (e.g. a button inside a menu trigger's
 * `render`) is out of reach here — remove it at the source.
 */
export function hintTriggerProps(props, label) {
    const named = props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;
    return {
        title: undefined,
        "aria-label": named || typeof label !== "string" ? props["aria-label"] : label,
    };
}
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
function Hint({ label, shortcut, side = "bottom", align, sideOffset = 4, wrap, children, }) {
    const child = React.Children.only(children);
    const trigger = React.cloneElement(child, hintTriggerProps(child.props, label));
    const shouldWrap = wrap ?? child.props.disabled !== undefined;
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: shouldWrap ? (_jsx("span", { className: "inline-flex [&>:disabled]:pointer-events-none", children: trigger })) : (trigger) }), _jsxs(TooltipContent, { side: side, align: align, sideOffset: sideOffset, children: [label, shortcut != null && _jsx("span", { className: "ml-1.5 text-muted-foreground", children: shortcut })] })] }));
}
export { Hint, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
const ArrowSvg = (props) => (_jsxs("svg", { width: "20", height: "10", viewBox: "0 0 20 10", fill: "none", className: "ml-[1px] mt-[-1px]", xmlns: "http://www.w3.org/2000/svg", ...props, children: [_jsx("path", { d: "M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V0H0V2H1.4651C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z", fill: "var(--color-background)" }), _jsx("path", { d: "M11.1363 8.14124C10.3757 8.82575 9.22111 8.82578 8.46041 8.14122L3.60361 3.77011C3.05281 3.27432 2.33791 2.99999 1.59681 2.99999L4.24171 3L9.12941 7.39793C9.50971 7.7402 10.087 7.7402 10.4674 7.39793L15.3544 3L18 2.99999C17.2589 2.99999 16.544 3.27432 15.9931 3.77011L11.1363 8.14124Z" }), _jsx("path", { d: "M9.6667 6.65461L14.5235 2.28352C15.4416 1.45721 16.6331 1 17.8683 1H20V2H17.8683C16.8801 2 15.9269 2.36577 15.1924 3.02682L10.3356 7.39793C9.9553 7.74021 9.378 7.7402 8.9977 7.39793L4.1409 3.02682C3.4064 2.36577 2.4532 2 1.4651 2H0V1H1.4651C2.7002 1 3.8917 1.45722 4.8099 2.28352L9.6667 6.65461Z", fill: "var(--color-border)" })] }));
//# sourceMappingURL=tooltip.js.map
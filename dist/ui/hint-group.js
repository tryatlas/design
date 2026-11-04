"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// A row of icon controls sharing one tooltip that slides between them — the
// titlebar dock's tooltip (`components/titlebar-dock.tsx`), usable around any
// toolbar without adopting the dock's pill:
//
//   <HintGroup>
//     <div className="flex gap-1">
//       <HintItem label="Undo"><button …/></HintItem>
//       <HintItem label="Redo"><button …/></HintItem>
//     </div>
//   </HintGroup>
//
// The group adds no DOM, so it can sit outside whatever element lays the row
// out. Each item is an `inline-flex` span around its control: that span is
// what gets measured and hovered, so a Radix trigger or a disabled button
// inside it still works.
//
// The strip is portalled to <body> with fixed positioning because toolbars
// live inside panels that clip their overflow. It is only mounted while the
// group is in use, so a list with one group per row costs nothing until a row
// is hovered.
//
// Timing (delay, warm window, curves) comes from `tooltip-timing.ts`, shared
// with the dock and the Radix tooltips. Unlike the dock, the tooltip can open
// upward for toolbars at the bottom of a panel. Vertical rails are not
// supported — use `Hint` there.
import { cloneElement, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils.js";
import { slideGeometry } from "./slide-geometry.js";
import { hintTriggerProps, isFocusVisible } from "./tooltip.js";
import { isTooltipWarm, markTooltipClosed, markTooltipOpen, prefersReducedMotion, slideTransition, TOOLTIP_EASE, TOOLTIP_FADE_IN_MS, TOOLTIP_OPEN_DELAY, } from "./tooltip-timing.js";
/** A gap between two items shorter than this does not close the tooltip. */
const LEAVE_GRACE = 80;
/** Unmount the strip this long after it hides, unless the group is back in use. */
const UNMOUNT_AFTER = 500;
const EDGE_MARGIN = 8;
const GAP = 6;
const GroupContext = createContext(null);
export function HintGroup({ side = "bottom", children, }) {
    const items = useRef(new Map());
    const [version, setVersion] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({ active: null, visible: false, animate: false });
    const [geometry, setGeometry] = useState(null);
    const labels = useRef(new Map());
    const openTimer = useRef(undefined);
    const leaveTimer = useRef(undefined);
    const unmountTimer = useRef(undefined);
    const visibleRef = useRef(false);
    /** The item a scheduled open is for, and the item currently shown. */
    const pendingId = useRef(null);
    const activeId = useRef(null);
    const clearTimers = () => {
        pendingId.current = null;
        clearTimeout(openTimer.current);
        clearTimeout(leaveTimer.current);
        clearTimeout(unmountTimer.current);
    };
    const setVisible = useCallback((visible) => {
        if (visible === visibleRef.current)
            return;
        visibleRef.current = visible;
        if (visible)
            markTooltipOpen();
        else
            markTooltipClosed();
    }, []);
    useEffect(() => () => {
        clearTimers();
        setVisible(false);
    }, [setVisible]);
    const hide = useCallback(() => {
        clearTimers();
        activeId.current = null;
        setVisible(false);
        setState((s) => (s.visible ? { ...s, visible: false } : s));
        unmountTimer.current = setTimeout(() => setMounted(false), UNMOUNT_AFTER);
    }, [setVisible]);
    const api = useMemo(() => ({
        register: (id, item) => {
            const prev = items.current.get(id);
            items.current.set(id, item);
            if (!prev || prev.label !== item.label || prev.el !== item.el)
                setVersion((v) => v + 1);
        },
        unregister: (id) => {
            if (items.current.delete(id))
                setVersion((v) => v + 1);
            // A control can vanish without a leave or blur (e.g. a clear button
            // that removes itself): don't open for it later, or keep showing it.
            if (pendingId.current === id) {
                clearTimeout(openTimer.current);
                pendingId.current = null;
            }
            if (activeId.current === id)
                hide();
        },
        enter: (id) => {
            clearTimers();
            setMounted(true);
            const travelling = visibleRef.current;
            const show = () => {
                pendingId.current = null;
                activeId.current = id;
                setVisible(true);
                setState({ active: id, visible: true, animate: travelling });
            };
            if (travelling || isTooltipWarm())
                show();
            else {
                pendingId.current = id;
                openTimer.current = setTimeout(show, TOOLTIP_OPEN_DELAY);
            }
        },
        leave: () => {
            pendingId.current = null;
            clearTimeout(openTimer.current);
            clearTimeout(leaveTimer.current);
            leaveTimer.current = setTimeout(hide, LEAVE_GRACE);
        },
        hide,
    }), [hide, setVisible]);
    // Strip order follows the DOM, so the tooltip slides the way the pointer
    // moves. `version` is the dependency that stands for the ref's contents.
    const order = useMemo(() => {
        void version;
        return [...items.current.entries()]
            .sort(([, a], [, b]) => {
            if (!a.el || !b.el)
                return 0;
            return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
        })
            .map(([id, item]) => ({ id, label: item.label }));
    }, [version]);
    useLayoutEffect(() => {
        if (!state.active || !state.visible)
            return;
        const control = items.current.get(state.active)?.el?.getBoundingClientRect();
        if (!control)
            return;
        const index = order.findIndex((o) => o.id === state.active);
        const slide = slideGeometry({
            index,
            widths: order.map((o) => labels.current.get(o.id)?.getBoundingClientRect().width ?? 0),
            controlCentre: control.left + control.width / 2,
            stripLeft: 0,
            viewportWidth: window.innerWidth,
            margin: EDGE_MARGIN,
        });
        if (!slide)
            return;
        const y = side === "bottom" ? control.bottom + GAP : window.innerHeight - control.top + GAP;
        setGeometry({ ...slide, y, originX: control.left + control.width / 2 });
    }, [state, order, side, mounted]);
    // A tooltip left floating while its row scrolls away would point at nothing.
    useEffect(() => {
        if (!state.visible)
            return;
        const onScroll = () => hide();
        window.addEventListener("scroll", onScroll, true);
        return () => window.removeEventListener("scroll", onScroll, true);
    }, [state.visible, hide]);
    const shown = state.visible && geometry !== null;
    // The first reveal grows from the hovered control; travel between items
    // doesn't scale. Reduced motion keeps only the fade.
    const grow = !prefersReducedMotion();
    return (_jsxs(GroupContext.Provider, { value: api, children: [children, mounted &&
                createPortal(_jsx("div", { "aria-hidden": true, "data-slot": "hint-group-tooltip", className: "pointer-events-none fixed left-0 z-tooltip", style: {
                        ...(side === "bottom" ? { top: geometry?.y ?? 0 } : { bottom: geometry?.y ?? 0 }),
                        transformOrigin: `${geometry?.originX ?? 0}px ${side === "bottom" ? "0%" : "100%"}`,
                        transform: grow && !shown ? "scale(0.97)" : undefined,
                        transition: grow ? `transform ${TOOLTIP_FADE_IN_MS}ms ${TOOLTIP_EASE}` : undefined,
                    }, children: _jsx("div", { className: cn("flex w-max", "bg-[var(--popover)] text-foreground", "outline outline-1 outline-[var(--border)]", 
                        // The menu step, like every other popover in `src/ui`. It was a
                        // literal 50%-black halo, which is a hole punched in a cream
                        // surface on any light theme.
                        "shadow-md"), style: {
                            opacity: shown ? 1 : 0,
                            transform: `translateX(${geometry?.tx ?? 0}px)`,
                            clipPath: `inset(0 ${geometry?.right ?? 0}% 0 ${geometry?.left ?? 0}% round 6px)`,
                            transition: slideTransition({ visible: shown, travel: state.animate }),
                        }, children: order.map(({ id, label }) => (_jsx("div", { ref: (el) => {
                                labels.current.set(id, el);
                            }, className: "flex h-[22px] shrink-0 items-center whitespace-nowrap px-2.5 text-xs leading-none", children: label }, id))) }) }), document.body)] }));
}
/**
 * One control in a `HintGroup`. Outside a group it renders the control
 * unchanged apart from its accessible name, so a shared button component can
 * use it unconditionally.
 */
export function HintItem({ label, reshowKey, className, children, }) {
    const api = useContext(GroupContext);
    const id = useId();
    const ref = useRef(null);
    const hovered = useRef(false);
    const prevReshowKey = useRef(reshowKey);
    useLayoutEffect(() => {
        if (!api)
            return;
        api.register(id, { label, el: ref.current });
        if (hovered.current && prevReshowKey.current !== reshowKey)
            api.enter(id);
        prevReshowKey.current = reshowKey;
    }, [api, id, label, reshowKey]);
    useEffect(() => {
        if (!api)
            return;
        return () => api.unregister(id);
    }, [api, id]);
    const control = cloneElement(children, hintTriggerProps(children.props, label));
    if (!api)
        return control;
    return (_jsx("span", { ref: ref, className: cn("inline-flex [&>:disabled]:pointer-events-none", className), onMouseEnter: () => {
            hovered.current = true;
            api.enter(id);
        }, onMouseLeave: () => {
            hovered.current = false;
            api.leave();
        }, onFocus: (e) => {
            // Pointer focus comes with a hover already; only keyboard focus opens.
            if (isFocusVisible(e.target))
                api.enter(id);
        }, onBlur: api.leave, onPointerDown: api.hide, onKeyDown: (e) => {
            if (e.key === "Escape")
                api.hide();
        }, children: control }));
}
//# sourceMappingURL=hint-group.js.map
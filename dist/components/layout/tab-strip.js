"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { HintItem } from "../../ui/hint-group.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
import { Hint } from "../../ui/tooltip.js";
import { Spinner } from "../ui/spinner.js";
/** The width of the fade at an edge with more tabs past it. */
const FADE_PX = 20;
/** Sub-pixel slack: at a fractional UI scale the true end of the scroll lands
 *  a hair short of `scrollWidth`, which would leave a fade on forever. */
const EDGE_TOLERANCE = 1;
const NO_OVERFLOW = { overflow: false, canLeft: false, canRight: false };
/** The `scrollLeft` that shows a tab whole, clear of the fades, moving as
 *  little as possible. Positions are in the scroller's content coordinates. */
function scrollLeftToReveal(scrollLeft, viewport, start, end) {
    if (start - FADE_PX < scrollLeft)
        return Math.max(0, start - FADE_PX);
    if (end + FADE_PX > scrollLeft + viewport)
        return end + FADE_PX - viewport;
    return scrollLeft;
}
/** A mask, not a gradient: a mask needs no colour, so it fades into whatever
 *  the header behind the strip paints. */
function fadeMask({ canLeft, canRight }) {
    if (!canLeft && !canRight)
        return undefined;
    const left = canLeft ? `transparent, black ${FADE_PX}px` : "black, black";
    const right = canRight ? `black calc(100% - ${FADE_PX}px), transparent` : "black, black";
    return `linear-gradient(to right, ${left}, ${right})`;
}
function TabStrip({ items, activeId, onSelect, onClose, focused = true, leading, trailing, renderTab, tabProps, rovingFocus = true, closeOnMiddleClick = true, closeOnDelete = true, closeLabel = defaultCloseLabel, className, "aria-label": ariaLabel, }) {
    const viewportRef = useRef(null);
    // Set when a tab is closed from the keyboard: the focused tab unmounts, and
    // focus would fall to <body> unless it is handed to the new tab stop.
    const refocus = useRef(false);
    const [scroll, setScroll] = useState(NO_OVERFLOW);
    const measure = useCallback(() => {
        const el = viewportRef.current;
        if (!el)
            return;
        const overflow = el.scrollWidth - el.clientWidth > EDGE_TOLERANCE;
        const canLeft = overflow && el.scrollLeft > EDGE_TOLERANCE;
        const canRight = overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE;
        // Same-value guard: `scroll` fires every frame of a scroll.
        setScroll((cur) => cur.overflow === overflow && cur.canLeft === canLeft && cur.canRight === canRight
            ? cur
            : { overflow, canLeft, canRight });
    }, []);
    // Re-measured on scroll and on resize of the viewport or its row: the strip
    // can start overflowing without anyone scrolling it (the pane narrows, a
    // tab opens, a title loads). The first measure is before paint, so the
    // fades and arrows do not flash in.
    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (!el)
            return;
        measure();
        el.addEventListener("scroll", measure, { passive: true });
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        if (el.firstElementChild)
            ro.observe(el.firstElementChild);
        return () => {
            el.removeEventListener("scroll", measure);
            ro.disconnect();
        };
    }, [measure]);
    // A mouse wheel only scrolls vertically; the strip only scrolls sideways.
    // Claimed only while there is somewhere to go, so a page under a strip
    // that fits still scrolls.
    useEffect(() => {
        const el = viewportRef.current;
        if (!el)
            return;
        const onWheel = (e) => {
            if (e.ctrlKey)
                return;
            let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (e.deltaMode === WheelEvent.DOM_DELTA_LINE)
                delta *= 16;
            if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE)
                delta *= el.clientWidth;
            if (delta === 0)
                return;
            const before = el.scrollLeft;
            el.scrollLeft += delta;
            if (el.scrollLeft !== before)
                e.preventDefault();
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);
    // The active tab, scrolled clear of the fades whenever it changes or the
    // strip starts overflowing. Before paint, so the strip does not jump.
    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (!el || !activeId || !scroll.overflow)
            return;
        const tab = tabsIn(el).find((node) => node.dataset.tabId === activeId);
        if (!tab)
            return;
        const view = el.getBoundingClientRect();
        const rect = tab.getBoundingClientRect();
        const start = rect.left - view.left + el.scrollLeft;
        const next = scrollLeftToReveal(el.scrollLeft, el.clientWidth, start, start + rect.width);
        if (next !== el.scrollLeft)
            el.scrollLeft = next;
    }, [activeId, scroll.overflow]);
    const scrollBy = (direction) => {
        const el = viewportRef.current;
        if (!el)
            return;
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        el.scrollBy({
            left: direction * Math.max(120, el.clientWidth * 0.75),
            behavior: reduce ? "auto" : "smooth",
        });
    };
    const byId = (id) => items.find((t) => t.id === id);
    const canClose = (item) => !!item && !!item.closable && !item.pinned && !!onClose;
    const onKeyDown = (e) => {
        const el = viewportRef.current;
        const target = e.target;
        if (!el || target.getAttribute("role") !== "tab")
            return;
        const tabs = tabsIn(el);
        const i = tabs.indexOf(target);
        if (i < 0)
            return;
        const id = target.dataset.tabId;
        let next = null;
        const moves = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!rovingFocus && moves.includes(e.key))
            return;
        switch (e.key) {
            case "ArrowRight":
                next = (i + 1) % tabs.length;
                break;
            case "ArrowLeft":
                next = (i - 1 + tabs.length) % tabs.length;
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = tabs.length - 1;
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (id)
                    onSelect(id);
                return;
            case "Delete": {
                const item = byId(id);
                if (closeOnDelete && canClose(item)) {
                    e.preventDefault();
                    refocus.current = true;
                    onClose?.(item.id);
                }
                return;
            }
            default:
                return;
        }
        e.preventDefault();
        tabs[next]?.focus();
    };
    const tabStop = items.some((t) => t.id === activeId) ? activeId : (items[0]?.id ?? null);
    useLayoutEffect(() => {
        if (!refocus.current)
            return;
        refocus.current = false;
        const el = viewportRef.current;
        // Only when focus was dropped: if it went somewhere (a dialog asking
        // about unsaved work, the editor), it stays there.
        const active = document.activeElement;
        if (!el || (active && active !== document.body))
            return;
        tabsIn(el)
            .find((node) => node.dataset.tabId === tabStop)
            ?.focus();
    }, [items, tabStop]);
    const mask = fadeMask(scroll);
    return (_jsxs("div", { "data-slot": "tab-strip", className: cn("flex min-w-0 items-center", className), children: [leading, _jsx("div", { ref: viewportRef, role: "tablist", "aria-label": ariaLabel, "aria-orientation": "horizontal", onKeyDown: onKeyDown, className: "flex min-w-0 shrink items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", style: mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined, children: _jsx("div", { className: "flex w-max items-center gap-0.5", children: items.map((item) => {
                        const tab = (_jsx(Tab, { ...tabProps?.(item), item: item, active: item.id === activeId, focused: focused, tabStop: !rovingFocus || item.id === tabStop, closable: canClose(item), middleClickCloses: closeOnMiddleClick, closeLabel: closeLabel(item), onSelect: onSelect, onClose: onClose }));
                        return _jsx(Fragment, { children: renderTab ? renderTab(item, tab) : tab }, item.id);
                    }) }) }), scroll.overflow && (_jsxs("div", { role: "group", "aria-label": "Scroll tabs", className: "flex shrink-0 items-center", children: [_jsx(HintItem, { label: "Scroll tabs left", children: _jsx(IconButton, { icon: ChevronLeftIcon, label: "Scroll tabs left", size: "xs", disabled: !scroll.canLeft, onClick: () => scrollBy(-1) }) }), _jsx(HintItem, { label: "Scroll tabs right", children: _jsx(IconButton, { icon: ChevronRightIcon, label: "Scroll tabs right", size: "xs", disabled: !scroll.canRight, onClick: () => scrollBy(1) }) })] })), trailing] }));
}
function defaultCloseLabel(item) {
    return `Close ${item.title}`;
}
function tabsIn(el) {
    return Array.from(el.querySelectorAll('[role="tab"][data-tab-id]'));
}
function Tab({ item, active, focused, tabStop, closable, middleClickCloses, closeLabel, dragging, onSelect, onClose, ...props }) {
    const { id, title, icon, dirty, busy, pinned } = item;
    const glyph = busy ? _jsx(Spinner, { size: "md", label: "", className: "text-primary" }) : icon;
    const hasSlot = glyph != null || closable;
    const chip = (_jsxs("div", { ...props, role: "tab", "aria-selected": active, "aria-busy": busy || undefined, "aria-label": dirty ? `${title}, unsaved` : title, tabIndex: tabStop ? 0 : -1, "data-tab-id": id, "data-active": active || undefined, "data-dirty": dirty || undefined, "data-pinned": pinned || undefined, "data-dragging": dragging || undefined, onClick: (e) => {
            props.onClick?.(e);
            onSelect(id);
        }, 
        // Middle-click must not paste the primary selection on Linux, nor
        // start an autoscroll elsewhere.
        onMouseDown: (e) => {
            props.onMouseDown?.(e);
            if (e.button === 1)
                e.preventDefault();
        }, onAuxClick: (e) => {
            props.onAuxClick?.(e);
            if (e.button === 1 && closable && middleClickCloses) {
                e.preventDefault();
                onClose?.(id);
            }
        }, className: cn("group/tab flex h-6 shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-md text-xs", "transition-colors duration-fast ease-out-strong", 
        // The strip scrolls, so it clips anything drawn outside a tab: the
        // keyboard ring goes inside instead.
        "focus-visible:-outline-offset-2", pinned ? "w-6 justify-center" : cn("max-w-44", hasSlot ? "pr-2 pl-1" : "px-2"), active
            ? focused
                ? "bg-element-selected text-foreground"
                : "bg-element-hover text-secondary-foreground"
            : "text-muted-foreground hover:bg-element-hover hover:text-foreground", 
        // The tab being dragged rides over its neighbours as they make room.
        dragging && "relative z-10 bg-element-selected text-foreground", props.className), children: [hasSlot && (_jsxs("span", { className: "relative flex size-4 shrink-0 items-center justify-center", children: [_jsx("span", { className: cn("flex items-center justify-center", closable && "group-hover/tab:invisible group-focus-visible/tab:invisible"), children: glyph }), closable && (_jsx("button", { type: "button", tabIndex: -1, "aria-label": closeLabel, onClick: (e) => {
                            e.stopPropagation();
                            onClose?.(id);
                        }, className: cn("absolute inset-0 hidden items-center justify-center rounded-sm text-muted-foreground", "hover:bg-element-active hover:text-foreground", "group-hover/tab:flex group-focus-visible/tab:flex"), children: _jsx(Icon, { icon: XIcon, size: "sm" }) }))] })), !pinned && _jsx("span", { className: cn("truncate", dirty && "italic"), children: title })] }));
    return pinned ? _jsx(Hint, { label: title, children: chip }) : chip;
}
export { TabStrip };
//# sourceMappingURL=tab-strip.js.map
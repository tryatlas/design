"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { Columns2Icon, PanelRightIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { SPRING_DOCK } from "../../lib/motion.js";
import { useMeasure } from "../../lib/use-measure.js";
import { IconButton } from "../../ui/icon-button.js";
import { SegmentedIconGroup } from "../patterns/segmented.js";
/** The gap between the page and the dock: the dock's `ml-2`. */
const DOCK_GAP = 8;
/** The compact dock's reading width, `w-95`. Only the dock reads it, so it is
 *  a constant here rather than a token. */
const DOCK_WIDTH = "23.75rem";
const SideDockContext = createContext({
    slot: null,
    mode: "compact",
    setMode: () => { },
    borrow: () => { },
    release: () => { },
    work: 0,
});
/** The dock's drawn size and the setter its size control uses. */
function useSideDock() {
    const { mode, setMode } = useContext(SideDockContext);
    return { mode, setMode };
}
/**
 * Borrow room from the dock for something that will not fit in it: a panel
 * that grows out of a button, a draft being written. `expand()` widens a
 * compact dock to half and returns how long to wait before measuring the
 * wider dock (0 when there was nothing to do, or no frame). The resize is one
 * layout step, not an animation, so that is one frame. `restore()` gives the
 * room back, unmounting does too, and a pick from the size control ends every
 * borrow: the room is the person's then.
 *
 * A borrow never reaches `onDockModeChange`, so it can never become the size
 * the app remembers and the dock next opens at.
 */
function useSideDockRoom() {
    const { mode, borrow, release, work } = useContext(SideDockContext);
    const id = useId();
    const expand = useCallback(() => {
        if (work === 0 || mode !== "compact")
            return 0;
        borrow(id);
        return 16;
    }, [borrow, id, mode, work]);
    const restore = useCallback(() => release(id), [release, id]);
    useEffect(() => () => release(id), [release, id]);
    return { expand, restore };
}
/**
 * The dock: a panel beside the page that a screen fills by rendering
 * `<SideDock>` anywhere inside the frame, which portals into the frame's
 * slot. A portal rather than a prop because the frame lives in the app's
 * layout and the dock's contents are the screen's own state. Children make it
 * open; none make it close.
 */
function SideDock({ children }) {
    const { slot } = useContext(SideDockContext);
    if (!slot)
        return null;
    return createPortal(_jsx(AnimatePresence, { initial: false, children: children && _jsx(SideDockPanel, { children: children }, "dock") }), slot);
}
/**
 * The dock moves by transform, not width. Animating `width` re-lays out the
 * page beside it on every frame, and the page is the busiest thing on
 * screen, often while a session streams. So the layout changes once and the
 * motion is composited:
 *
 *  - Entering, the dock takes its full width at once (the page narrows in
 *    one step) and slides in from 24px right of its place as it fades in,
 *    on `SPRING_DOCK`, which is critically damped.
 *  - Leaving, it is taken out of the flow first (`absolute`, pinned to the
 *    right edge), so the page widens in one step underneath it, and it
 *    slides back out to the right the way it came while fading.
 *  - Changing size (compact ↔ half) is a single layout step, not animated:
 *    tweening it would mean animating width again.
 *
 * Reduced motion drops the slide and keeps the fade. The transform is a full
 * string rather than motion's `x`, which motion can hand to the compositor.
 */
function SideDockPanel({ children }) {
    const { mode, work } = useContext(SideDockContext);
    const isPresent = useIsPresent();
    const still = useReducedMotion();
    const width = mode === "half" && work ? Math.round((work - DOCK_GAP) / 2) : DOCK_WIDTH;
    const away = still ? "translateX(0px)" : "translateX(24px)";
    return (_jsx(motion.aside, { "data-slot": "dock", "data-mode": mode, "data-panel": "", initial: { opacity: 0, transform: away }, animate: { opacity: 1, transform: "translateX(0px)" }, exit: { opacity: 0, transform: away }, transition: SPRING_DOCK, style: { width }, className: cn("z-panel flex h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card max-lg:hidden", isPresent ? "relative ml-2" : "absolute inset-y-0 right-0"), children: _jsx("div", { className: "@container flex min-h-0 w-full min-w-95 flex-1 flex-col", children: children }) }));
}
const DOCK_SIZES = [
    { mode: "compact", icon: PanelRightIcon, label: "Compact panel" },
    { mode: "half", icon: Columns2Icon, label: "Half-width panel" },
];
/** The two dock sizes as one segmented control, for a dock's header. */
function SideDockSizeToggle({ className }) {
    const { mode, setMode } = useSideDock();
    return (_jsx(SegmentedIconGroup, { className: className, children: DOCK_SIZES.map((s) => (_jsx(IconButton, { icon: s.icon, label: s.label, size: "xs", "aria-pressed": mode === s.mode, onClick: () => setMode(s.mode) }, s.mode))) }));
}
function AppFrame({ sidebar, topBar, overlay, dockMode, onDockModeChange, className, children, }) {
    const [slot, setSlot] = useState(null);
    const [borrowers, setBorrowers] = useState([]);
    // The work area is the page + dock row; the half dock is a fraction of it.
    // Measured through a callback ref, not a ref read once in an effect: when
    // the frame remounts (a hot reload, a route that rebuilds it) the observer
    // must follow the new element, or "half" silently falls back to compact.
    const [workRef, workRect] = useMeasure();
    const work = Math.round(workRect.width);
    const borrow = useCallback((id) => setBorrowers((b) => (b.includes(id) ? b : [...b, id])), []);
    const release = useCallback((id) => setBorrowers((b) => (b.includes(id) ? b.filter((x) => x !== id) : b)), []);
    const setMode = useCallback((next) => {
        setBorrowers([]);
        onDockModeChange(next);
    }, [onDockModeChange]);
    const mode = dockMode === "compact" && borrowers.length > 0 ? "half" : dockMode;
    const dock = useMemo(() => ({ slot, mode, setMode, borrow, release, work }), [slot, mode, setMode, borrow, release, work]);
    return (_jsx(SideDockContext.Provider, { value: dock, children: _jsxs("div", { "data-slot": "app-frame", className: cn("flex h-dvh w-full flex-col overflow-hidden bg-sidebar", className), children: [overlay, topBar, _jsxs("div", { className: cn("flex min-h-0 flex-1 p-2", topBar != null && "max-lg:pt-0"), children: [sidebar, _jsxs("div", { ref: workRef, className: "relative flex min-h-0 min-w-0 flex-1", children: [_jsx("main", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background", children: children }), _jsx("div", { ref: setSlot, className: "contents" })] })] })] }) }));
}
export { AppFrame, SideDock, SideDockSizeToggle, useSideDock, useSideDockRoom };
//# sourceMappingURL=app-frame.js.map
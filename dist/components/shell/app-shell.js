"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Columns2Icon, MoonIcon, PanelLeftIcon, PanelRightIcon, SunIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { SPRING_DOCK } from "../../lib/motion.js";
import { useMeasure } from "../../lib/use-measure.js";
import { SegmentedIconGroup } from "../patterns/segmented.js";
import { IconButton } from "../../ui/icon-button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip.js";
import { CommandMenu, useCommandMenu } from "./command-menu.js";
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarPanel, SidebarSearch, } from "./sidebar.js";
/**
 * The application frame: curved panels on a canvas, as the Atlas desktop app
 * draws it.
 *
 *   ┌ canvas ─────────────────────────────────────────────────────┐
 *   │ workspace ▾   ┌──────────────────────────────┐ ┌─ dock ───┐ │
 *   │ ┌─ nav ─────┐ │                              │ │          │ │
 *   │ │           │ │            page              │ │ (raised) │ │
 *   │ └───────────┘ └──────────────────────────────┘ └──────────┘ │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The canvas is `shell-canvas`, a step DARKER than the page; every panel is
 * a `rounded-xl` segment on the page `background` with an opaque
 * `shell-edge` rule, so the panels read as sheets set into the frame — which
 * is where the depth comes from. The dock is the one panel
 * on `card`, a step up, so a selected record beside the page is visibly the
 * thing in focus.
 *
 * There is no page header bar and no footer strip. Where you are is the lit
 * sidebar row; what a page can do lives in the page's own header.
 *
 * `h-svh overflow-hidden` on the outer frame: the PAGE never scrolls. Scroll
 * lives inside each panel, with `ScrollFade` edges where a panel scrolls.
 */
const STORAGE_KEY = "atlas-sidebar";
function ThemeToggle({ appearance, onToggle, }) {
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: _jsx(IconButton, { icon: appearance === "dark" ? SunIcon : MoonIcon, label: `Switch to ${appearance === "dark" ? "light" : "dark"} theme`, size: "sm", onClick: onToggle }) }), _jsxs(TooltipContent, { children: ["Switch to ", appearance === "dark" ? "light" : "dark"] })] }));
}
const DOCK_MODE_KEY = "atlas-dock";
/** The gap between the page and the dock — the shell's `ml-2`. */
const DOCK_GAP = 8;
/** The compact dock's reading width. Only the dock reads it, so it is a
 *  constant here rather than a token: 23.75rem, which is `w-95`. */
const DOCK_WIDTH = "23.75rem";
const DockContext = createContext({
    slot: null,
    mode: "compact",
    setMode: () => { },
    work: 0,
});
const useDock = () => useContext(DockContext);
/**
 * Borrow room from the dock for something that will not fit in it — a panel
 * that grows out of a button, say. `expand()` widens a compact dock to half
 * and returns how long to wait for it to finish widening (0 when there was
 * nothing to do, or no dock at all: `work` is only measured inside the app
 * shell). `restore()` puts it back — but only if it was this hook that
 * widened it, and only if nobody has resized it since.
 */
function useDockRoom() {
    const { mode, setMode, work } = useDock();
    const borrowed = useRef(false);
    const expand = useCallback(() => {
        if (work === 0 || mode !== "compact")
            return 0;
        borrowed.current = true;
        setMode("half");
        return 320;
    }, [mode, setMode, work]);
    const restore = useCallback(() => {
        if (!borrowed.current)
            return;
        borrowed.current = false;
        if (mode === "half")
            setMode("compact");
    }, [mode, setMode]);
    return { expand, restore };
}
function Dock({ children }) {
    const { slot, mode, work } = useDock();
    if (!slot)
        return null;
    const width = mode === "half" ? Math.round((work - DOCK_GAP) / 2) : DOCK_WIDTH;
    return createPortal(_jsx(AnimatePresence, { initial: false, children: children && (_jsx(motion.aside, { "data-slot": "dock", "data-mode": mode, "data-panel": "", initial: { width: 0, opacity: 0 }, animate: {
                width: work ? width : DOCK_WIDTH,
                marginLeft: DOCK_GAP,
                opacity: 1,
            }, exit: { width: 0, opacity: 0 }, transition: SPRING_DOCK, className: "relative z-panel flex h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card max-lg:hidden", children: _jsx("div", { className: "@container flex min-h-0 w-full min-w-95 flex-1 flex-col", children: children }) }, "dock")) }), slot);
}
const DOCK_SIZES = [
    { mode: "compact", icon: PanelRightIcon, label: "Compact panel" },
    { mode: "half", icon: Columns2Icon, label: "Half-width panel" },
];
/** The two dock sizes as one segmented control, for a dock's header. */
function DockSizeToggle({ className }) {
    const { mode, setMode } = useDock();
    return (_jsx(SegmentedIconGroup, { className: className, children: DOCK_SIZES.map((s) => (_jsx(IconButton, { icon: s.icon, label: s.label, size: "xs", "aria-pressed": mode === s.mode, onClick: () => setMode(s.mode) }, s.mode))) }));
}
const renderSlot = (slot, collapsed) => typeof slot === "function" ? slot({ collapsed }) : slot;
/**
 * The frame, filled by the app: what sits in the rail is the caller's, so the
 * shell holds no data and no routes. `header` is the workspace row (an
 * `OrgSwitcher`), `nav` the rail's `SidebarGroup`s, `footer` the rail's
 * bottom tools (`ProfileMenu`, `ThemeToggle`, `UiScaleControl`, `InfoMenu`),
 * and `actions` what ⌘K offers. `header` and `footer` may be functions of the
 * rail's collapsed state.
 */
function AppShell({ title, header, nav, footer, actions, children, }) {
    const [dockSlot, setDockSlot] = useState(null);
    const [dockMode, setDockModeState] = useState("compact");
    // The work area is the page + dock row; the dock's half width is a
    // fraction of it. Measured through a callback ref, not a ref read once in
    // an effect: when the shell remounts (a hot reload, a route that rebuilds
    // it) the observer must follow the new element, or it keeps reporting the
    // detached one and "half" silently falls back to compact.
    const [workRef, workRect] = useMeasure();
    const work = Math.round(workRect.width);
    useEffect(() => {
        try {
            const saved = localStorage.getItem(DOCK_MODE_KEY);
            if (saved === "half")
                setDockModeState(saved);
        }
        catch {
            // ignore
        }
    }, []);
    const setDockMode = useCallback((next) => {
        setDockModeState(next);
        try {
            localStorage.setItem(DOCK_MODE_KEY, next);
        }
        catch {
            // ignore
        }
    }, []);
    const { open, setOpen } = useCommandMenu();
    const [railCollapsed, setRailCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        try {
            setRailCollapsed(localStorage.getItem(STORAGE_KEY) === "collapsed");
        }
        catch {
            // ignore
        }
    }, []);
    const setCollapsed = (next) => {
        setRailCollapsed(next);
        try {
            localStorage.setItem(STORAGE_KEY, next ? "collapsed" : "open");
        }
        catch {
            // ignore
        }
    };
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "." && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCollapsed(!railCollapsed);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    });
    const collapsed = railCollapsed && !drawerOpen;
    return (_jsx(DockContext.Provider, { value: {
            slot: dockSlot,
            mode: dockMode,
            setMode: setDockMode,
            work,
        }, children: _jsxs("div", { className: "flex h-svh w-full flex-col overflow-hidden bg-sidebar", children: [drawerOpen && (_jsx("button", { type: "button", "aria-label": "Close navigation", onClick: () => setDrawerOpen(false), className: "fixed inset-0 z-drawer scrim-soft lg:hidden" })), _jsxs("div", { className: "flex h-10 shrink-0 items-center gap-1 px-2 lg:hidden", children: [_jsx(IconButton, { icon: PanelLeftIcon, label: "Open navigation", size: "sm", onClick: () => setDrawerOpen(true) }), _jsx("span", { className: "truncate text-xs font-medium", children: title })] }), _jsxs("div", { className: "flex min-h-0 flex-1 p-2 max-lg:pt-0", children: [_jsxs(Sidebar, { collapsed: collapsed, className: cn("lg:mr-2", "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-drawer max-lg:border-r max-lg:border-border max-lg:bg-sidebar max-lg:p-2", "max-lg:transition-transform max-lg:duration-slow max-lg:ease-drawer", !drawerOpen && "max-lg:-translate-x-full"), children: [_jsxs(SidebarHeader, { children: [_jsx("div", { className: "min-w-0 flex-1", children: renderSlot(header, collapsed) }), !collapsed && (_jsx(IconButton, { icon: PanelLeftIcon, label: "Collapse sidebar", size: "sm", onClick: () => setCollapsed(true) }))] }), _jsxs(SidebarPanel, { children: [_jsx(SidebarSearch, { onOpen: () => setOpen(true) }), _jsx(SidebarBody, { onClickCapture: () => setDrawerOpen(false), children: nav }), _jsxs(SidebarFooter, { className: "justify-between", children: [renderSlot(footer, collapsed), collapsed && (_jsx(IconButton, { icon: PanelLeftIcon, label: "Expand sidebar", size: "sm", onClick: () => setCollapsed(false) }))] })] })] }), _jsxs("div", { ref: workRef, className: "flex min-h-0 min-w-0 flex-1", children: [_jsx("main", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background", children: children }), _jsx("div", { ref: setDockSlot, className: "contents" })] })] }), _jsx(CommandMenu, { open: open, onOpenChange: setOpen, actions: actions })] }) }));
}
export { AppShell, Dock, DockSizeToggle, ThemeToggle, useDock, useDockRoom };
//# sourceMappingURL=app-shell.js.map
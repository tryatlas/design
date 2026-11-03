"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { hrefOf, isAt, useLinks } from "../../lib/link.js";
import { SPRING_PILL, SPRING_RAIL } from "../../lib/motion.js";
import { Icon } from "../../ui/icon.js";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip.js";
/**
 * The left rail, on TanStack Router.
 *
 * Three things make it feel like one object rather than a list of links:
 *
 * 1. THE ACTIVE STATE IS ONE ELEMENT. A single `motion.span` with a shared
 *    `layoutId` renders behind whichever row is current, so navigating
 *    makes it physically slide to the new row rather than cross-fading two
 *    backgrounds. The `railId` comes from `useId` at the rail level so every
 *    row agrees on it.
 *
 * 2. WIDTH IS A SPRING. `motion.aside` animates between `14rem` and
 *    `3.25rem` — rem strings, so the rail follows the interface scale with
 *    no JS multiplication. Labels fade on their own, faster curve so text is
 *    gone before the rail is narrow enough to clip it.
 *
 * 3. CHILDREN HANG OFF A RAIL. A parent with children is a disclosure, not
 *    a destination; its children drop in on a hairline with L-connectors,
 *    and the connector turns to ink on the active one.
 */
const RAIL_WIDTH = "14rem";
const RAIL_WIDTH_COLLAPSED = "3.25rem";
const SidebarContext = createContext({
    collapsed: false,
    railId: "",
    location: { pathname: "" },
});
function useSidebar() {
    return useContext(SidebarContext);
}
function Sidebar({ collapsed = false, className, children, ...props }) {
    const railId = useId();
    const { location } = useLinks();
    return (_jsx(SidebarContext.Provider, { value: { collapsed, railId, location }, children: _jsx(motion.nav, { "data-slot": "sidebar", "data-panel": "", "data-collapsed": collapsed || undefined, "aria-label": "Main", initial: false, animate: { width: collapsed ? RAIL_WIDTH_COLLAPSED : RAIL_WIDTH }, transition: SPRING_RAIL, className: cn("relative z-panel flex h-full shrink-0 flex-col", className), ...props, children: children }) }));
}
/**
 * The workspace row. It sits on the shell's canvas ABOVE the curved panel,
 * as the Atlas desktop app does — the switcher is the frame's, the panel
 * below is the navigation's.
 */
function SidebarHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "sidebar-header", className: cn("flex h-10 shrink-0 items-center gap-1 pb-2", className), ...props }));
}
/**
 * The curved segment the navigation lives in: search, groups and footer
 * inside one ringed panel on the page's own background, so the rail reads as
 * a surface with depth rather than a strip of links along the window edge.
 */
function SidebarPanel({ className, ...props }) {
    return (_jsx("div", { "data-slot": "sidebar-panel", className: cn(
        // The same panel expanded and collapsed: it only changes width, so
        // the rail's spring animates one shape rather than swapping two.
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background pt-2", className), ...props }));
}
/**
 * Collapsed, a row is only its glyph, so its name comes back as a tooltip
 * off the rail's edge. Expanded, the label is on screen and this is a
 * pass-through.
 */
function RailTip({ label, children }) {
    const { collapsed } = useSidebar();
    if (!collapsed)
        return children;
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: children }), _jsx(TooltipContent, { side: "right", children: label })] }));
}
/** The ⌘K affordance. Collapsed, it is just the glyph, in a circle. */
function SidebarSearch({ onOpen }) {
    const { collapsed } = useSidebar();
    return (_jsx("div", { className: "flex justify-center px-2 pb-2", children: _jsx(RailTip, { label: "Jump to anything\u2026 \u2318K", children: _jsxs("button", { type: "button", onClick: onOpen, "aria-keyshortcuts": "Meta+K", "aria-label": "Jump to anything", className: cn("flex h-7 shrink-0 items-center border border-border bg-panel text-xs text-disabled", "transition-colors duration-fast ease-out-strong hover:border-border-strong hover:text-muted-foreground", collapsed ? "w-7 justify-center rounded-full" : "w-full gap-1.5 rounded-xl px-2.5"), children: [_jsx(Icon, { icon: SearchIcon, size: "xs", className: "shrink-0" }), !collapsed && _jsx("span", { className: "flex-1 truncate text-left", children: "Jump to anything\u2026" })] }) }) }));
}
function SidebarBody({ className, children, ...props }) {
    const scroller = useRef(null);
    const edges = useScrollEdges(scroller, [children]);
    return (_jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx("div", { ref: scroller, "data-slot": "sidebar-body", className: cn("min-h-0 flex-1 overflow-y-auto px-2 pb-2", className), ...props, children: children }), _jsx(ScrollFade, { at: "top", visible: edges.top, className: "h-6 from-background" }), _jsx(ScrollFade, { at: "bottom", visible: edges.bottom, className: "h-6 from-background" })] }));
}
function SidebarFooter({ className, ...props }) {
    const { collapsed } = useSidebar();
    return (_jsx("div", { "data-slot": "sidebar-footer", className: cn("flex items-center gap-1 border-t border-sidebar-border p-2", collapsed && "flex-col", className), ...props }));
}
/** A labelled run of rows. Collapsed, the label becomes a short rule. */
function SidebarGroup({ label, className, children, ...props }) {
    const { collapsed } = useSidebar();
    return (_jsxs("div", { "data-slot": "sidebar-group", className: cn(collapsed ? "mb-3" : "mb-6", className), ...props, children: [label &&
                (collapsed ? (_jsx("div", { "aria-hidden": "true", className: "mx-auto mb-1.5 h-px w-5 bg-sidebar-border" })) : (_jsx("div", { className: "px-2 pb-1.5 eyebrow", children: label }))), _jsx("ul", { className: "space-y-px", children: children })] }));
}
function SidebarItem({ icon, mark, label, to, search, count, badge, children, defaultOpen = false, match, className, }) {
    const { collapsed, railId, location } = useSidebar();
    const { Link } = useLinks();
    const pathname = location.pathname;
    const hasChildren = !!children?.length;
    // A child is active on its path AND its own search params, so five
    // projects that share /projects are not all lit at once.
    const isChildActive = (c) => isAt(location, c.to, c.search);
    const childActive = hasChildren && children.some(isChildActive);
    const [open, setOpen] = useState(defaultOpen || childActive);
    const selfActive = match ? match(pathname) : to !== undefined && pathname === to;
    // Parents are disclosures, not destinations. Only light the branch when it
    // is closed, so the parent and its child never highlight together.
    const highlighted = hasChildren
        ? (childActive || selfActive) && (!open || collapsed)
        : selfActive;
    const row = (_jsxs("span", { className: cn("relative flex h-7 w-full items-center gap-2 rounded-md px-2 text-xs", "transition-colors duration-fast ease-out-strong", collapsed && "justify-center px-0", highlighted
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:bg-element-hover hover:text-foreground", className), children: [highlighted && (_jsx(motion.span, { "data-slot": "sidebar-pill", layoutId: railId, transition: SPRING_PILL, className: "absolute inset-0 rounded-md bg-element-selected" })), icon ? (_jsx(Icon, { icon: icon, size: "sm", className: "relative z-10" })) : (_jsx("span", { className: "relative z-10 flex size-3.5 shrink-0 items-center justify-center", children: mark })), _jsx(AnimatePresence, { initial: false, children: !collapsed && (_jsxs(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12, ease: "easeOut" }, className: "relative z-10 flex min-w-0 flex-1 items-center gap-2", children: [_jsx("span", { className: "flex-1 truncate text-left", children: label }), badge && (_jsx("span", { className: cn("rounded-full px-1 text-3xs font-medium", badge === "ai" && "bg-element-active text-foreground", badge === "live" && "bg-success-muted text-success", badge === "beta" && "bg-element-hover text-muted-foreground"), children: badge === "ai" ? "AI" : badge === "live" ? "●" : "β" })), count !== undefined && count > 0 && (_jsx("span", { className: "flex h-4 min-w-4 tabular-nums items-center justify-center rounded-full bg-destructive px-1 text-3xs font-semibold text-destructive-foreground", children: count })), hasChildren && (_jsx(motion.span, { animate: { rotate: open ? 90 : 0 }, transition: { duration: 0.18 }, className: "text-muted-foreground", children: _jsx(Icon, { icon: ChevronRightIcon, size: "xs" }) }))] })) })] }));
    return (_jsxs("li", { children: [hasChildren && !collapsed ? (_jsx("button", { type: "button", onClick: () => setOpen((v) => !v), "aria-expanded": open, className: "w-full text-left outline-none", children: row })) : to ? (_jsx(RailTip, { label: label, children: _jsx(Link, { href: hrefOf(to, search), className: "block outline-none", children: row }) })) : (_jsx(RailTip, { label: label, children: row })), _jsx(AnimatePresence, { initial: false, children: hasChildren && open && !collapsed && (_jsxs(motion.ul, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.22, ease: "easeInOut" }, className: "relative overflow-hidden pl-3.75", children: [_jsx("span", { className: "absolute top-0 bottom-3 left-3.75 w-px bg-sidebar-border" }), children.map((child, index) => {
                            const active = isChildActive(child);
                            return (_jsxs(motion.li, { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03, duration: 0.18 }, className: "relative", children: [_jsx("span", { "aria-hidden": "true", className: cn("absolute top-1/2 left-0 h-px w-2.5 transition-colors", active ? "bg-foreground" : "bg-sidebar-border") }), active && _jsx("span", { className: "absolute top-1 bottom-1 left-0 w-px bg-foreground" }), _jsxs(Link, { href: hrefOf(child.to, child.search), className: cn("ml-3.5 flex h-7 items-center gap-2 rounded-md px-2 text-xs", "transition-colors duration-fast ease-out-strong", active
                                            ? "bg-element-selected font-medium text-foreground"
                                            : "text-muted-foreground hover:bg-element-hover hover:text-foreground"), children: [_jsx(Icon, { icon: child.icon, size: "sm" }), _jsx("span", { className: "truncate", children: child.label })] })] }, `${child.to}#${child.label}`));
                        })] })) })] }));
}
export { Sidebar, SidebarBody, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem, SidebarPanel, SidebarSearch, useSidebar, };
//# sourceMappingURL=sidebar.js.map
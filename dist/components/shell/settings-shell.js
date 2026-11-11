"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { isAt, useLinks } from "../../lib/link.js";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.js";
import { OrgMark } from "./org-switcher.js";
/**
 * The item a path belongs to: the one it equals, or else the longest one it
 * sits under, so Billing stays lit on Billing → Plans while General
 * (`/settings`) does not light for every page beneath it.
 */
function currentItem(groups, pathname) {
    const path = pathname.replace(/(.)\/$/, "$1");
    let best;
    for (const { to } of groups.flatMap((group) => group.items)) {
        if (path === to)
            return to;
        if (path.startsWith(`${to}/`) && (!best || to.length > best.length))
            best = to;
    }
    return best;
}
/** A rail row, the sidebar's shape. */
function RailLink({ to, icon: Glyph, children, className, current, }) {
    const { Link, location } = useLinks();
    return (_jsxs(Link, { href: to, "aria-current": (current ?? isAt(location, to)) ? "page" : undefined, className: cn("group/item flex h-7 items-center gap-2 rounded-md px-2 text-xs", "transition-colors duration-fast ease-out-strong", "text-muted-foreground hover:bg-element-hover hover:text-foreground", "aria-[current=page]:bg-element-selected aria-[current=page]:font-medium aria-[current=page]:text-foreground", className), children: [Glyph && _jsx(Icon, { icon: Glyph, size: "sm" }), _jsx("span", { className: "truncate", children: children })] }));
}
function RailGroup({ label, items, current, }) {
    return (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "px-2 pb-1.5 eyebrow", children: label }), _jsx("ul", { className: "space-y-px", children: items.map((item) => (_jsx("li", { children: _jsx(RailLink, { to: item.to, icon: item.icon, current: current === undefined ? undefined : item.to === current, children: item.label }) }, item.to))) })] }));
}
/**
 * Settings, in the same frame as the app: the back link and the workspace sit
 * on the canvas, the section list is a curved nav panel, and the page is a
 * curved panel beside it — so leaving the app for settings changes what is
 * in the panels, not the shape of the window.
 *
 * Below `md` there is no room for a second column, so the table of contents
 * runs across the top of the canvas instead — the same rows, in a line that
 * scrolls sideways — and the page keeps the whole width.
 *
 * `wide` is for a page that lays plans or columns side by side: the page
 * column grows from 40rem to 72rem.
 *
 * The lit row is the page you are on, or the page it sits under: Billing
 * stays lit on its plans page.
 */
function SettingsShell({ org, groups, backHref, wide = false, children, }) {
    const nav = useRef(null);
    const page = useRef(null);
    const navEdges = useScrollEdges(nav, [groups]);
    const pageEdges = useScrollEdges(page, [children]);
    const current = currentItem(groups, useLinks().location.pathname) ?? "";
    return (_jsxs("div", { className: "flex h-svh w-full flex-col overflow-hidden bg-sidebar", children: [_jsxs("div", { className: "shrink-0 px-2 pt-2 md:hidden", children: [_jsxs("div", { className: "flex h-10 items-center justify-between gap-2 pb-2", children: [_jsx(RailLink, { to: backHref, icon: ArrowLeftIcon, children: "Back to app" }), _jsxs("span", { className: "flex min-w-0 items-center gap-2 pr-2", children: [_jsx(OrgMark, { initials: org.initials, className: "size-5 rounded-md text-3xs" }), _jsx("span", { className: "truncate text-xs font-medium", children: org.name })] })] }), _jsx("nav", { "aria-label": "Settings", className: "-mx-2 flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: groups
                            .flatMap((group) => group.items)
                            .map((item) => (_jsx(RailLink, { to: item.to, icon: item.icon, current: item.to === current, className: "shrink-0", children: item.label }, item.to))) })] }), _jsxs("div", { className: "flex min-h-0 flex-1 gap-2 p-2 max-md:pt-0", children: [_jsxs("nav", { "aria-label": "Settings", "data-panel": "", className: "flex w-56 shrink-0 flex-col max-md:hidden", children: [_jsx("div", { className: "flex h-10 shrink-0 items-center pb-2", children: _jsx(RailLink, { to: backHref, icon: ArrowLeftIcon, children: "Back to app" }) }), _jsxs("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background", children: [_jsxs("div", { className: "flex items-center gap-2 px-3 pt-3 pb-3", children: [_jsx(OrgMark, { initials: org.initials, className: "size-6 rounded-md text-3xs" }), _jsx("span", { className: "truncate text-xs font-medium", children: org.name })] }), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx("div", { ref: nav, className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2", children: groups.map((group) => (_jsx(RailGroup, { ...group, current: current }, group.label))) }), _jsx(ScrollFade, { at: "top", visible: navEdges.top, className: "h-6 from-background" }), _jsx(ScrollFade, { at: "bottom", visible: navEdges.bottom, className: "h-6 from-background" })] })] })] }), _jsxs("div", { className: "relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background", children: [_jsx("div", { ref: page, className: "h-full overflow-y-auto", children: _jsx("div", { className: cn("mx-auto w-full px-5 py-6 max-sm:px-4", wide ? "max-w-288" : "max-w-160"), children: children }) }), _jsx(ScrollFade, { at: "top", visible: pageEdges.top, className: "from-background" }), _jsx(ScrollFade, { at: "bottom", visible: pageEdges.bottom, className: "from-background" })] })] })] }));
}
export { RailGroup, RailLink, SettingsShell };
//# sourceMappingURL=settings-shell.js.map
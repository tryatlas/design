"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { isAt, useLinks } from "../../lib/link.js";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { ScrollFade, useScrollEdges } from "../../ui/scroll-fade.js";
import { OrgMark } from "./org-switcher.js";
/** A rail row, the sidebar's shape. */
function RailLink({ to, icon: Glyph, children, }) {
    const { Link, location } = useLinks();
    return (_jsxs(Link, { href: to, "aria-current": isAt(location, to) ? "page" : undefined, className: cn("group/item flex h-7 items-center gap-2 rounded-md px-2 text-xs", "transition-colors duration-fast ease-out-strong", "text-muted-foreground hover:bg-element-hover hover:text-foreground", "aria-[current=page]:bg-element-selected aria-[current=page]:font-medium aria-[current=page]:text-foreground"), children: [Glyph && _jsx(Icon, { icon: Glyph, size: "sm" }), _jsx("span", { className: "truncate", children: children })] }));
}
function RailGroup({ label, items }) {
    return (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "px-2 pb-1.5 eyebrow", children: label }), _jsx("ul", { className: "space-y-px", children: items.map((item) => (_jsx("li", { children: _jsx(RailLink, { to: item.to, icon: item.icon, children: item.label }) }, item.to))) })] }));
}
/**
 * Settings, in the same frame as the app: the back link and the workspace sit
 * on the canvas, the section list is a curved nav panel, and the page is a
 * curved panel beside it — so leaving the app for settings changes what is
 * in the panels, not the shape of the window.
 */
function SettingsShell({ org, groups, backHref, children, }) {
    const nav = useRef(null);
    const page = useRef(null);
    const navEdges = useScrollEdges(nav, [groups]);
    const pageEdges = useScrollEdges(page, [children]);
    return (_jsx("div", { className: "flex h-svh w-full flex-col overflow-hidden bg-sidebar", children: _jsxs("div", { className: "flex min-h-0 flex-1 gap-2 p-2", children: [_jsxs("nav", { "aria-label": "Settings", "data-panel": "", className: "flex w-56 shrink-0 flex-col", children: [_jsx("div", { className: "flex h-10 shrink-0 items-center pb-2", children: _jsx(RailLink, { to: backHref, icon: ArrowLeftIcon, children: "Back to app" }) }), _jsxs("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background", children: [_jsxs("div", { className: "flex items-center gap-2 px-3 pt-3 pb-3", children: [_jsx(OrgMark, { initials: org.initials, className: "size-6 rounded-md text-3xs" }), _jsx("span", { className: "truncate text-xs font-medium", children: org.name })] }), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx("div", { ref: nav, className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2", children: groups.map((group) => (_jsx(RailGroup, { ...group }, group.label))) }), _jsx(ScrollFade, { at: "top", visible: navEdges.top, className: "h-6 from-background" }), _jsx(ScrollFade, { at: "bottom", visible: navEdges.bottom, className: "h-6 from-background" })] })] })] }), _jsxs("div", { className: "relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background", children: [_jsx("div", { ref: page, className: "h-full overflow-y-auto", children: _jsx("div", { className: "mx-auto w-full max-w-160 px-5 py-6", children: children }) }), _jsx(ScrollFade, { at: "top", visible: pageEdges.top, className: "from-background" }), _jsx(ScrollFade, { at: "bottom", visible: pageEdges.bottom, className: "from-background" })] })] }) }));
}
export { RailGroup, RailLink, SettingsShell };
//# sourceMappingURL=settings-shell.js.map
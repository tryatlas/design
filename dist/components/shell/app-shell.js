"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MoonIcon, PanelLeftIcon, SunIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip.js";
import { AppFrame } from "../layout/app-frame.js";
import { CommandMenu, useCommandMenu } from "./command-menu.js";
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarPanel, SidebarSearch, } from "./sidebar.js";
function ThemeToggle({ appearance, onToggle, }) {
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: _jsx(IconButton, { icon: appearance === "dark" ? SunIcon : MoonIcon, label: `Switch to ${appearance === "dark" ? "light" : "dark"} theme`, size: "sm", onClick: onToggle }) }), _jsxs(TooltipContent, { children: ["Switch to ", appearance === "dark" ? "light" : "dark"] })] }));
}
const renderSlot = (slot, collapsed) => typeof slot === "function" ? slot({ collapsed }) : slot;
/**
 * The frame, filled by the app: what sits in the rail is the caller's, so the
 * shell holds no data and no routes. `header` is the workspace row (an
 * `OrgSwitcher`), `nav` the rail's `SidebarGroup`s, `footer` the rail's
 * bottom tools (`ProfileMenu`, `ThemeToggle`, `UiScaleControl`, `InfoMenu`),
 * and `actions` what ⌘K offers. `header` and `footer` may be functions of the
 * rail's collapsed state.
 *
 * It is `AppFrame` filled the way the Atlas apps fill it: a collapsible rail
 * with the workspace switcher, search and the navigation; ⌘K; and below `lg`,
 * a drawer opened from a top bar. The rail's collapsed state and the dock's
 * size are the caller's too: the shell reports a change and draws what it is
 * given, so an app remembers them wherever it remembers things. ⌘. toggles
 * the rail. The drawer's open state is the one thing kept here, and nothing
 * should outlive the window it was opened in.
 */
function AppShell({ title, header, nav, footer, actions, collapsed: railCollapsed, onCollapsedChange, dockMode, onDockModeChange, children, }) {
    const { open, setOpen } = useCommandMenu();
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "." && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onCollapsedChange(!railCollapsed);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [railCollapsed, onCollapsedChange]);
    // The drawer is always the full rail.
    const collapsed = railCollapsed && !drawerOpen;
    return (_jsx(AppFrame, { dockMode: dockMode, onDockModeChange: onDockModeChange, overlay: _jsxs(_Fragment, { children: [drawerOpen && (_jsx("button", { type: "button", "aria-label": "Close navigation", onClick: () => setDrawerOpen(false), className: "fixed inset-0 z-drawer scrim-soft lg:hidden" })), _jsx(CommandMenu, { open: open, onOpenChange: setOpen, actions: actions })] }), topBar: _jsxs("div", { className: "flex h-10 shrink-0 items-center gap-1 px-2 lg:hidden", children: [_jsx(IconButton, { icon: PanelLeftIcon, label: "Open navigation", size: "sm", onClick: () => setDrawerOpen(true) }), _jsx("span", { className: "truncate text-xs font-medium", children: title })] }), sidebar: _jsxs(Sidebar, { collapsed: collapsed, className: cn("lg:mr-2", "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-drawer max-lg:border-r max-lg:border-border max-lg:bg-sidebar max-lg:p-2", "max-lg:transition-transform max-lg:duration-slow max-lg:ease-drawer", !drawerOpen && "max-lg:-translate-x-full"), children: [_jsxs(SidebarHeader, { children: [_jsx("div", { className: "min-w-0 flex-1", children: renderSlot(header, collapsed) }), !collapsed && (_jsx(IconButton, { icon: PanelLeftIcon, label: "Collapse sidebar", size: "sm", onClick: () => onCollapsedChange(true) }))] }), _jsxs(SidebarPanel, { children: [_jsx(SidebarSearch, { onOpen: () => setOpen(true) }), _jsx(SidebarBody, { onClickCapture: () => setDrawerOpen(false), children: nav }), _jsxs(SidebarFooter, { className: "justify-between", children: [renderSlot(footer, collapsed), collapsed && (_jsx(IconButton, { icon: PanelLeftIcon, label: "Expand sidebar", size: "sm", onClick: () => onCollapsedChange(false) }))] })] })] }), children: children }));
}
export { AppShell, ThemeToggle };
//# sourceMappingURL=app-shell.js.map
"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, ChevronsUpDownIcon, LogOutIcon, PlusIcon, SettingsIcon, UserPlusIcon, } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { useLinks } from "../../lib/link.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { Icon } from "../../ui/icon.js";
/**
 * The workspace switcher, top-left of the rail.
 *
 * This is the single worst thing about the current Atlas web app: to change
 * org you navigate to /dashboard, land on the Organisation tab, and use a
 * `<select>` that sets better-auth's active org — which three other screens
 * then ignore, because they read the org from the URL instead.
 *
 * The answer here:
 *
 *  - The switcher is the FIRST thing in the rail, so the answer to "which
 *    workspace am I in" is in the same place on every screen.
 *  - The parent menu carries the things you reach for while thinking about
 *    the workspace as a whole — Settings, Invite people, Log out — because
 *    that is what you are already looking at.
 *  - Switching is a SUBMENU, not the menu. It is the rarest of the four
 *    actions, and putting five workspaces inline would push Log out off the
 *    bottom the moment someone joins a sixth.
 *  - The submenu is headed by the account email. With several accounts, "which
 *    login is this list for" is the question immediately before "which
 *    workspace", so it is answered first.
 *  - Each workspace carries a numeric shortcut. The check marks the active
 *    one — the number is how you get there without the menu at all.
 */
function OrgMark({ initials, className }) {
    return (_jsx("span", { "aria-hidden": "true", className: cn("flex size-4 shrink-0 items-center justify-center rounded-sm", "bg-(--element-emphasis) text-3xs font-semibold text-foreground", className), children: initials }));
}
function OrgSwitcher({ org, orgs, email, onOrgChange, settingsHref, membersHref = settingsHref, onLogOut, className, collapsed = false, }) {
    const { Link } = useLinks();
    return (_jsxs(DropdownMenu, { children: [_jsxs(DropdownMenuTrigger, { "aria-label": collapsed ? org.name : undefined, className: cn("flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-1", "text-left select-none", "transition-colors duration-fast ease-out-strong", "hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent", collapsed && "justify-center px-0", className), children: [_jsx(OrgMark, { initials: org.initials, className: "size-6 rounded-md text-3xs" }), !collapsed && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsx("span", { className: "truncate text-xs font-medium text-foreground", children: org.name }), _jsxs("span", { className: "truncate text-3xs text-muted-foreground", children: [org.memberCount, " members"] })] }), _jsx(Icon, { icon: ChevronsUpDownIcon, size: "xs", className: "text-muted-foreground" })] }))] }), _jsxs(DropdownMenuContent, { className: "w-60", sideOffset: 4, children: [_jsxs(DropdownMenuItem, { render: _jsx(Link, { href: settingsHref }), children: [_jsx(Icon, { icon: SettingsIcon, size: "sm" }), "Settings", _jsx(DropdownMenuShortcut, { children: "G then S" })] }), _jsxs(DropdownMenuItem, { render: _jsx(Link, { href: membersHref }), children: [_jsx(Icon, { icon: UserPlusIcon, size: "sm" }), "Invite and manage members"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { children: ["Switch workspace", _jsx(DropdownMenuShortcut, { children: "O then W" })] }), _jsxs(DropdownMenuSubContent, { className: "w-64", children: [_jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { className: "tracking-normal normal-case", children: email }), orgs.map((o, i) => (_jsxs(DropdownMenuItem, { onClick: () => onOrgChange(o.id), children: [_jsx(OrgMark, { initials: o.initials }), _jsx("span", { className: "flex-1 truncate", children: o.name }), o.id === org.id && (_jsx(Icon, { icon: CheckIcon, size: "sm", className: "text-foreground" })), _jsx("span", { className: "tnum w-3 text-right text-2xs text-disabled", children: i + 1 })] }, o.id)))] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Account" }), _jsxs(DropdownMenuItem, { children: [_jsx(Icon, { icon: PlusIcon, size: "sm" }), "Create or join a workspace\u2026"] }), _jsx(DropdownMenuItem, { children: "Add an account\u2026" })] })] })] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { variant: "destructive", onClick: onLogOut, children: [_jsx(Icon, { icon: LogOutIcon, size: "sm" }), "Log out", _jsx(DropdownMenuShortcut, { children: "\u2325 \u21E7 Q" })] })] })] }));
}
export { OrgMark, OrgSwitcher };
//# sourceMappingURL=org-switcher.js.map
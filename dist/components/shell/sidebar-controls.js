"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpenIcon, CircleHelpIcon, DownloadIcon, GlobeIcon, KeyboardIcon, LogOutIcon, MessageCircleIcon, SettingsIcon, ShieldIcon, UserIcon, } from "lucide-react";
import { initialsOf } from "../../lib/initials.js";
import { useLinks } from "../../lib/link.js";
import { PersonAvatar } from "../patterns/person-avatar.js";
import { DiscordMark, GitHubMark, XMark } from "../ui/brand-marks.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { Icon } from "../../ui/icon.js";
import { IconButton } from "../../ui/icon-button.js";
/**
 * The sidebar footer's two menus.
 *
 * `ProfileMenu` is YOU — your face on the trigger, your account inside. The
 * workspace switcher at the top of the rail is US; keeping the two apart is
 * why "Account settings" lives here and not there.
 *
 * `InfoMenu` is the Atlas desktop app's (?) menu: help, the community, and
 * the way out to settings and the website. External destinations open in a
 * new tab, and a link the caller leaves out is left out of the menu.
 *
 * Both take `children`: the host's own entries (a theme submenu, an
 * interface-size submenu), as `DropdownMenuItem`s or `DropdownMenuSub`s,
 * placed with the menu's other settings.
 */
function ProfileMenu({ user, accountHref, privacyHref, onLogOut, children, }) {
    const { Link } = useLinks();
    // The name starts with the initials the avatar shows, so a voice user can
    // say what they see (WCAG 2.5.3, label in name).
    const initials = initialsOf(user.name, user.email);
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { render: _jsx("button", { type: "button", "aria-label": `${initials}, account — ${user.name}`, className: "rounded-full outline-offset-2 transition-opacity duration-fast hover:opacity-85", children: _jsx(PersonAvatar, { size: "sm", name: user.name, email: user.email, image: user.image, initials: initials }) }) }), _jsxs(DropdownMenuContent, { side: "top", align: "start", className: "w-60", children: [_jsx(DropdownMenuGroup, { children: _jsxs(DropdownMenuLabel, { className: "flex items-center gap-2 py-2 tracking-normal normal-case", children: [_jsx(PersonAvatar, { size: "md", name: user.name, email: user.email, image: user.image }), _jsxs("span", { className: "flex min-w-0 flex-col", children: [_jsx("span", { className: "truncate text-xs font-medium text-foreground", children: user.name }), _jsx("span", { className: "truncate text-2xs text-muted-foreground", children: user.email })] })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { render: _jsx(Link, { href: accountHref }), children: [_jsx(Icon, { icon: UserIcon, size: "sm" }), "Account settings"] }), privacyHref && (_jsxs(DropdownMenuItem, { render: _jsx(Link, { href: privacyHref }), children: [_jsx(Icon, { icon: ShieldIcon, size: "sm" }), "Privacy"] })), children, _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { variant: "destructive", onClick: onLogOut, children: [_jsx(Icon, { icon: LogOutIcon, size: "sm" }), "Log out"] })] })] }));
}
/** An external destination: a real anchor, opened in a new tab. */
function external(href) {
    return _jsx("a", { href: href, target: "_blank", rel: "noreferrer" });
}
function InfoMenu({ links, settingsHref, onShortcuts, onFeedback, children, }) {
    const { Link } = useLinks();
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { render: _jsx(IconButton, { icon: CircleHelpIcon, label: "Help and links", size: "sm" }) }), _jsxs(DropdownMenuContent, { side: "top", align: "end", className: "w-56", children: [links.docs && (_jsxs(DropdownMenuItem, { render: external(links.docs), children: [_jsx(Icon, { icon: BookOpenIcon, size: "sm" }), "Docs"] })), onFeedback ? (_jsxs(DropdownMenuItem, { onClick: onFeedback, children: [_jsx(Icon, { icon: MessageCircleIcon, size: "sm" }), "Send feedback\u2026"] })) : (links.feedback && (_jsxs(DropdownMenuItem, { render: external(links.feedback), children: [_jsx(Icon, { icon: MessageCircleIcon, size: "sm" }), "Send feedback"] }))), onShortcuts && (_jsxs(DropdownMenuItem, { onClick: onShortcuts, children: [_jsx(Icon, { icon: KeyboardIcon, size: "sm" }), "Keyboard shortcuts", _jsx(DropdownMenuShortcut, { children: "\u2318 /" })] })), children, _jsx(DropdownMenuSeparator, {}), links.github && (_jsxs(DropdownMenuItem, { render: external(links.github), children: [_jsx(GitHubMark, { className: "size-3.5" }), "GitHub repo"] })), links.discord && (_jsxs(DropdownMenuItem, { render: external(links.discord), children: [_jsx(DiscordMark, { className: "size-3.5" }), "Discord community"] })), links.x && (_jsxs(DropdownMenuItem, { render: external(links.x), children: [_jsx(XMark, { className: "size-3.5" }), "Follow on X"] })), _jsx(DropdownMenuSeparator, {}), links.download && (_jsxs(DropdownMenuItem, { render: external(links.download), children: [_jsx(Icon, { icon: DownloadIcon, size: "sm" }), "Download desktop"] })), settingsHref && (_jsxs(DropdownMenuItem, { render: _jsx(Link, { href: settingsHref }), children: [_jsx(Icon, { icon: SettingsIcon, size: "sm" }), "Settings"] })), links.website && (_jsxs(DropdownMenuItem, { render: external(links.website), children: [_jsx(Icon, { icon: GlobeIcon, size: "sm" }), "Our website"] }))] })] }));
}
export { InfoMenu, ProfileMenu };
//# sourceMappingURL=sidebar-controls.js.map
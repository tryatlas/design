"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashIcon, LockIcon, UsersIcon } from "lucide-react";
import { detectKeyPlatform } from "../../lib/combo.js";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { PersonAvatar } from "../patterns/person-avatar.js";
import { StatusDot } from "../ui/status-dot.js";
import { unreadBadge } from "./comms-view-helpers.js";
function DefaultIcon({ conversation }) {
    if (conversation.kind === "dm" && conversation.counterpart) {
        const person = conversation.counterpart;
        return (_jsxs("span", { className: "relative inline-flex shrink-0", children: [_jsx(PersonAvatar, { name: person.name, image: person.image ?? undefined, size: "xs" }), person.online !== undefined && (_jsx(StatusDot, { tone: person.online ? "success" : "subtle", cutout: "background", label: person.online ? "Online" : "Offline", className: "absolute -right-px -bottom-px" }))] }));
    }
    if (conversation.kind === "dm" || conversation.kind === "group") {
        return (_jsx("span", { className: "flex size-control-xs items-center justify-center rounded-full bg-card text-muted-foreground", children: _jsx(Icon, { icon: UsersIcon, size: "sm" }) }));
    }
    return (_jsx(Icon, { icon: conversation.private ? LockIcon : HashIcon, size: "sm", className: "text-disabled" }));
}
export function CommsConversationRow({ conversation, selected = false, onSelect, icon, trailing, disabled = false, className, }) {
    const badge = unreadBadge(conversation.unread, conversation.mentions);
    const unread = badge !== null;
    const muted = disabled || conversation.archived;
    return (_jsxs("button", { type: "button", "data-slot": "comms-conversation-row", "data-kind": conversation.kind, "aria-current": selected ? "true" : undefined, disabled: disabled, onClick: (event) => onSelect(conversation.id, {
            newTab: detectKeyPlatform() === "mac" ? event.metaKey : event.ctrlKey,
            event,
        }), className: cn("flex w-full min-w-0 items-center gap-2 py-[5px] pr-2.5 pl-3.5 text-left transition-colors", disabled
            ? "cursor-not-allowed"
            : selected
                ? "cursor-pointer bg-element-active"
                : "cursor-pointer hover:bg-element-hover", className), children: [_jsx("span", { className: "flex w-7 shrink-0 items-center justify-center", children: icon ?? _jsx(DefaultIcon, { conversation: conversation }) }), _jsx("span", { className: cn("min-w-0 flex-1 truncate text-sm", muted
                    ? "text-disabled"
                    : unread
                        ? "font-medium text-foreground"
                        : selected
                            ? "text-foreground"
                            : "text-secondary-foreground"), children: conversation.title }), trailing, badge && (_jsxs("span", { "data-slot": "comms-unread-badge", "data-tone": badge.tone, className: "inline-flex min-w-[18px] shrink-0 items-center justify-center rounded-full border border-border bg-card px-1.5 font-sans text-2xs leading-[16px] font-semibold tracking-wide text-foreground tabular-nums shadow-sm", children: [_jsx("span", { "aria-hidden": true, children: badge.label }), _jsx("span", { className: "sr-only", children: badge.aria })] }))] }));
}
//# sourceMappingURL=comms-conversation-row.js.map
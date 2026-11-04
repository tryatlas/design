"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CopyIcon, CornerDownRightIcon, EllipsisIcon, LinkIcon, PencilIcon, PinIcon, PinOffIcon, SmilePlusIcon, Trash2Icon, WebhookIcon, } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Badge } from "../../ui/badge.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "../../ui/dropdown-menu.js";
import { HintGroup, HintItem } from "../../ui/hint-group.js";
import { IconButton } from "../../ui/icon-button.js";
import { Icon } from "../../ui/icon.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
import { PersonAvatar } from "../patterns/person-avatar.js";
import { StatusDot } from "../ui/status-dot.js";
import { formatClock, formatDayLabel } from "./comms-view-helpers.js";
export const DEFAULT_COMMS_MESSAGE_ROW_LABELS = {
    messageDeleted: "Message deleted",
    edited: "edited",
    sending: "sending…",
    failed: "failed to send",
    retry: "Retry",
    originalDeleted: "original message deleted",
    unknownAuthor: "Unknown",
    jumpToMessage: "Jump to message",
    pinned: "Pinned",
    app: "App",
    via: (webhook) => `via ${webhook}`,
    postedBy: (webhook) => `Posted by the “${webhook}” webhook`,
    reactors: (reaction) => `${reaction.count} ${reaction.count === 1 ? "reaction" : "reactions"}`,
    react: "React",
    reply: "Reply",
    more: "More",
    copyText: "Copy text",
    copyLink: "Copy link",
    pin: "Pin for everyone",
    unpin: "Unpin for everyone",
    edit: "Edit",
    delete: "Delete",
};
/** The avatar gutter, shared by a head row and every continuation. */
const GUTTER = "w-9";
function MessageRow({ message, head, showAuthor = true, body, attachments, references, avatar, authorName, editing = false, reactionEmoji, can, onReact, onReply, onEdit, onDelete, onTogglePin, onCopyText, onCopyLink, onJumpToReply, onRetry, labels: labelOverrides, className, }) {
    const labels = labelOverrides
        ? { ...DEFAULT_COMMS_MESSAGE_ROW_LABELS, ...labelOverrides }
        : DEFAULT_COMMS_MESSAGE_ROW_LABELS;
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    // A menu moves the pointer and focus into a portal outside this row, so the
    // open flag lives here, above the toolbar that would otherwise unmount.
    const [menuOpen, setMenuOpen] = useState(false);
    const deleted = message.deleted === true;
    const author = message.author;
    const clock = formatClock(message.at);
    const onFocus = useCallback(() => setFocused(true), []);
    const onBlur = useCallback((e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
            setFocused(false);
    }, []);
    return (_jsxs("div", { "data-slot": "comms-message-row", "data-message": message.id, "data-head": head || undefined, "data-editing": editing || undefined, className: cn("group/msg relative flex gap-2 rounded px-1 py-px transition-colors hover:bg-element-hover data-flash:bg-warning-muted", head && "mt-3 first:mt-0", className), onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), onFocus: onFocus, onBlur: onBlur, children: [_jsx("div", { className: cn("shrink-0 pt-0.5", GUTTER), children: head ? ((avatar ?? _jsx(DefaultAvatar, { author: author }))) : (_jsx("span", { className: "hidden justify-end pt-0.75 pr-0.5 text-2xs leading-none text-disabled tabular-nums group-hover/msg:flex", children: clock })) }), _jsxs("div", { className: "min-w-0 flex-1 pb-1", children: [message.replyTo && (_jsx(ReplyLine, { reply: message.replyTo, labels: labels, onJump: onJumpToReply })), head && (_jsx(AuthorLine, { author: author, at: message.at, clock: clock, showAuthor: showAuthor, authorName: authorName, labels: labels })), deleted ? (_jsx("div", { className: "text-base text-disabled italic", children: labels.messageDeleted })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: cn(message.send === "sending" && "opacity-60"), children: [_jsx("div", { className: "min-w-0 text-base text-secondary-foreground", children: body }), attachments && _jsx("div", { className: "mt-1.5 flex flex-col gap-1.5", children: attachments }), references && _jsx("div", { className: "mt-1.5 flex flex-col gap-1.5", children: references }), _jsx(MetaLine, { message: message, labels: labels, onRetry: onRetry })] }), _jsx(Reactions, { reactions: message.reactions, labels: labels, onReact: can.react ? onReact : undefined })] }))] }), !deleted && (hovered || focused || menuOpen) && (_jsx(Toolbar, { pinned: message.pinned === true, reactionEmoji: reactionEmoji, can: can, labels: labels, onOpenChange: setMenuOpen, onReact: onReact, onReply: onReply, onEdit: onEdit, onDelete: onDelete, onTogglePin: onTogglePin, onCopyText: onCopyText, onCopyLink: onCopyLink }))] }));
}
/**
 * One team-chat message. Memoised by identity: callers must pass stable
 * callbacks, and keep `can`, `labels`, `reactionEmoji` and the slots stable
 * too (hoist them, or `useMemo` them), or every row re-renders.
 */
export const CommsMessageRow = memo(MessageRow);
function DefaultAvatar({ author }) {
    if (author.kind === "integration") {
        // A rounded square, not a circle, so it never reads as a person; no
        // presence dot, because an integration is not somewhere.
        return (_jsx("span", { role: "img", "aria-label": author.name, className: "flex size-control-lg items-center justify-center overflow-hidden rounded-md bg-muted text-secondary-foreground", children: author.image ? (_jsx("img", { src: author.image, alt: "", draggable: false, className: "size-full object-cover" })) : (_jsx(Icon, { icon: WebhookIcon, size: "lg" })) }));
    }
    return (_jsxs("span", { className: "relative inline-flex shrink-0", children: [_jsx(PersonAvatar, { name: author.person.name, image: author.person.image ?? undefined, size: "lg" }), author.online !== undefined && (_jsx(StatusDot, { tone: author.online ? "success" : "subtle", size: "md", cutout: "background", label: author.online ? "Online" : "Offline", className: "absolute -right-px -bottom-px" }))] }));
}
function AuthorLine({ author, at, clock, showAuthor, authorName, labels, }) {
    const time = (_jsx("time", { dateTime: new Date(at).toISOString(), title: new Date(at).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" }), className: "shrink-0 text-2xs text-disabled tabular-nums", children: clock }));
    if (author.kind === "integration") {
        // ADR-0020: always the badge, and always the webhook's real name beside
        // a borrowed one, so a webhook can never pass for a person.
        return (_jsxs("div", { className: "flex min-w-0 items-baseline gap-1.5", title: labels.postedBy(author.via ?? author.name), children: [_jsx("span", { className: "truncate text-sm font-semibold text-foreground", children: author.name }), _jsx(Badge, { variant: "outline", size: "sm", className: "self-center tracking-wider uppercase", children: labels.app }), author.via && (_jsx("span", { className: "min-w-0 truncate text-2xs text-muted-foreground", children: labels.via(author.via) })), time] }));
    }
    return (_jsxs("div", { className: "flex min-w-0 items-baseline gap-1.5", children: [showAuthor && (_jsx("span", { className: "min-w-0 truncate text-sm font-semibold text-foreground", children: authorName ?? author.person.name })), time] }));
}
/** Discord's one-line quote: who, and the first line of what. */
function ReplyLine({ reply, labels, onJump, }) {
    // A deleted parent renders as a stub, since a reply must never appear to
    // point at nothing; a merely paged-out one still jumps.
    const deleted = reply.state === "deleted";
    const live = !deleted && onJump !== undefined;
    return (_jsxs("button", { type: "button", "data-slot": "comms-reply-line", "data-state": reply.state, disabled: !live, onClick: live ? () => onJump(reply.id) : undefined, title: live ? labels.jumpToMessage : undefined, className: cn("group/reply flex w-full min-w-0 items-center gap-1 pb-0.5 text-left text-xs text-muted-foreground", live && "cursor-pointer"), children: [_jsx(Icon, { icon: CornerDownRightIcon, size: "xs", className: "shrink-0 opacity-50" }), !deleted && (_jsx("span", { className: cn("shrink-0 font-medium text-secondary-foreground", live && "group-hover/reply:underline"), children: reply.authorName ?? labels.unknownAuthor })), _jsx("span", { className: "min-w-0 truncate opacity-80", children: deleted ? (_jsx("span", { className: "italic", children: labels.originalDeleted })) : reply.state === "missing" ? ("…") : (reply.preview) })] }));
}
function MetaLine({ message, labels, onRetry, }) {
    const sending = message.send === "sending";
    const failed = message.send === "failed";
    if (!message.editedAt && !message.pinned && !sending && !failed)
        return null;
    return (_jsxs("div", { className: "mt-0.5 flex items-center gap-1.5 text-2xs text-disabled", children: [message.pinned && (_jsx("span", { role: "img", "aria-label": labels.pinned, title: labels.pinned, className: "inline-flex", children: _jsx(Icon, { icon: PinIcon, size: "xs" }) })), message.editedAt && _jsx("span", { className: "italic", children: labels.edited }), sending && _jsx("span", { children: labels.sending }), failed && _jsx("span", { className: "text-error", children: labels.failed }), failed && onRetry && (_jsx("button", { type: "button", onClick: onRetry, className: "cursor-pointer font-medium text-secondary-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline", children: labels.retry }))] }));
}
/**
 * The chips, in normal flow under the message. Without `onReact` (the person
 * may not react) the chips still show who reacted but do nothing.
 */
function Reactions({ reactions, labels, onReact, }) {
    if (reactions.length === 0)
        return null;
    return (_jsx("div", { className: "mt-1 flex flex-wrap items-center gap-1", children: reactions.map((reaction) => (_jsxs("button", { type: "button", "data-slot": "comms-reaction", "aria-pressed": reaction.mine, disabled: !onReact, title: labels.reactors(reaction), onClick: onReact && (() => onReact(reaction.emoji, !reaction.mine)), className: cn("flex h-[21px] items-center gap-1 rounded-full border px-1.5 text-xs leading-none transition-colors", onReact && "cursor-pointer", reaction.mine
                ? "border-success/60 bg-success/15 text-foreground"
                : cn("border-border bg-card text-secondary-foreground", onReact && "hover:bg-element-hover")), children: [_jsx("span", { children: reaction.emoji }), _jsx("span", { className: "tabular-nums", children: reaction.count })] }, reaction.emoji))) }));
}
function Toolbar({ pinned, reactionEmoji, can, labels, onOpenChange, onReact, onReply, onEdit, onDelete, onTogglePin, onCopyText, onCopyLink, }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const setPicker = (open) => {
        setPickerOpen(open);
        onOpenChange(open || moreOpen);
    };
    const setMore = (open) => {
        setMoreOpen(open);
        onOpenChange(open || pickerOpen);
    };
    const canReact = can.react && onReact && reactionEmoji.length > 0;
    const canReply = can.reply && onReply;
    const pin = can.pin && onTogglePin;
    const edit = can.edit && onEdit;
    const remove = can.delete && onDelete;
    const hasMenu = onCopyText || onCopyLink || pin || edit || remove;
    if (!canReact && !canReply && !hasMenu)
        return null;
    return (_jsx(HintGroup, { side: "top", children: _jsxs("div", { "data-slot": "comms-message-toolbar", className: "absolute -top-2.5 right-2 z-10 flex items-center gap-px rounded-md border border-border bg-popover p-0.5 shadow-md", children: [canReact && (_jsxs(Popover, { open: pickerOpen, onOpenChange: setPicker, children: [_jsx(HintItem, { label: labels.react, children: _jsx(PopoverTrigger, { render: _jsx(IconButton, { size: "sm", icon: SmilePlusIcon, label: labels.react }) }) }), _jsx(PopoverContent, { side: "top", align: "end", sideOffset: 6, className: "w-auto p-1.5", children: _jsx("div", { className: "grid grid-cols-7 gap-0.5", children: reactionEmoji.map((emoji) => (_jsx("button", { type: "button", onClick: () => {
                                        onReact(emoji, true);
                                        setPicker(false);
                                    }, className: "flex size-7 cursor-pointer items-center justify-center rounded text-md transition-colors hover:bg-element-hover", children: emoji }, emoji))) }) })] })), canReply && (_jsx(HintItem, { label: labels.reply, children: _jsx(IconButton, { size: "sm", icon: CornerDownRightIcon, label: labels.reply, onClick: onReply }) })), hasMenu && (_jsxs(DropdownMenu, { open: moreOpen, onOpenChange: setMore, children: [_jsx(HintItem, { label: labels.more, children: _jsx(DropdownMenuTrigger, { render: _jsx(IconButton, { size: "sm", icon: EllipsisIcon, label: labels.more }) }) }), _jsxs(DropdownMenuContent, { side: "top", align: "end", sideOffset: 6, children: [onCopyText && (_jsxs(DropdownMenuItem, { onClick: onCopyText, children: [_jsx(CopyIcon, {}), " ", labels.copyText] })), onCopyLink && (_jsxs(DropdownMenuItem, { onClick: onCopyLink, children: [_jsx(LinkIcon, {}), " ", labels.copyLink] })), pin && (_jsxs(DropdownMenuItem, { onClick: onTogglePin, children: [pinned ? _jsx(PinOffIcon, {}) : _jsx(PinIcon, {}), pinned ? labels.unpin : labels.pin] })), (onCopyText || onCopyLink || pin) && (edit || remove) && _jsx(DropdownMenuSeparator, {}), edit && (_jsxs(DropdownMenuItem, { onClick: onEdit, children: [_jsx(PencilIcon, {}), " ", labels.edit] })), remove && (_jsxs(DropdownMenuItem, { variant: "destructive", onClick: onDelete, children: [_jsx(Trash2Icon, {}), " ", labels.delete] }))] })] }))] }) }));
}
/** The centred hairline between two days of a transcript. */
export function CommsDayDivider({ at, now, className }) {
    return (_jsxs("div", { "data-slot": "comms-day-divider", role: "separator", "aria-label": formatDayLabel(at, now), className: cn("flex items-center gap-2 px-3 py-3", className), children: [_jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border-subtle" }), _jsx("span", { "aria-hidden": true, className: "text-2xs font-medium tracking-wide text-disabled uppercase", children: formatDayLabel(at, now) }), _jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border-subtle" })] }));
}
/** The line above the first message the person has not read. */
export function CommsUnreadLine({ label = "New", className }) {
    return (_jsxs("div", { "data-slot": "comms-unread-line", role: "separator", "aria-label": label, className: cn("flex items-center gap-2 px-3 py-1 text-error", className), children: [_jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-current opacity-60" }), _jsx("span", { "aria-hidden": true, className: "text-2xs font-semibold tracking-wide uppercase", children: label })] }));
}
//# sourceMappingURL=comms-message-row.js.map
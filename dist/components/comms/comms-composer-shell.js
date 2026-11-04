"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpIcon, CornerDownRightIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils.js";
import { iconButtonVariants } from "../../ui/icon-button-variants.js";
import { IconButton } from "../../ui/icon-button.js";
import { Icon } from "../../ui/icon.js";
import { Hint } from "../../ui/tooltip.js";
import { Pill } from "../ui/pill.js";
import { Spinner } from "../ui/spinner.js";
export function CommsComposerShell({ editor, attachments, toolsStart, toolsEnd, send, renderSend, formatRow, popup, dropActive = false, dropLabel = "Drop files to attach", invalid = false, replyTo, onCancelReply, editing = false, onCancelEdit, editPreview, escapeToCancel = true, canSend, sending = false, onSend, readOnly, sendLabel = "Send", className, }) {
    const [focused, setFocused] = useState(false);
    const replying = !editing && Boolean(replyTo);
    const expanded = focused || canSend || Boolean(attachments) || Boolean(formatRow) || replying || editing;
    const onKeyDown = (e) => {
        if (e.key !== "Escape" || e.defaultPrevented)
            return;
        if (editing && onCancelEdit) {
            e.preventDefault();
            onCancelEdit();
        }
        else if (replying && onCancelReply) {
            e.preventDefault();
            onCancelReply();
        }
    };
    const onBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
            setFocused(false);
    };
    return (_jsx("div", { "data-slot": "comms-composer", "data-editing": editing || undefined, className: cn("relative shrink-0 px-2 pt-1 pb-4", className), onFocus: () => setFocused(true), onBlur: onBlur, onKeyDown: readOnly || !escapeToCancel ? undefined : onKeyDown, children: _jsx("div", { className: cn("relative mx-auto min-w-[min(100%,24rem)] transition-[width] duration-slow ease-out-strong motion-reduce:transition-none", expanded && !readOnly ? "w-[89.5%]" : "w-[84%]"), children: readOnly ? (_jsx("p", { className: "flex min-h-[46px] items-center justify-center rounded-composer border border-border-subtle px-4 text-center text-sm text-muted-foreground", children: readOnly })) : (_jsxs(_Fragment, { children: [popup, (editing || replying) && (_jsxs("div", { "data-slot": "comms-composer-intent", className: "relative z-0 mx-2 -mb-4 flex animate-fade-in items-center gap-1.5 rounded-t-2xl bg-popover px-3 pt-1.5 pb-5", children: [_jsx(Icon, { icon: editing ? PencilIcon : CornerDownRightIcon, size: "xs", className: "shrink-0 text-muted-foreground" }), _jsx("span", { className: "shrink-0 text-2xs font-medium tracking-wide text-muted-foreground uppercase", children: editing ? "Editing" : "Replying to" }), _jsx("span", { className: "min-w-0 flex-1 truncate text-xs text-secondary-foreground", children: editing ? editPreview : replyTo && `${replyTo.authorName} · ${replyTo.preview}` }), _jsx(Hint, { label: editing ? "Cancel edit" : "Cancel reply", side: "top", children: _jsx(IconButton, { size: "xs", icon: XIcon, label: editing ? "Cancel edit" : "Cancel reply", onClick: editing ? onCancelEdit : onCancelReply }) })] })), _jsxs("div", { "data-drop-active": dropActive || undefined, "data-invalid": invalid || undefined, className: cn("relative z-10 glass-rim rounded-composer", 
                        // A drop outranks an over-limit edge: it is what the hand is doing now.
                        // `!`: `glass-rim` sets the whole border (transparent, painted by
                        // its gradient) and its own box-shadow, and both win over a plain
                        // `border-*` colour or `ring-*`; without it neither shows. The
                        // ring replaces the rim's inset highlight while a drop is over.
                        dropActive ? "border-primary! ring-2! ring-primary/40" : invalid && "border-error!"), children: [dropActive && (_jsx("div", { "data-slot": "comms-composer-drop", className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-composer bg-primary/8 backdrop-blur-[1px]", children: _jsx(Pill, { size: "sm", surface: "raised", children: dropLabel }) })), attachments && _jsx("div", { className: "flex flex-wrap gap-1.5 px-4 pt-3", children: attachments }), formatRow && (_jsx("div", { "data-slot": "comms-composer-format", className: "flex flex-wrap items-center gap-0.5 border-b border-border-subtle px-4 pt-1.5 pb-1", children: formatRow })), _jsxs("div", { className: "flex items-end gap-1 px-[8px]", children: [toolsStart && (_jsx("div", { className: "flex h-[44px] shrink-0 items-center gap-0.5", children: toolsStart })), _jsx("div", { className: "min-h-[44px] min-w-0 flex-1 py-[5px]", children: editor }), _jsxs("div", { className: "flex h-[44px] shrink-0 items-center gap-0.5", children: [toolsEnd, send ??
                                                (renderSend ? (renderSend({ canSend, sending, label: sendLabel, onSend })) : (_jsx(Hint, { label: sendLabel, side: "top", children: _jsx("button", { type: "button", "data-slot": "comms-send", "aria-label": sendLabel, disabled: !canSend, onClick: onSend, className: cn(iconButtonVariants({ size: "lg", shape: "round" }), "disabled:cursor-not-allowed disabled:opacity-50", canSend && "text-foreground"), children: sending ? (_jsx(Spinner, { size: "md", label: "", className: "text-current" })) : (_jsx(Icon, { icon: ArrowUpIcon, size: "lg" })) }) })))] })] })] })] })) }) }));
}
//# sourceMappingURL=comms-composer-shell.js.map
"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { cn } from "../../../lib/utils.js";
import { useTranscript } from "./context.js";
import { Column } from "./parts.js";
const CLOCK = { hour: "2-digit", minute: "2-digit" };
/** A response header's clock when the app gives none: the locale's. */
function defaultFormatTime(timestamp) {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString(undefined, CLOCK);
}
// ── Prose ──────────────────────────────────────────────────────────────────
export const ProseRowView = memo(function ProseRowView({ row, agentLabel, priority, canBranch = false, }) {
    const { Markdown, ResponseActions, formatTime = defaultFormatTime } = useTranscript();
    const messageId = row.id.slice(2);
    return (_jsxs(Column, { className: cn("py-2", !row.streaming && !row.footerBelow && "relative pb-7"), children: [row.showHeader && (_jsxs("div", { className: "flex h-[22px] items-center gap-1.5", children: [_jsx("span", { className: "min-w-0 truncate font-mono text-2xs text-[var(--muted-foreground)]", children: row.model || agentLabel }), !row.timestampApproximate && (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": true, className: "shrink-0 text-2xs text-disabled", children: "\u00B7" }), _jsx("span", { className: "shrink-0 font-mono text-2xs text-[var(--muted-foreground)]", children: formatTime(row.timestamp) })] }))] })), row.streaming ? (_jsx(Markdown, { source: row.text, streaming: true, priority: priority })) : (_jsx("div", { "data-agent-response": messageId, "data-comment-anchor": messageId, children: _jsx(Markdown, { source: row.text, priority: priority }) })), ResponseActions && !row.streaming && !row.footerBelow && (_jsx(ResponseActions, { messageId: messageId, timestamp: row.timestamp, text: row.text, canBranch: canBranch, showTimestamp: !row.showHeader && !row.timestampApproximate }))] }));
});
//# sourceMappingURL=prose-row.js.map
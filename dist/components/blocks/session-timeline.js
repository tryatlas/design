"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { EASE_PANEL } from "../../lib/motion.js";
import { cn } from "../../lib/utils.js";
import { ENTRY_ICON } from "../../lib/timeline-icons.js";
import { Icon } from "../../ui/icon.js";
import { StatusIcon } from "../ui/status-icon.js";
/**
 * A session's entries on a dashed rail with elbow connectors,
 * drawn from real timeline data.
 *
 * The rail is a dashed hairline; each entry hangs off it on a quarter-round
 * elbow (`rounded-bl-full` on a bordered box, which is the whole trick). The
 * head card carries the session's status glyph so the rail reads as one
 * story with a conclusion, not a list.
 */
function SessionTimeline({ status, entries, className, }) {
    const heading = status === "live"
        ? "Session running"
        : status === "failed"
            ? "Session failed"
            : status === "queued"
                ? "Session queued"
                : "Session complete";
    return (_jsxs("div", { "data-slot": "session-timeline", className: cn("min-w-0", className), children: [_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card p-3", children: [_jsx(StatusIcon, { status: status }), _jsx("span", { className: "text-sm font-medium text-foreground", children: heading })] }), _jsxs("div", { className: "relative space-y-3 pt-4 pl-6", children: [_jsx("div", { className: "absolute top-0 bottom-6 left-6 border-l border-dashed border-border-strong" }), entries.map((entry, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.22, ease: EASE_PANEL }, className: "relative pl-6", children: [_jsx("div", { className: "absolute top-0 bottom-1/2 left-0 w-6 rounded-bl-full border-b border-l border-dashed border-border-strong" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card p-3", children: [_jsx(Icon, { icon: ENTRY_ICON[entry.kind], size: "sm", className: cn(entry.toolStatus === "error" ? "text-error" : "text-muted-foreground") }), _jsxs("span", { className: "min-w-0 flex-1 truncate text-xs font-medium text-secondary-foreground", children: [_jsx("span", { className: cn(entry.toolStatus === "error" && "text-error"), children: entry.title }), _jsx("span", { className: "pl-1.5 text-muted-foreground tabular-nums", children: entry.at })] })] })] }, entry.id)))] })] }));
}
export { SessionTimeline };
//# sourceMappingURL=session-timeline.js.map
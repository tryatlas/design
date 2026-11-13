"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState } from "react";
import { ChevronRight, CornerDownRight, MoonStar, RotateCcw } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { Button } from "../../../ui/button.js";
import { useTranscript } from "./context.js";
import { TRANSCRIPT_COLUMN } from "./parts.js";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.js";
/** "45s", "21m", "1h", "1h 3m": a sleep is told in the unit a person would
 *  use; "21m 14s" reads as a stopwatch. */
export function formatSlept(secs) {
    const s = Math.max(0, Math.round(secs));
    if (s < 60)
        return `${s}s`;
    const m = Math.round(s / 60);
    if (m < 60)
        return `${m}m`;
    const h = Math.floor(m / 60);
    return m % 60 === 0 ? `${h}h` : `${h}h ${m % 60}m`;
}
/** The interruption row's one line: what happened, and what it means for the
 *  reply, in that order. The agent's own error is a detail, never the
 *  headline. */
export function interruptionHeadline(x) {
    const slept = `Your computer slept for ${formatSlept(x.sleptSecs)}`;
    switch (x.outcome) {
        case "finished":
            return `${slept} during this reply — it may be incomplete.`;
        case "stopped":
            return `${slept} during this reply before it was stopped.`;
        case "failed":
            return `${slept} and the reply was cut off.`;
        case "disconnected":
            return `${slept} and the agent exited before finishing.`;
    }
}
/**
 * A turn something outside the conversation cut into — today, the computer
 * sleeping mid-reply (`TurnInterruption`).
 *
 * One quiet line in the footer's register, under the turn: the reply stays the
 * loudest thing on screen, and this says only what happened to it. The moon is
 * the one coloured mark, in the warning token — it is a caution about the
 * reply, not an error the user caused. The agent's own error, when there is
 * one, is folded behind Details: it is for diagnosis, not the headline.
 *
 * No entrance animation. Rows remount as they scroll in and out, so a fade
 * here would replay every time the turn came back into view.
 *
 * Retry and Continue appear on the latest turn only, since both act on the
 * thread's last reply, and only where the app wires them (`onRetry`,
 * `onContinue`).
 */
export const InterruptionRowView = memo(function InterruptionRowView({ row, canRetry, canContinue, }) {
    const { onRetry, onContinue } = useTranscript();
    const [open, setOpen] = useState(false);
    const { interruption } = row;
    const headline = interruptionHeadline(interruption);
    const showRetry = row.latest && canRetry && onRetry !== undefined;
    const showContinue = row.latest && canContinue && onContinue !== undefined;
    return (_jsxs("div", { "data-testid": "interruption-row", className: cn(TRANSCRIPT_COLUMN, "pt-1 pb-4"), children: [_jsxs("div", { className: "flex min-h-[26px] items-center gap-2 text-base text-[var(--muted-foreground)]", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center text-warning", children: _jsx(MoonStar, { size: ICON_PX, strokeWidth: ICON_STROKE }) }), _jsx("span", { className: "min-w-0 truncate", title: headline, children: headline }), interruption.error && (_jsxs("button", { type: "button", "aria-expanded": open, onClick: () => setOpen((v) => !v), className: "ml-1 flex shrink-0 cursor-pointer items-center gap-0.5 text-xs transition-colors hover:text-[var(--secondary-foreground)]", children: ["Details", _jsx(ChevronRight, { size: ICON_PX, strokeWidth: ICON_STROKE, className: cn("shrink-0 transition-transform", open && "rotate-90") })] })), (showRetry || showContinue) && (_jsxs("span", { className: "flex shrink-0 items-center gap-1", children: [showContinue && (_jsxs(Button, { variant: "ghost", size: "xs", onClick: onContinue, children: [_jsx(CornerDownRight, { size: ICON_PX, strokeWidth: ICON_STROKE }), "Continue"] })), showRetry && (_jsxs(Button, { variant: "ghost", size: "xs", onClick: onRetry, children: [_jsx(RotateCcw, { size: ICON_PX, strokeWidth: ICON_STROKE }), "Retry"] }))] }))] }), open && interruption.error && (_jsx("p", { className: "mt-1 ml-6 font-mono text-2xs break-words whitespace-pre-wrap text-[var(--muted-foreground)]", children: interruption.error }))] }));
});
//# sourceMappingURL=interruption-row.js.map
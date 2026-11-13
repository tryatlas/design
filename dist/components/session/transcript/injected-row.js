"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState } from "react";
import { ChevronRight, GitPullRequest, RotateCcw } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { TRANSCRIPT_COLUMN } from "./parts.js";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.js";
/**
 * A prompt Atlas sent the agent on its own — a watched pull request changed,
 * and Atlas woke the agent about it, or Atlas came back from a quit, crash or
 * update and continued the turn it cut short.
 *
 * It opens a turn the way a user message does, but it is not the user's words,
 * so it is not their bubble: one quiet line in the interruption row's
 * register, saying who spoke and why. The full text the agent received folds
 * behind Details, for when the user wants to see exactly what it was told.
 *
 * No entrance animation, for the reason `InterruptionRowView` gives: rows
 * remount as they scroll back into view.
 */
export const InjectedRowView = memo(function InjectedRowView({ row }) {
    const [open, setOpen] = useState(false);
    const restart = row.injected.source === "restart";
    const headline = restart ? row.injected.summary : `Pull request watch · ${row.injected.summary}`;
    const Icon = restart ? RotateCcw : GitPullRequest;
    return (_jsxs("div", { "data-testid": "injected-row", className: cn(TRANSCRIPT_COLUMN, "pt-2 pb-3"), children: [_jsxs("div", { className: "flex min-h-[26px] items-center gap-2 text-base text-[var(--muted-foreground)]", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center text-info", children: _jsx(Icon, { size: ICON_PX, strokeWidth: ICON_STROKE }) }), _jsx("span", { className: "min-w-0 truncate", title: headline, children: headline }), _jsxs("button", { type: "button", "aria-expanded": open, onClick: () => setOpen((v) => !v), className: "ml-1 flex shrink-0 cursor-pointer items-center gap-0.5 text-xs transition-colors hover:text-[var(--secondary-foreground)]", children: ["Details", _jsx(ChevronRight, { size: ICON_PX, strokeWidth: ICON_STROKE, className: cn("shrink-0 transition-transform", open && "rotate-90") })] })] }), open && (_jsx("p", { className: "mt-1 ml-6 text-sm break-words whitespace-pre-wrap text-[var(--muted-foreground)]", children: row.text }))] }));
});
//# sourceMappingURL=injected-row.js.map
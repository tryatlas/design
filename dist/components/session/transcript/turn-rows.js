"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { ChevronRight, Files } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { useTranscript } from "./context.js";
import { Column, formatWorked, LiveElapsed } from "./parts.js";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.js";
/**
 * The head of an assistant turn: "Working for 46s" while it runs, then "Worked
 * for 7m 37s ›" with the work folded behind it. Clicking puts the earlier
 * prose, thinking and tool blocks back in the thread. Opening is instant — it
 * is a frequent, deliberate act, and the rows it reveals are ordinary rows.
 */
export const WorkHeaderRowView = memo(function WorkHeaderRowView({ row }) {
    const { onToggleGroup: onToggle } = useTranscript();
    const label = row.live ? (row.startedAt !== null ? (_jsxs(_Fragment, { children: ["Working for ", _jsx(LiveElapsed, { startedAt: row.startedAt })] })) : ("Working")) : row.workedMs !== null ? (_jsxs(_Fragment, { children: [row.stopped ? "Stopped after" : "Worked for", " ", _jsx("span", { className: "tabular-nums", children: formatWorked(row.workedMs) })] })) : row.stopped ? ("Stopped") : ("Worked");
    return (_jsx(Column, { className: "pt-2 pb-2", children: _jsx("div", { className: "flex items-center border-b border-border-subtle pb-2", children: row.foldable ? (_jsxs("button", { type: "button", "aria-expanded": row.open, onClick: () => onToggle(row.id), className: "flex h-[22px] cursor-pointer items-center gap-1 text-base text-[var(--muted-foreground)] transition-colors hover:text-[var(--secondary-foreground)]", children: [_jsx("span", { children: label }), _jsx(ChevronRight, { size: ICON_PX, strokeWidth: ICON_STROKE, className: cn("shrink-0 transition-transform", row.open && "rotate-90") })] })) : (_jsx("div", { className: "flex h-[22px] items-center text-base text-[var(--muted-foreground)]", children: _jsx("span", { children: label }) })) }) }));
});
// ── Separator ──────────────────────────────────────────────────────────────
export const SeparatorRowView = memo(function SeparatorRowView({ row }) {
    return (_jsx(Column, { className: "flex h-[34px] items-center", children: _jsxs("div", { className: "flex w-full select-none items-center gap-2", children: [_jsx("span", { className: "h-px flex-1 bg-border-subtle" }), _jsx("span", { className: "shrink-0 text-2xs text-[var(--muted-foreground)]", children: row.label }), _jsx("span", { className: "h-px flex-1 bg-border-subtle" })] }) }));
});
// ── Turn footer ────────────────────────────────────────────────────────────
/**
 * The end of a turn: its changed-files card (or the quiet "N files read"
 * line), then the hover footer of the turn's last response. The footer is the
 * response's (`ResponseActions`: copy, branch, pin, time), drawn here so it
 * comes after the card, at the end of the whole response, rather than between
 * the text and the card. It reveals on hovering this row or the response row
 * just above it (`[data-footer-below]` in `transcript.css`).
 */
export const TurnFooterRowView = memo(function TurnFooterRowView({ row, canBranch = false, }) {
    const { ChangedFiles, ResponseActions } = useTranscript();
    // A turn that changed files ends on its changed-files card. One that only
    // read keeps a single quiet line: there is no diff to open, and a card for
    // a list of reads would be the loudest thing under the turn.
    const edited = row.files.some((f) => f.kind === "edit");
    const responseRowId = ResponseActions ? row.responseRowId : undefined;
    return (_jsxs(Column, { className: cn("pt-1", responseRowId ? "relative pb-16" : "pb-4"), children: [edited ? (ChangedFiles && _jsx(ChangedFiles, { row: row })) : (_jsxs("div", { className: "atlas-marker w-full text-base text-[var(--muted-foreground)]", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center", children: _jsx(Files, { size: ICON_PX, strokeWidth: ICON_STROKE }) }), _jsxs("span", { className: "min-w-0 truncate", children: [row.files.length, " file", row.files.length === 1 ? "" : "s", " read"] })] })), responseRowId && ResponseActions && (_jsx(ResponseActions, { messageId: responseRowId.slice(2), timestamp: row.responseTimestamp ?? "", text: row.responseText ?? "", canBranch: canBranch, showTimestamp: row.responseShowTimestamp ?? true, className: "bottom-4" }))] }));
});
//# sourceMappingURL=turn-rows.js.map
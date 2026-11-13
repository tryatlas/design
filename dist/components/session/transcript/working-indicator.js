"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../../lib/utils.js";
import { LoadingState, WAITING_LABEL } from "./loading-state.js";
import { TRANSCRIPT_COLUMN } from "./parts.js";
/**
 * Shown while a turn is live but has produced nothing to render yet: the ACP
 * round-trip, the model's first tokens, the beat before the first tool call.
 * Without it the transcript sits completely unchanged after send, which reads
 * as the message having been dropped.
 *
 * A pixel-grid wavefront, a shimmering label and an elapsed timer rather than a
 * spinner — see `loading-state.tsx` and the shimmer's note in `transcript.css`.
 * The timer matters here specifically: this is the one moment in a turn with no
 * other evidence that anything is happening, and "42.4s" answers the question
 * the reader is actually asking. It occupies a fixed-height row so its arrival
 * and departure don't jolt the thread it sits under.
 */
export function WorkingIndicator({ label = WAITING_LABEL, onStallRestart, onStallSwitch, onStallCopyDiagnostics, }) {
    const stall = onStallRestart || onStallSwitch ? (_jsx(StallNotice, { onRestart: onStallRestart, onSwitch: onStallSwitch, onCopyDiagnostics: onStallCopyDiagnostics })) : undefined;
    return (_jsx("div", { className: cn(TRANSCRIPT_COLUMN, "pt-2 pb-3"), children: _jsx(LoadingState, { label: label, stalledContent: stall }) }));
}
/**
 * The persistent way out of a start that has stalled. Replaces a one-shot
 * toast that said the same thing and then vanished, leaving the user with a
 * "Starting Codex" that never changed. A first run legitimately takes minutes
 * (Node download + `npm install`), so the copy says so; the two actions are
 * the only ones that actually help — killing the wedged connect, or leaving
 * the agent behind.
 */
function StallNotice({ onRestart, onSwitch, onCopyDiagnostics, }) {
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-[17px] text-xs leading-[16px] text-[var(--muted-foreground)]", children: [_jsx("span", { className: "select-text", children: "Still starting\u2026 this can take a few minutes on first run." }), onRestart && (_jsx("button", { type: "button", onClick: onRestart, className: "cursor-pointer font-medium text-[var(--secondary-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline", children: "Restart agent" })), onSwitch && (_jsx("button", { type: "button", onClick: onSwitch, className: "cursor-pointer font-medium text-[var(--secondary-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline", children: "Switch agent" })), onCopyDiagnostics && (_jsx("button", { type: "button", onClick: onCopyDiagnostics, className: "cursor-pointer font-medium text-[var(--secondary-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline", children: "Copy diagnostics" }))] }));
}
//# sourceMappingURL=working-indicator.js.map
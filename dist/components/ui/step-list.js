"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { Icon } from "../../ui/icon.js";
import { StatusIcon } from "./status-icon.js";
const GLYPH = {
    pending: "queued",
    running: "live",
    done: "done",
    failed: "failed",
};
function announce(steps, error, doneMessage, startingMessage) {
    const failed = steps.find((s) => s.status === "failed");
    if (failed)
        return `${failed.label} failed.${error ? ` ${error}` : ""}`;
    const running = steps.find((s) => s.status === "running");
    if (running)
        return `${running.label}…`;
    if (steps.length > 0 && steps.every((s) => s.status === "done"))
        return doneMessage;
    if (steps.length > 0 && steps.every((s) => s.status === "pending"))
        return startingMessage ?? "";
    return "";
}
function StepList({ steps, error, onRetry, retryLabel = "Retry", doneMessage = "Done.", startingMessage = "Starting…", className, ...props }) {
    const failed = steps.some((s) => s.status === "failed");
    // A live region announces changes, not what it held when it appeared. A
    // list that appears with nothing run yet mounts empty and takes "Starting…"
    // on the next commit, so the start is heard; one that appears mid-run or
    // finished holds its sentence from the first paint, unannounced, as before.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const starting = steps.length > 0 && steps.every((s) => s.status === "pending");
    return (_jsxs("div", { "data-slot": "step-list", className: cn("flex flex-col", className), ...props, children: [_jsx("p", { role: "status", className: "sr-only", children: starting && !mounted ? "" : announce(steps, error, doneMessage, startingMessage) }), _jsx("ol", { className: "flex flex-col gap-0.5", children: steps.map((step) => (_jsxs("li", { "data-slot": "step", "data-status": step.status, className: cn("flex h-control-xs items-center gap-2 text-xs transition-colors duration-fast ease-out-strong", step.status === "pending" ? "text-muted-foreground" : "text-foreground", step.status === "failed" && "text-error"), children: [_jsx(StatusIcon, { status: GLYPH[step.status], className: "size-3.5 shrink-0" }), _jsx("span", { className: "shrink-0 font-medium", children: step.label }), step.detail && (_jsx("span", { className: "min-w-0 truncate font-mono text-2xs text-muted-foreground", children: step.detail }))] }, step.id))) }), failed && (error || onRetry) && (_jsxs("div", { "data-slot": "step-list-failure", className: "mt-2 flex flex-col items-start gap-2", children: [error && (_jsx("p", { className: "text-xs whitespace-pre-wrap break-words text-error select-text", children: error })), onRetry && (_jsxs(Button, { size: "sm", variant: "outline", onClick: onRetry, children: [_jsx(Icon, { icon: RotateCcw, size: "sm" }), retryLabel] }))] }))] }));
}
export { StepList };
//# sourceMappingURL=step-list.js.map
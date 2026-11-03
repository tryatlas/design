"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2Icon, CircleDashedIcon, PlayIcon, XCircleIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Tag } from "../ui/tag.js";
/**
 * A session as a pipeline of steps, drawn from real session data.
 *
 * Three visual states, and they are read by silhouette before colour: done
 * is a filled check with the title struck through and dimmed; the running
 * step is the one highlighted row with a slow dashed spinner; everything
 * after it sits at 40%. Only the running row gets the ring, so the eye
 * lands there first.
 */
function SessionPipeline({ session, entries, className, }) {
    const steps = entries.filter((e) => e.kind === "tool_call");
    const runningIndex = steps.findIndex((s) => s.toolStatus === "running");
    const done = steps.filter((s) => s.toolStatus === "ok").length;
    return (_jsxs("div", { "data-slot": "session-pipeline", className: cn("rounded-xl border border-border bg-card p-4", className), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-sm font-medium text-foreground", children: session.ref }), _jsx(Tag, { hue: session.status === "live" ? "green" : "grey", dot: true, className: "ml-auto", children: session.status === "live" ? `${session.agent} running` : session.agent })] }), _jsxs("div", { className: "mt-3 rounded-md border border-border-subtle bg-background p-2.5", children: [_jsx("div", { className: "eyebrow", children: "Target" }), _jsxs("div", { className: "mt-1 text-xs text-foreground", children: [session.project, " \u00B7 ", _jsx("span", { className: "font-mono", children: session.branch }), " \u00B7 ", session.title] })] }), _jsx("div", { className: "mt-4 space-y-2", children: steps.map((step, i) => {
                    const running = step.toolStatus === "running";
                    const failed = step.toolStatus === "error";
                    const ok = step.toolStatus === "ok";
                    const pending = runningIndex !== -1 && i > runningIndex;
                    return (_jsxs("div", { className: cn("flex items-start gap-2", running && "-mx-2 rounded-md border border-border-strong bg-element-selected p-2", pending && "opacity-40"), children: [_jsxs("div", { className: "relative mt-0.5 shrink-0", children: [ok && _jsx(Icon, { icon: CheckCircle2Icon, size: "md", className: "text-foreground" }), failed && _jsx(Icon, { icon: XCircleIcon, size: "md", className: "text-error" }), running && (_jsxs(_Fragment, { children: [_jsx(Icon, { icon: CircleDashedIcon, size: "md", className: "animate-spin text-foreground [animation-duration:3s]" }), _jsx(PlayIcon, { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current text-foreground" })] })), !ok && !failed && !running && (_jsx(Icon, { icon: CircleDashedIcon, size: "md", className: "text-muted-foreground" }))] }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: cn("truncate text-xs font-medium", ok && "line-through opacity-50", running && "text-foreground", failed && "text-error"), children: step.title }), step.detail && _jsx("div", { className: "truncate caption", children: step.detail })] })] }, step.id));
                }) }), _jsxs("div", { className: "mt-3 flex items-center justify-between text-2xs text-muted-foreground tabular-nums", children: [_jsxs("span", { children: [done, "/", steps.length, " tool calls"] }), _jsxs("span", { children: [session.durationMinutes, " min"] })] })] }));
}
export { SessionPipeline };
//# sourceMappingURL=session-pipeline.js.map
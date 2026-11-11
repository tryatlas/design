"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2Icon, CircleDashedIcon, PlayIcon, XCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Tag } from "../ui/tag.js";
/** The state in words, for a screen reader: the silhouettes are shapes only. */
const STATE_LABEL = {
    done: "Done",
    failed: "Failed",
    running: "Running",
    upcoming: "Upcoming",
};
function stepsOf(session) {
    if (session.plan && session.plan.length > 0) {
        return session.plan.map((item, i) => ({
            key: `plan:${i}`,
            title: item.content,
            state: item.status === "completed"
                ? "done"
                : item.status === "in_progress"
                    ? "running"
                    : "upcoming",
        }));
    }
    return session.turns.flatMap((turn) => turn.items.flatMap((item) => item.kind === "tool"
        ? [
            {
                key: item.call.id,
                title: item.call.title ?? item.call.name,
                detail: item.call.title ? undefined : item.call.paths?.[0],
                state: (item.call.status === "completed"
                    ? "done"
                    : item.call.status === "failed"
                        ? "failed"
                        : item.call.status === "running"
                            ? "running"
                            : "upcoming"),
            },
        ]
        : []));
}
export function SessionPipeline({ session, className }) {
    const steps = useMemo(() => stepsOf(session), [session]);
    const done = steps.filter((s) => s.state === "done" || s.state === "failed").length;
    const live = session.phase === "running" || session.phase === "waiting";
    const { meta } = session;
    const heading = meta.ref ?? meta.title;
    return (_jsxs("div", { "data-slot": "session-pipeline", className: cn("rounded-lg border border-border bg-card p-4", className), children: [_jsxs("div", { className: "flex items-center gap-2", children: [heading && _jsx("div", { className: "truncate text-sm font-medium text-foreground", children: heading }), meta.agent && (_jsx(Tag, { hue: live ? "green" : "grey", dot: true, className: "ml-auto shrink-0", children: live ? `${meta.agent} running` : meta.agent }))] }), meta.ref && meta.title && (_jsx("div", { className: "mt-1 truncate text-xs text-secondary-foreground", children: meta.title })), steps.length === 0 ? (_jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "No steps yet" })) : (_jsx("div", { className: "mt-4 space-y-2", children: steps.map((step) => (_jsxs("div", { "data-state": step.state, className: cn("flex items-start gap-2", step.state === "running" &&
                        "-mx-2 rounded-md border border-border-strong bg-element-selected p-2"), children: [_jsxs("div", { className: "relative mt-0.5 shrink-0", children: [step.state === "done" && (_jsx(Icon, { icon: CheckCircle2Icon, size: "md", className: "text-foreground" })), step.state === "failed" && (_jsx(Icon, { icon: XCircleIcon, size: "md", className: "text-error" })), step.state === "running" && (_jsxs(_Fragment, { children: [_jsx(Icon, { icon: CircleDashedIcon, size: "md", "data-slot": "session-pipeline-running", className: "animate-spin text-foreground [animation-duration:3s]" }), _jsx(PlayIcon, { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current text-foreground" })] })), step.state === "upcoming" && (_jsx(Icon, { icon: CircleDashedIcon, size: "md", className: "text-muted-foreground" }))] }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: cn("truncate text-xs font-medium", step.state === "done" && "text-muted-foreground line-through", step.state === "running" && "text-foreground", step.state === "failed" && "text-error", 
                                    // Done and upcoming dim by the text ladder, not opacity,
                                    // which can take text under 4.5:1.
                                    step.state === "upcoming" && "text-muted-foreground"), children: [_jsxs("span", { className: "sr-only", children: [STATE_LABEL[step.state], ": "] }), step.title] }), step.detail && _jsx("div", { className: "truncate caption", children: step.detail })] })] }, step.key))) })), steps.length > 0 && (_jsxs("div", { className: "mt-3 text-2xs text-muted-foreground tabular-nums", children: [done, "/", steps.length, " steps"] }))] }));
}
//# sourceMappingURL=session-pipeline.js.map
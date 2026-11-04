import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThinkingOrb } from "thinking-orbs";
import { cn } from "../../lib/utils.js";
const TONE = {
    queued: "text-muted-foreground",
    live: "text-foreground",
    done: "text-muted-foreground",
    failed: "text-error",
};
const LABEL = {
    queued: "Queued",
    live: "Running",
    done: "Done",
    failed: "Failed",
};
function StatusIcon({ status, className }) {
    if (status === "live") {
        return (_jsx("span", { "data-slot": "status-icon", "data-status": status, role: "img", "aria-label": LABEL[status], className: cn("inline-block size-3.5 shrink-0", className), children: _jsx(ThinkingOrb, { state: "composing", size: 20, 
                // Drawn at the 20px preset and scaled down to 14, so the dots
                // are thickened to keep the same weight as the solid dots.
                dotSize: 1.4, "aria-hidden": "true", style: { width: "100%", height: "100%" } }) }));
    }
    return (_jsx("svg", { "data-slot": "status-icon", "data-status": status, viewBox: "0 0 14 14", width: "14", height: "14", fill: "none", role: "img", "aria-label": LABEL[status], className: cn("size-3.5 shrink-0", TONE[status], className), children: status === "queued" ? (_jsx("circle", { cx: "7", cy: "7", r: "3.75", stroke: "currentColor", strokeWidth: "1.5" })) : (_jsx("circle", { cx: "7", cy: "7", r: "4.25", fill: "currentColor" })) }));
}
const FILLED = {
    none: 0,
    low: 1,
    medium: 2,
    high: 3,
    urgent: 3,
};
function PriorityIcon({ priority, className, ...props }) {
    const filled = FILLED[priority];
    return (_jsx("svg", { "data-slot": "priority-icon", "data-priority": priority, viewBox: "0 0 14 14", width: "14", height: "14", role: "img", "aria-label": `Priority: ${priority}`, className: cn("shrink-0", 
        // Urgent is the one priority that earns colour — it is an exception,
        // and an exception that is always on stops being one.
        priority === "urgent" ? "text-error" : "text-muted-foreground", className), ...props, children: priority === "urgent" ? (_jsxs(_Fragment, { children: [_jsx("rect", { x: "1.5", y: "1.5", width: "11", height: "11", rx: "2.5", fill: "currentColor" }), _jsx("path", { d: "M7 4.2 V 7.9", stroke: "var(--background)", strokeWidth: "1.6", strokeLinecap: "round" }), _jsx("circle", { cx: "7", cy: "10", r: "0.9", fill: "var(--background)" })] })) : ([0, 1, 2].map((i) => (_jsx("rect", { x: 2 + i * 4, y: 9 - i * 2.5, width: "2.6", height: 3 + i * 2.5, rx: "0.8", fill: "currentColor", opacity: i < filled ? 1 : 0.28 }, i)))) }));
}
export { PriorityIcon, StatusIcon };
//# sourceMappingURL=status-icon.js.map
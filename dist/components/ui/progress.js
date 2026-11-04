"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "../../lib/utils.js";
const TONE_CLASS = {
    default: undefined,
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
};
function Progress({ className, children, value, tone = "default", ...props }) {
    return (_jsxs(ProgressPrimitive.Root, { value: value, "data-slot": "progress", className: cn("flex flex-wrap gap-3", className), ...props, children: [children, _jsx(ProgressTrack, { children: _jsx(ProgressIndicator, { tone: tone }) })] }));
}
function ProgressTrack({ className, ...props }) {
    return (_jsx(ProgressPrimitive.Track, { className: cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted", className), "data-slot": "progress-track", ...props }));
}
function ProgressIndicator({ className, tone = "default", ...props }) {
    return (_jsx(ProgressPrimitive.Indicator, { "data-slot": "progress-indicator", "data-tone": tone === "default" ? undefined : tone, className: cn("h-full bg-primary transition-[width] duration-base ease-out-strong", TONE_CLASS[tone], className), ...props }));
}
function ProgressLabel({ className, ...props }) {
    return (_jsx(ProgressPrimitive.Label, { className: cn("text-xs font-medium", className), "data-slot": "progress-label", ...props }));
}
function ProgressValue({ className, ...props }) {
    return (_jsx(ProgressPrimitive.Value, { className: cn("ml-auto text-xs text-muted-foreground tabular-nums", className), "data-slot": "progress-value", ...props }));
}
export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
//# sourceMappingURL=progress.js.map
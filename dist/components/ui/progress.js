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
    return (_jsx(ProgressPrimitive.Track, { className: cn("relative flex h-1 w-full items-center overflow-hidden rounded-md bg-muted", className), "data-slot": "progress-track", ...props }));
}
/**
 * The fill moves by `translateX`, not `width`: a full-width bar slid left by
 * what is still to do, on a track that clips it. A width change re-lays out
 * the bar every frame of the ease, and a purge's bar retargets on every
 * poll. Base UI writes the value as an inline `width`; this reads it back
 * and writes a transform instead. Indeterminate (no value) is the bar at
 * full width, as before. Reduced motion jumps to the new value.
 */
function ProgressIndicator({ className, tone = "default", ...props }) {
    return (_jsx(ProgressPrimitive.Indicator, { "data-slot": "progress-indicator", "data-tone": tone === "default" ? undefined : tone, className: cn("h-full w-full bg-primary transition-transform duration-base ease-out-strong motion-reduce:transition-none", TONE_CLASS[tone], className), render: (renderProps) => {
            const { width, ...style } = renderProps.style ?? {};
            const percent = typeof width === "string" ? Number.parseFloat(width) : Number.NaN;
            return (_jsx("div", { ...renderProps, style: Number.isFinite(percent)
                    ? { ...style, transform: `translateX(${percent - 100}%)` }
                    : renderProps.style }));
        }, ...props }));
}
function ProgressLabel({ className, ...props }) {
    return (_jsx(ProgressPrimitive.Label, { className: cn("text-xs font-medium", className), "data-slot": "progress-label", ...props }));
}
function ProgressValue({ className, ...props }) {
    return (_jsx(ProgressPrimitive.Value, { className: cn("ml-auto text-xs text-muted-foreground tabular-nums", className), "data-slot": "progress-value", ...props }));
}
export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
//# sourceMappingURL=progress.js.map
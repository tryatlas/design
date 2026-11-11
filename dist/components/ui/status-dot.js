import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
const TONE = {
    neutral: "text-muted-foreground",
    subtle: "text-border-strong",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
    primary: "text-primary",
    foreground: "text-foreground",
};
const SIZE = {
    xs: "size-1",
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
};
const CUTOUT = {
    background: "ring-2 ring-background",
    card: "ring-2 ring-card",
    popover: "ring-2 ring-popover",
    sidebar: "ring-2 ring-sidebar",
    panel: "ring-2 ring-panel",
};
function StatusDot({ className, tone = "neutral", size = "sm", hollow = false, cutout, label, ...props }) {
    const name = label ?? props["aria-label"];
    return (_jsx("span", { "data-slot": "status-dot", "data-tone": tone, "data-size": size, ...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true }), className: cn("inline-block shrink-0 rounded-full", SIZE[size], TONE[tone], hollow ? "border border-current" : "bg-current", cutout && CUTOUT[cutout], className), ...props }));
}
export { StatusDot };
//# sourceMappingURL=status-dot.js.map
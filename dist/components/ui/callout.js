import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
/**
 * An inline notice: the strip Cursor puts above a settings page ("You have
 * limited free Bugbot reviews. Upgrade for unlimited.").
 *
 * This is the one place a tinted fill is correct, because the whole block IS
 * the status. Everywhere else, status colour belongs on a badge or a dot, not
 * on a surface.
 *
 * A callout that a user can dismiss and never see again should not be a
 * callout — that is a toast.
 */
const calloutVariants = cva("flex text-xs", {
    variants: {
        /**
         * `tucked` is the strip tucked into the top of a composer, for a notice
         * that explains the composer's state (agent removed, a branch change, a
         * mode not restored), so it reads as part of the composer rather than as
         * a stray banner above it. Inset `mx-2` so the composer reads as the
         * wider element, `rounded-t-2xl` to match the composer's rounding, and
         * `-mb-3.5` against `pb-5` so the composer overlaps its lower half. `z-0`
         * keeps it behind a composer that is `relative` on a higher layer.
         *
         * Its fill is always the popover surface: the tone colours only the
         * glyph, the message is muted and truncates to one line, and actions are
         * quiet (`Button variant="ghost" size="xs"`).
         */
        variant: {
            default: "items-start gap-2 rounded-md border px-3 py-2",
            tucked: "relative z-0 mx-2 -mb-3.5 items-center gap-1.5 rounded-t-2xl bg-popover px-3.5 pt-1.5 pb-5",
        },
        tone: {
            neutral: "",
            info: "",
            success: "",
            warning: "",
            error: "",
        },
    },
    compoundVariants: [
        {
            variant: "default",
            tone: "neutral",
            className: "border-border bg-card text-secondary-foreground",
        },
        { variant: "default", tone: "info", className: "border-transparent bg-info-muted text-info" },
        {
            variant: "default",
            tone: "success",
            className: "border-transparent bg-success-muted text-success",
        },
        {
            variant: "default",
            tone: "warning",
            className: "border-transparent bg-warning-muted text-warning",
        },
        {
            variant: "default",
            tone: "error",
            className: "border-transparent bg-error-muted text-error",
        },
    ],
    defaultVariants: { variant: "default", tone: "neutral" },
});
/** On the tucked strip the tone lives on the glyph alone. */
const TUCKED_GLYPH_TONE = {
    neutral: "text-muted-foreground",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
};
const TONE_ICON = {
    neutral: InfoIcon,
    info: InfoIcon,
    success: CheckCircle2Icon,
    warning: AlertTriangleIcon,
    error: XCircleIcon,
};
function Callout({ className, variant = "default", tone = "neutral", icon, children, action, animate = false, ...props }) {
    const Glyph = icon === false ? null : (icon ?? TONE_ICON[tone ?? "neutral"]);
    const tucked = variant === "tucked";
    return (_jsxs("div", { "data-slot": "callout", role: "status", className: cn(calloutVariants({ variant, tone }), animate && "motion-safe:animate-pill-in motion-reduce:animate-fade-in", className), ...props, children: [Glyph && (_jsx(Icon, { icon: Glyph, size: "sm", className: tucked ? cn("shrink-0", TUCKED_GLYPH_TONE[tone ?? "neutral"]) : "mt-px" })), tucked ? (_jsx("div", { className: "min-w-0 flex-1 truncate text-muted-foreground", children: children })) : (_jsx("div", { className: "flex-1 text-pretty", children: children })), tucked && action ? (_jsx("div", { "data-slot": "callout-action", className: "ml-1.5 flex shrink-0 items-center gap-0.5", children: action })) : (action)] }));
}
export { Callout, calloutVariants };
//# sourceMappingURL=callout.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Hint } from "../../ui/tooltip.js";
/**
 * The atom every settings surface is built from.
 *
 * A bordered card containing divided rows. Each row is a label with an
 * optional description on the left, and exactly one control hard-right: a
 * switch, a select, a button, a badge, or a chevron.
 *
 * Why it is a component and not a div with two children: the alignment is the
 * whole point. Every row in a card shares one baseline for its label and one
 * right edge for its control, and the moment a screen hand-rolls one row the
 * column breaks. Six screens in this app show settings; they all use this.
 *
 * Rows are `min-h`, not `h` — a two-line description grows the row rather
 * than clipping.
 */
function SettingCard({ className, ...props }) {
    return (_jsx("div", { "data-slot": "setting-card", className: cn("divide-y divide-border-subtle overflow-hidden surface-card", className), ...props }));
}
/**
 * One setting: desktop's row. The title at `text-sm`, the description at
 * `text-xs` under it, the control hard-right, 2rem between them.
 */
function SettingRow({ className, label, description, control, icon, disabled = false, disabledReason, children, ...props }) {
    // `inert`, not `pointer-events-none`: a disabled row's switch must not take
    // focus or a Space from the keyboard either.
    const inertControl = control && disabled && (_jsx("span", { inert: true, className: "inline-flex disabled-look", children: control }));
    return (_jsxs("div", { "data-slot": "setting-row", "data-disabled": disabled || undefined, className: cn(
        // Wraps rather than squeezes: once the label column would drop under
        // 12rem (`basis-48`), the control moves under the label instead of
        // crushing it to a word a line. At settings widths it never does.
        "flex min-h-9 flex-wrap items-center gap-x-8 gap-y-2.5 px-4 py-3", className), ...props, children: [icon && (_jsx(Icon, { icon: icon, size: "sm", className: cn("text-muted-foreground", disabled && "opacity-50") })), _jsxs("div", { className: cn("flex min-w-0 flex-1 basis-48 flex-col gap-0.5", disabled && "opacity-50"), children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: label }), description && (_jsx("span", { className: "max-w-xl text-xs text-muted-foreground", children: description }))] }), control && (_jsx("div", { className: "shrink-0", children: inertControl && disabledReason ? (_jsx(Hint, { label: disabledReason, children: _jsx("span", { role: "group", tabIndex: 0, className: "inline-flex rounded", children: inertControl }) })) : (inertControl || control) })), children] }));
}
/**
 * A row that navigates rather than sets. The whole row is the target, so the
 * chevron is decoration — it must not be the only thing that is clickable.
 */
function DrillInRow({ className, label, description, icon, value, ...props }) {
    return (_jsxs("button", { type: "button", "data-slot": "drill-in-row", className: cn("flex min-h-9 w-full items-center gap-3 px-3 py-2 text-left", "transition-colors duration-fast ease-out-strong hover:bg-element-hover", 
        // The same disabled look as `Button`: dimmed, and no hover to promise
        // a click that will not land.
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent", className), ...props, children: [icon && _jsx(Icon, { icon: icon, size: "sm", className: "text-muted-foreground" }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [_jsx("span", { className: "label", children: label }), description && _jsx("span", { className: "caption", children: description })] }), value && _jsx("span", { className: "shrink-0 caption", children: value }), _jsx(Icon, { icon: ChevronRightIcon, size: "sm", className: "shrink-0 text-muted-foreground" })] }));
}
export { DrillInRow, SettingCard, SettingRow };
//# sourceMappingURL=setting-card.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
/**
 * What a pane says when it has nothing to show.
 *
 * Deliberately quiet: a large illustration in an empty inbox is a reward for
 * having no work, which is the wrong emphasis in a tool people live in. One
 * dim glyph, one sentence, and — only when there is a real next step — one
 * action.
 *
 * The copy rule: say what would be here, not that there is nothing here.
 * "No sessions in the last 7 days" beats "Nothing found".
 */
function EmptyState({ className, icon, title, description, action, ...props }) {
    return (_jsxs("div", { "data-slot": "empty-state", className: cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className), ...props, children: [icon && (_jsx("div", { className: "flex size-control-lg items-center justify-center rounded-md border border-border text-muted-foreground", children: _jsx(Icon, { icon: icon, size: "md" }) })), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: title }), description && (_jsx("p", { className: "max-w-[34ch] text-xs text-balance text-muted-foreground", children: description }))] }), action && _jsx("div", { className: "mt-1", children: action })] }));
}
export { EmptyState };
//# sourceMappingURL=empty-state.js.map
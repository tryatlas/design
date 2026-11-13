import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
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
 *
 * `size="page"` is a whole page with nothing on it yet: more room above and
 * below, and the title a step up, so it holds the page rather than floating
 * in the top of it. A pane or a card keeps the default.
 */
function EmptyState({ className, icon, title, description, action, size = "default", ...props }) {
    return (_jsxs("div", { "data-slot": "empty-state", "data-size": size === "page" ? size : undefined, className: cn("flex flex-col items-center justify-center gap-2 px-6 text-center", size === "page" ? "py-20" : "py-12", className), ...props, children: [icon && (_jsx("div", { className: "flex size-control-lg items-center justify-center rounded-md border border-border text-muted-foreground", children: isValidElement(icon) ? icon : _jsx(Icon, { icon: icon, size: "md" }) })), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: cn("font-medium text-foreground", size === "page" ? "text-md" : "text-sm"), children: title }), description && (_jsx("p", { className: "max-w-[34ch] text-xs text-balance text-muted-foreground", children: description }))] }), action && _jsx("div", { className: "mt-1", children: action })] }));
}
export { EmptyState };
//# sourceMappingURL=empty-state.js.map
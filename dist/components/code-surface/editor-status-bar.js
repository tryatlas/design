"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
const ITEM = "flex h-full shrink-0 items-center rounded-sm px-1.5 transition-colors duration-fast ease-out-strong";
function Item({ children, onClick }) {
    if (!onClick)
        return _jsx("span", { className: ITEM, children: children });
    return (_jsx("button", { type: "button", onClick: onClick, className: cn(ITEM, "cursor-pointer hover:bg-element-hover hover:text-foreground"), children: children }));
}
/**
 * The line under an editor: the cursor's position, then the file's indent,
 * encoding, line endings and language. An item left undefined is left out.
 * Deliberately not a live region: the position changes with every keystroke,
 * and announcing it would talk over the typing.
 */
export function EditorStatusBar({ line, column, selected, language, encoding = "UTF-8", eol, indent, start, onPositionClick, onLanguageClick, className, }) {
    return (_jsxs("footer", { "data-slot": "editor-status-bar", className: cn("flex h-control-sm shrink-0 items-center gap-1 overflow-hidden border-t border-border bg-background px-3 py-0.5 text-2xs text-muted-foreground tabular-nums", className), children: [start != null && _jsx("div", { className: "flex min-w-0 items-center gap-1", children: start }), _jsxs("div", { className: "ml-auto flex h-full min-w-0 items-center gap-0.5", children: [_jsxs(Item, { onClick: onPositionClick, children: ["Ln ", line, ", Col ", column, selected ? ` (${selected} selected)` : ""] }), indent && _jsx(Item, { children: indent }), encoding && _jsx(Item, { children: encoding }), eol && _jsx(Item, { children: eol }), language && _jsx(Item, { onClick: onLanguageClick, children: language })] })] }));
}
//# sourceMappingURL=editor-status-bar.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { SYNTAX_TEXT_CLASS } from "./code-surface.js";
/** Comments and keywords are italic in desktop's highlight style. */
const ITALIC_ROLES = new Set(["comment", "keyword"]);
const CHANGE_BAR = {
    added: "bg-diff-added-text",
    // There is no "changed" diff key; desktop's gutter uses a status colour.
    modified: "bg-info",
    // A deletion has no line of its own: a wedge on top of the line after it.
    "deleted-above": "border-t-2 border-diff-removed-text",
};
function tokenClassName(token) {
    return cn(token.role && SYNTAX_TEXT_CLASS[token.role], token.role && ITALIC_ROLES.has(token.role) && "italic", token.selected && "bg-editor-selection-background", token.match === "match" && "bg-search-match-background", token.match === "active" && "bg-search-match-active-background", token.bracket &&
        "bg-editor-match-bracket-background outline outline-editor-match-bracket-border");
}
/**
 * A static, highlighted excerpt drawn exactly as desktop's CodeMirror theme
 * (`build-cm-theme.ts`) draws a file: the change-bar gutter, line numbers,
 * the fold gutter, the active line, selection, find matches, the matching
 * bracket and the caret. It is the reference look the editor's theme is held
 * to, and a way to show code with the editor's colours where no editor runs.
 *
 * It takes tokens, not source: the package highlights nothing.
 */
export function EditorPreview({ lines, startLine = 1, activeLine, className }) {
    return (_jsxs("pre", { "data-slot": "editor-preview", 
        // It scrolls, so the keyboard has to be able to reach it.
        tabIndex: 0, className: cn("flex overflow-auto bg-editor-background font-mono text-base leading-[20px] text-editor-foreground", className), children: [_jsx("span", { "aria-hidden": true, className: "sticky left-0 flex shrink-0 flex-col bg-editor-gutter-background py-1 text-editor-gutter-foreground select-none", children: lines.map((line, i) => {
                    const number = startLine + i;
                    return (_jsxs("span", { className: "flex", children: [_jsx("span", { className: cn("w-[3px]", line.change && CHANGE_BAR[line.change]) }), _jsx("span", { className: cn("min-w-8 pr-1 pl-2 text-right tabular-nums", number === activeLine && "text-editor-active-line-gutter-foreground"), children: number }), _jsx("span", { className: "flex w-4 items-center justify-center text-secondary-foreground", children: line.fold && (_jsx(Icon, { icon: line.fold === "open" ? ChevronDownIcon : ChevronRightIcon, size: "xs" })) })] }, number));
                }) }), _jsx("code", { className: "block min-w-0 flex-1 py-1", children: lines.map((line, i) => (_jsxs("span", { className: cn("block px-1 whitespace-pre", startLine + i === activeLine && "bg-editor-active-line-background"), children: [line.tokens.length === 0 ? "​" : null, line.tokens.map((token, j) => (_jsxs("span", { className: tokenClassName(token), children: [token.text, token.caret && (_jsx("span", { "aria-hidden": true, className: "-mr-[2px] inline-block h-[1.2em] w-[2px] bg-editor-caret align-text-bottom" }))] }, j))), line.fold === "closed" && (_jsx("span", { className: "mx-1 rounded-sm border border-border bg-secondary px-1 text-secondary-foreground", children: "\u2026" }))] }, startLine + i))) })] }));
}
//# sourceMappingURL=editor-preview.js.map
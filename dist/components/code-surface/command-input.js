"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronRightIcon, FolderIcon, GitBranchIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Spinner } from "../ui/spinner.js";
import { CommandSuggestions, commandSuggestionId, } from "./command-suggestions.js";
function placeholderFor(busy, rawMode) {
    if (rawMode)
        return "Interactive prompt — keys go straight to it…";
    if (busy)
        return "Type a response, then press Enter…";
    return "Run a command…";
}
/**
 * The terminal's command line, under its blocks (desktop's block-terminal
 * footer and `command-input.tsx`): a prompt glyph, or a spinner while a
 * command runs, the field, and the row's status and stop control. The field
 * is controlled; every key is the app's to handle.
 *
 * The row is a container, so the status gives way to the field in a narrow
 * pane rather than a narrow window.
 */
export function TerminalCommandInput({ value, onValueChange, onKeyDown, onPaste, onBlur, busy, rawMode, placeholder, stopControl, status, textareaRef, suggestions, className, }) {
    const [anchor, setAnchor] = React.useState(null);
    const setRefs = React.useCallback((el) => {
        setAnchor(el);
        if (typeof textareaRef === "function")
            textareaRef(el);
        else if (textareaRef)
            textareaRef.current = el;
    }, [textareaRef]);
    const expanded = !!suggestions && suggestions.open && suggestions.items.length > 0;
    return (_jsxs("div", { "data-slot": "command-input", className: cn("@container relative flex min-h-[29px] items-center gap-2 border-t border-border bg-background px-3 py-[5px]", className), children: [busy ? (_jsx(Spinner, { size: "sm", label: "", className: "text-primary" })) : (_jsx(Icon, { icon: ChevronRightIcon, size: "sm", className: "text-primary" })), _jsx("textarea", { ref: setRefs, rows: 1, value: value, onChange: (e) => onValueChange(e.target.value), onKeyDown: onKeyDown, onPaste: onPaste, onBlur: onBlur, spellCheck: false, autoCapitalize: "off", autoCorrect: "off", "aria-label": "Command", placeholder: placeholder ?? placeholderFor(busy, rawMode), ...(suggestions
                    ? {
                        "aria-autocomplete": "list",
                        "aria-controls": expanded ? suggestions.id : undefined,
                        "aria-activedescendant": expanded && suggestions.activeIndex >= 0
                            ? commandSuggestionId(suggestions.id, suggestions.activeIndex)
                            : undefined,
                    }
                    : {}), 
                // `min-w-0` lets the field shrink in a narrow pane; the placeholder
                // clips instead of wrapping onto a second line.
                className: "min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent p-0 font-mono text-base text-foreground outline-none placeholder:whitespace-nowrap placeholder:text-muted-foreground" }), status, status != null && stopControl != null && (_jsx("span", { "aria-hidden": true, className: "hidden h-3 w-px shrink-0 bg-border @[300px]:block" })), stopControl, suggestions && _jsx(CommandSuggestions, { ...suggestions, anchor: anchor })] }));
}
/**
 * Where the terminal is: the folder, and the branch with its distance from
 * upstream. Hidden in a pane under 300px wide, the branch under 420px.
 */
export function TerminalStatus({ cwd, branch, ahead, behind, dirty }) {
    const folder = cwd.split("/").filter(Boolean).pop() ?? cwd;
    return (_jsxs("div", { "data-slot": "terminal-status", className: "hidden min-w-0 shrink items-center gap-2 text-2xs text-muted-foreground tabular-nums @[300px]:flex", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-1", title: cwd, children: [_jsx(Icon, { icon: FolderIcon, size: "xs" }), _jsx("span", { className: "truncate", children: folder })] }), branch !== undefined && (_jsxs("span", { className: "hidden min-w-0 items-center gap-1 @[420px]:flex", children: [_jsx(Icon, { icon: GitBranchIcon, size: "xs" }), _jsx("span", { className: "truncate", children: branch === "" ? "(detached)" : branch }), !!ahead && _jsxs("span", { title: `${ahead} ahead of upstream`, children: ["\u2191", ahead] }), !!behind && _jsxs("span", { title: `${behind} behind upstream`, children: ["\u2193", behind] }), dirty && (_jsx("span", { role: "img", "aria-label": "Uncommitted changes", title: "Uncommitted changes", className: "size-1.5 shrink-0 rounded-full bg-warning" }))] }))] }));
}
//# sourceMappingURL=command-input.js.map
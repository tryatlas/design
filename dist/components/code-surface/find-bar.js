"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, CaseSensitiveIcon, ChevronRightIcon, RegexIcon, ReplaceAllIcon, ReplaceIcon, SearchIcon, TextSelectIcon, WholeWordIcon, XIcon, } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../../ui/icon-button.js";
import { Icon } from "../../ui/icon.js";
import { Hint } from "../../ui/tooltip.js";
const INPUT = "h-full w-44 min-w-0 shrink bg-transparent px-1.5 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground";
function Action(props) {
    return (_jsx(Hint, { label: props.label, children: _jsx(IconButton, { size: "sm", icon: props.icon, label: props.label, onClick: props.onClick, disabled: props.disabled ?? false, ...(props.pressed === undefined ? {} : { "aria-pressed": props.pressed }) }) }));
}
function countLabel(query, matchCount, matchIndex) {
    if (!query || matchCount === undefined)
        return "";
    if (matchCount === 0)
        return "No results";
    if (matchIndex != null)
        return `${matchIndex + 1} of ${matchCount}`;
    return `${matchCount} ${matchCount === 1 ? "result" : "results"}`;
}
/**
 * Find (and replace) over a file or a terminal's output: desktop's
 * `FileFindBar` in its looks, with the editor's options and replace added.
 * It is controlled and searches nothing itself; the app runs the search and
 * passes the count back.
 *
 * Keys: Enter is the next match and Shift+Enter the previous; Alt+Enter
 * selects every match (with `onSelectAll`); in the replace field Enter
 * replaces and ⌘⌥Enter (Ctrl+Alt+Enter) replaces all; Escape anywhere closes.
 *
 * It opens from a key, so it does not animate in.
 */
export function FindBar({ query, onQueryChange, matchIndex, matchCount, invalid, caseSensitive = false, wholeWord = false, regexp = false, onToggle, replace = "", onReplaceChange, replaceOpen = false, onReplaceOpenChange, onReplace, onReplaceAll, onNext, onPrevious, onClose, onSelectAll, placeholder = "Find", autoFocus, inputRef, className, }) {
    const replaceId = React.useId();
    const canReplace = onReplaceChange !== undefined;
    const none = matchCount === 0;
    const canStep = !none;
    const canSelectAll = query !== "" && !none;
    const label = countLabel(query, matchCount, matchIndex);
    return (_jsxs("div", { role: "search", "aria-label": canReplace ? "Find and replace" : "Find", "data-slot": "find-bar", "data-invalid": invalid || undefined, onKeyDown: (e) => {
            if (e.key !== "Escape")
                return;
            e.preventDefault();
            e.stopPropagation();
            onClose();
        }, className: cn("flex max-w-full min-w-0 flex-col gap-0.5 rounded-md border border-border bg-popover py-1 pr-1 pl-1 shadow-md", invalid && "border-error", className), children: [_jsxs("div", { className: "flex h-control-sm min-w-0 items-center gap-0.5", children: [canReplace ? (_jsx(Hint, { label: replaceOpen ? "Hide replace" : "Show replace", children: _jsx(IconButton, { size: "xs", icon: ChevronRightIcon, label: replaceOpen ? "Hide replace" : "Show replace", "aria-expanded": replaceOpen, "aria-controls": replaceOpen ? replaceId : undefined, onClick: () => onReplaceOpenChange?.(!replaceOpen), className: cn("[&_svg]:transition-transform [&_svg]:duration-fast", replaceOpen && "[&_svg]:rotate-90") }) })) : (_jsx(Icon, { icon: SearchIcon, size: "sm", className: "ml-1 shrink-0 text-muted-foreground" })), _jsx("input", { ref: inputRef, value: query, onChange: (e) => onQueryChange(e.target.value), onKeyDown: (e) => {
                            if (e.key !== "Enter")
                                return;
                            e.preventDefault();
                            if (e.altKey && !e.metaKey && !e.ctrlKey) {
                                if (onSelectAll && canSelectAll)
                                    onSelectAll();
                                return;
                            }
                            if (!canStep)
                                return;
                            if (e.shiftKey)
                                onPrevious();
                            else
                                onNext();
                        }, placeholder: placeholder, "aria-label": placeholder, "aria-invalid": invalid || undefined, spellCheck: false, autoFocus: autoFocus, className: cn(INPUT, invalid && "text-error") }), _jsx("span", { "aria-live": "polite", className: "min-w-16 shrink-0 px-1 text-right text-xs text-muted-foreground tabular-nums", children: label }), onToggle && (_jsxs(_Fragment, { children: [_jsx(Action, { label: "Match case", icon: CaseSensitiveIcon, pressed: caseSensitive, onClick: () => onToggle("caseSensitive", !caseSensitive) }), _jsx(Action, { label: "Match whole word", icon: WholeWordIcon, pressed: wholeWord, onClick: () => onToggle("wholeWord", !wholeWord) }), _jsx(Action, { label: "Use regular expression", icon: RegexIcon, pressed: regexp, onClick: () => onToggle("regexp", !regexp) })] })), _jsx(Action, { label: "Previous match", icon: ArrowUpIcon, onClick: onPrevious, disabled: !canStep }), _jsx(Action, { label: "Next match", icon: ArrowDownIcon, onClick: onNext, disabled: !canStep }), onSelectAll && (_jsx(Action, { label: "Select all matches", icon: TextSelectIcon, onClick: onSelectAll, disabled: !canSelectAll })), _jsx(Action, { label: "Close", icon: XIcon, onClick: onClose })] }), canReplace && replaceOpen && (_jsxs("div", { id: replaceId, className: "flex h-control-sm min-w-0 items-center gap-0.5", children: [_jsx("span", { "aria-hidden": true, className: "size-control-xs shrink-0" }), _jsx("input", { value: replace, onChange: (e) => onReplaceChange(e.target.value), onKeyDown: (e) => {
                            if (e.key !== "Enter")
                                return;
                            e.preventDefault();
                            if (e.altKey && (e.metaKey || e.ctrlKey))
                                onReplaceAll?.();
                            else
                                onReplace?.();
                        }, placeholder: "Replace", "aria-label": "Replace", spellCheck: false, className: INPUT }), _jsx("span", { className: "min-w-16 shrink-0" }), _jsx(Action, { label: "Replace", icon: ReplaceIcon, onClick: () => onReplace?.(), disabled: none }), _jsx(Action, { label: "Replace all", icon: ReplaceAllIcon, onClick: () => onReplaceAll?.(), disabled: none })] }))] }));
}
//# sourceMappingURL=find-bar.js.map
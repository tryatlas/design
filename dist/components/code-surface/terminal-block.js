"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { CheckIcon, ChevronDownIcon, CircleCheckIcon, CircleXIcon, CopyIcon, FolderIcon, RotateCwIcon, } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { HintGroup, HintItem } from "../../ui/hint-group.js";
import { IconButton } from "../../ui/icon-button.js";
import { Icon } from "../../ui/icon.js";
import { Spinner } from "../ui/spinner.js";
import { formatDuration, highlightRanges, segmentClassName, } from "./code-surface.js";
const COPIED_MS = 1200;
/**
 * Text with every match of `query` in a `<mark data-term-match>`. A find bar
 * stepping through matches walks `[data-term-match]` in the DOM and sets
 * `data-active` on the current one, which takes the active match colour.
 */
function Highlighted({ text, query }) {
    const ranges = query ? highlightRanges(text, query) : [];
    if (ranges.length === 0)
        return text;
    const out = [];
    let at = 0;
    for (const [start, end] of ranges) {
        if (start > at)
            out.push(text.slice(at, start));
        out.push(_jsx("mark", { "data-term-match": true, className: "rounded-sm bg-search-match-background text-inherit data-active:bg-search-match-active-background", children: text.slice(start, end) }, start));
        at = end;
    }
    if (at < text.length)
        out.push(text.slice(at));
    return out;
}
/**
 * One command and its output: desktop's block terminal card
 * (`block-terminal.tsx`'s `BlockCard`), with nothing of the PTY in it, so a
 * web session page can show a tool call's terminal output the same way.
 *
 * A finished block skips layout and paint while off screen
 * (`content-visibility: auto`); a running one never does, since its height
 * changes on every flush and the placeholder size would fight the scroll pin.
 */
export function TerminalBlock({ command = "", running, exitCode, durationMs, cwd, badges, notice, footer, onCopy, onRerun, collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, commandHighlight, children, className, }) {
    const outputId = React.useId();
    const [ownCollapsed, setOwnCollapsed] = React.useState(defaultCollapsed);
    const collapsed = collapsedProp ?? ownCollapsed;
    const setCollapsed = (next) => {
        if (collapsedProp === undefined)
            setOwnCollapsed(next);
        onCollapsedChange?.(next);
    };
    const [copies, setCopies] = React.useState(0);
    const [copied, setCopied] = React.useState(false);
    const copyTimer = React.useRef(undefined);
    React.useEffect(() => () => clearTimeout(copyTimer.current), []);
    const failed = !running && exitCode != null && exitCode !== 0;
    const hasHeader = command !== "";
    // The shell's preamble before its first prompt: nothing to show yet.
    if (!hasHeader && children == null && footer == null)
        return null;
    const cwdName = cwd ? cwd.split("/").filter(Boolean).pop() : undefined;
    const copy = () => {
        onCopy?.();
        setCopied(true);
        setCopies((n) => n + 1);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
    };
    return (_jsxs("div", { "data-slot": "terminal-block", "data-state": running ? "running" : failed ? "failed" : "succeeded", className: cn("group overflow-hidden rounded-md border border-border bg-card", className), style: running ? undefined : { contentVisibility: "auto", containIntrinsicSize: "auto 200px" }, children: [hasHeader && (_jsxs("div", { className: "flex h-control-md items-center gap-2 border-b border-border-subtle px-2.5 text-sm", children: [running ? (_jsx(Spinner, { size: "sm", label: "", className: "text-primary" })) : failed ? (_jsx(Icon, { icon: CircleXIcon, size: "sm", className: "shrink-0 text-error", role: "img", "aria-label": "Failed" })) : (_jsx(Icon, { icon: CircleCheckIcon, size: "sm", className: "shrink-0 text-success", role: "img", "aria-label": "Succeeded" })), _jsx("button", { type: "button", "aria-expanded": !collapsed, "aria-controls": outputId, title: command, onClick: () => setCollapsed(!collapsed), className: "min-w-0 cursor-pointer truncate rounded-sm text-left font-mono text-foreground transition-opacity duration-fast hover:opacity-80", children: _jsx(Highlighted, { text: command, query: commandHighlight }) }), badges, _jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-2 text-2xs text-muted-foreground", children: [_jsx(HintGroup, { children: _jsxs("div", { className: "flex items-center gap-0.5 opacity-0 transition-opacity duration-fast group-focus-within:opacity-100 group-hover:opacity-100", children: [onCopy && (_jsx(HintItem, { label: copied ? "Copied" : "Copy output", reshowKey: copies, children: _jsx(IconButton, { size: "xs", icon: copied ? CheckIcon : CopyIcon, label: copied ? "Copied" : "Copy output", onClick: copy }) })), onRerun && (_jsx(HintItem, { label: "Rerun", children: _jsx(IconButton, { size: "xs", icon: RotateCwIcon, label: "Rerun", onClick: onRerun }) })), _jsx(HintItem, { label: collapsed ? "Expand" : "Collapse", children: _jsx(IconButton, { size: "xs", icon: ChevronDownIcon, label: collapsed ? "Expand" : "Collapse", onClick: () => setCollapsed(!collapsed), className: cn("[&_svg]:transition-transform [&_svg]:duration-fast", collapsed && "[&_svg]:-rotate-90") }) })] }) }), cwdName && (_jsxs("span", { className: "flex items-center gap-1", title: cwd, children: [_jsx(Icon, { icon: FolderIcon, size: "xs" }), cwdName] })), !running && durationMs != null && (_jsx("span", { className: "tabular-nums", children: formatDuration(durationMs) })), failed && _jsxs("span", { className: "text-error", children: ["exit ", exitCode] })] })] })), _jsxs("div", { id: outputId, hidden: collapsed && hasHeader, children: [notice != null && (_jsx("div", { className: "px-3 pt-2 text-2xs text-muted-foreground italic", children: notice })), children] }), footer] }));
}
const LINK_TITLE = {
    url: "⌘-click to open in browser",
    path: "⌘-click to open",
};
function isLink(segment) {
    return segment.kind === "url" || segment.kind === "path";
}
/**
 * One output line. Memoised on the line object, so a line emulator that keeps
 * committed lines' identity across flushes re-renders only its hot rows.
 */
export const TerminalOutputLine = React.memo(function TerminalOutputLine({ line, highlight, prepareSegments, onLinkActivate, }) {
    const segments = React.useMemo(() => prepareSegments?.(line.segments) ?? line.segments, [line.segments, prepareSegments]);
    // An empty line still needs its height.
    if (segments.every((s) => s.text === ""))
        return _jsx("div", { children: "​" });
    return (_jsx("div", { children: segments.map((segment, i) => {
            const link = onLinkActivate && isLink(segment) ? segment : null;
            const className = segmentClassName(link ? segment : { ...segment, kind: "text" });
            return (_jsx("span", { style: segment.style, className: className, title: link ? LINK_TITLE[link.kind] : undefined, 
                // A link is a real control for the keyboard as well: Tab reaches
                // it and Enter opens it. The pointer still needs ⌘/Ctrl, so a
                // plain click keeps selecting output text.
                role: link ? "link" : undefined, tabIndex: link ? 0 : undefined, onClick: link
                    ? (e) => {
                        if (e.metaKey || e.ctrlKey)
                            onLinkActivate(link.target ?? link.text, link.kind);
                    }
                    : undefined, onKeyDown: link
                    ? (e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onLinkActivate(link.target ?? link.text, link.kind);
                        }
                    }
                    : undefined, children: _jsx(Highlighted, { text: segment.text, query: highlight }) }, i));
        }) }));
});
const NO_LINES = [];
/**
 * A command's output, as desktop's block terminal draws it: monospaced,
 * wrapping, selectable, one element per line.
 *
 * Line identity drives the memo: give each line a stable `id`, keep a
 * committed line's object unchanged, and keep `prepareSegments` and
 * `onLinkActivate` referentially stable, or every line re-renders on every
 * update. A segment's `style` passes through untouched, so `var(--…)` colours
 * follow the theme.
 */
export function TerminalOutput({ lines, text, highlight, prepareSegments, onLinkActivate, className, }) {
    const fromText = React.useMemo(() => lines || text === undefined
        ? NO_LINES
        : text.split("\n").map((line) => ({ segments: [{ text: line }] })), [lines, text]);
    const shown = lines ?? fromText;
    return (_jsx("div", { "data-slot": "terminal-output", className: cn("px-3 py-2 font-mono text-sm leading-[1.4] break-words whitespace-pre-wrap text-secondary-foreground select-text", className), children: shown.map((line, i) => (_jsx(TerminalOutputLine, { line: line, highlight: highlight, prepareSegments: prepareSegments, onLinkActivate: onLinkActivate }, line.id ?? i))) }));
}
//# sourceMappingURL=terminal-block.js.map
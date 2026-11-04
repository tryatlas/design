"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRightLeftIcon, BookOpenIcon, BrainIcon, CheckIcon, ChevronRightIcon, CopyIcon, CircleXIcon, FileCode2Icon, GlobeIcon, PencilIcon, SearchIcon, SquareTerminalIcon, Trash2Icon, WrenchIcon, } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Button } from "../../ui/button.js";
import { IconButton } from "../../ui/icon-button.js";
import { Icon } from "../../ui/icon.js";
import { DiffStat } from "../ui/code-block.js";
import { Spinner } from "../ui/spinner.js";
import { formatBytes, formatDuration, stripAnsi } from "./session-view-helpers.js";
/**
 * One tool call: a one-line header you click, and what was recorded behind it.
 *
 * Desktop's session call row. The line is a sentence (glyph, the call's title,
 * its target) with the figures in a right-hand gutter (`+n −m`, the duration),
 * so a column of calls scans as text on the left and numbers on the right.
 * Opened, it shows the paths, the input and the output (or the terminal run),
 * then each diff. It never fetches: a truncated payload offers
 * `onLoadPayload`, and the app fills it in.
 *
 * Rows have no border of their own: a run of calls sits in one bordered box,
 * divided by hairlines (`TurnRow` draws it), as desktop's call table does.
 *
 * Huge payloads stay cheap. At most 400 lines of each render, the head for
 * input and diffs and the tail for terminal output (the end is where a command
 * says what happened), and "Show more" adds 2,000 at a time.
 */
/** One glyph per kind, desktop's tool vocabulary. Shapes only; the one tint is red on failure. */
export const TOOL_KIND_ICON = {
    read: BookOpenIcon,
    edit: PencilIcon,
    delete: Trash2Icon,
    move: ArrowRightLeftIcon,
    search: SearchIcon,
    execute: SquareTerminalIcon,
    think: BrainIcon,
    fetch: GlobeIcon,
    other: WrenchIcon,
};
/** Kinds whose target is a file, drawn as a dotted link-like run. */
const FILE_KINDS = new Set(["read", "edit", "delete", "move"]);
const LINES_INITIAL = 400;
const LINES_STEP = 2000;
/** How long Copy shows that it copied. */
const COPIED_MS = 1200;
export const DEFAULT_TOOL_CALL_CARD_LABELS = {
    copy: "Copy",
    copied: "Copied",
    showMore: (n) => `Show ${n.toLocaleString("en-US")} more lines`,
    loadFull: (part, size) => `Load full ${part}${size ? ` (${size})` : ""}`,
    loadFailed: (part) => `Couldn't load the full ${part}, retry`,
    truncated: (part) => `${part === "input" ? "Input" : "Output"} truncated`,
    binary: (part, size) => `Binary ${part}${size ? `, ${size}` : ""}`,
    empty: "Nothing else was recorded for this call.",
};
/** `loadFailed` is optional in `ToolCallCardLabels`, so a full labels object from before it still type-checks. */
const DEFAULT_LOAD_FAILED = DEFAULT_TOOL_CALL_CARD_LABELS.loadFailed;
export function ToolCallCard({ call, defaultOpen = false, open: openProp, onOpenChange, onCopy, labels: labelOverrides, onLoadPayload, renderDiff, commentSlot, className, }) {
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    const toggle = () => {
        if (openProp === undefined)
            setOpenState(!open);
        onOpenChange?.(!open);
    };
    const labels = labelOverrides
        ? { ...DEFAULT_TOOL_CALL_CARD_LABELS, ...labelOverrides }
        : DEFAULT_TOOL_CALL_CARD_LABELS;
    const bodyId = useId();
    const failed = call.status === "failed";
    const running = call.status === "running";
    const pending = call.status === "pending";
    const target = call.title ? undefined : call.paths?.[0];
    const added = call.diffs?.reduce((n, d) => n + (d.insertions ?? 0), 0) ?? 0;
    const removed = call.diffs?.reduce((n, d) => n + (d.deletions ?? 0), 0) ?? 0;
    const empty = !call.input && !call.output && !call.terminal && !call.diffs?.length;
    return (_jsxs("div", { "data-slot": "tool-call-card", "data-status": call.status, "data-tool-call-id": call.id, className: cn("min-w-0", className), children: [_jsxs("div", { className: "group/row flex h-8 items-center gap-2 bg-card px-3 transition-colors hover:bg-element-hover", children: [_jsxs("button", { type: "button", "aria-expanded": open, "aria-controls": open ? bodyId : undefined, onClick: toggle, title: target ? `${call.title ?? call.name} ${target}` : (call.title ?? call.name), className: "group/marker flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center text-muted-foreground", children: running ? (_jsx(Spinner, { size: "sm", label: "Running" })) : failed ? (_jsx(Icon, { icon: CircleXIcon, size: "md", className: "text-error", "aria-label": "Failed" })) : (_jsx(Icon, { icon: TOOL_KIND_ICON[call.kind], size: "md" })) }), _jsxs("span", { className: cn("min-w-0 truncate text-sm", failed ? "text-error" : pending ? "text-disabled" : "text-secondary-foreground"), children: [call.title ?? call.name, target && (_jsxs(_Fragment, { children: [" ", _jsx("span", { className: cn("text-disabled", FILE_KINDS.has(call.kind) &&
                                                    "underline decoration-dotted underline-offset-3 group-hover/marker:text-secondary-foreground"), children: target })] }))] }), _jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-2 font-mono text-xs text-disabled tabular-nums", children: [(added > 0 || removed > 0) && _jsx(DiffStat, { added: added, removed: removed }), failed && _jsx("span", { className: "text-error", children: "failed" }), call.durationMs !== undefined && _jsx("span", { children: formatDuration(call.durationMs) })] }), _jsx(Icon, { icon: ChevronRightIcon, size: "sm", className: cn("shrink-0 text-border-strong transition-transform duration-fast", open && "rotate-90") })] }), commentSlot?.({ kind: "tool_call", id: call.id })] }), open && (_jsxs("div", { id: bodyId, className: "space-y-2.5 border-t border-border-subtle bg-background px-3 py-3", children: [call.paths && call.paths.length > 0 && (_jsx("ul", { className: "space-y-0.5 font-mono text-xs text-muted-foreground", children: call.paths.map((path) => (_jsx("li", { className: "truncate", children: path }, path))) })), call.input && (_jsx(PayloadBlock, { part: "input", payload: call.input, from: "head", labels: labels, onCopy: onCopy, onLoad: onLoadPayload && (() => onLoadPayload("input")) })), call.terminal ? (_jsx(TerminalBlock, { terminal: call.terminal, labels: labels, onCopy: onCopy })) : (call.output && (_jsx(PayloadBlock, { part: "output", payload: call.output, from: "head", labels: labels, onCopy: onCopy, onLoad: onLoadPayload && (() => onLoadPayload("output")) }))), call.diffs?.map((diff, i) => (_jsx("div", { children: renderDiff ? renderDiff(diff) : _jsx(DefaultDiff, { diff: diff, labels: labels }) }, `${i}:${diff.path}`))), empty && _jsx("p", { className: "font-mono text-xs text-disabled", children: labels.empty })] }))] }));
}
/** The bordered mono box every payload sits in, with its header. */
function Frame({ label, icon = FileCode2Icon, aside, terminal, children, }) {
    return (_jsxs("div", { className: cn("overflow-hidden rounded-lg border border-border-subtle", terminal ? "bg-(--terminal-background) text-(--terminal-foreground)" : "bg-card"), children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-border-subtle px-3 py-1.5", children: [_jsx(Icon, { icon: icon, size: "sm", className: "shrink-0 opacity-70" }), _jsx("span", { className: cn("min-w-0 flex-1 truncate font-mono text-xs", !terminal && "text-secondary-foreground"), children: label }), aside] }), children] }));
}
/**
 * At most `LINES_INITIAL` lines, the head or the tail, and a button for the
 * next 2,000. The text is split once per payload.
 */
function Lines({ lines, from, tone, dim, showMore = DEFAULT_TOOL_CALL_CARD_LABELS.showMore, }) {
    const [shown, setShown] = useState(LINES_INITIAL);
    const hidden = Math.max(0, lines.length - shown);
    const visible = hidden === 0
        ? lines
        : from === "head"
            ? lines.slice(0, shown)
            : lines.slice(lines.length - shown);
    const more = hidden > 0 && (_jsx(Button, { variant: "ghost", size: "sm", className: "w-full rounded-none font-mono", onClick: () => setShown((n) => n + LINES_STEP), children: showMore(Math.min(LINES_STEP, hidden)) }));
    return (_jsxs("div", { "data-slot": "payload-lines", children: [from === "tail" && more, _jsx("div", { tabIndex: 0, className: "max-h-105 overflow-auto py-1", children: visible.map((line, i) => {
                    const t = tone?.(line);
                    return (_jsxs("div", { "data-slot": "payload-line", className: cn("relative min-w-max px-3 font-mono text-sm leading-relaxed whitespace-pre", !dim && "text-secondary-foreground", t === "added" && "bg-(--diff-added-background) text-(--diff-added-text)", t === "removed" && "bg-(--diff-removed-background) text-(--diff-removed-text)", t === "hunk" && "text-muted-foreground"), children: [(t === "added" || t === "removed") && (_jsx("span", { "aria-hidden": true, className: cn("absolute inset-y-0 left-0 w-0.5", t === "added" ? "bg-(--diff-added-text)" : "bg-(--diff-removed-text)") })), line || " "] }, i));
                }) }), from === "head" && more] }));
}
function splitLines(text) {
    const lines = text.split("\n");
    // A trailing newline is the end of the last line, not an empty one.
    if (lines.length > 1 && lines[lines.length - 1] === "")
        lines.pop();
    return lines;
}
/**
 * Copy for one payload: the whole text, not the window on screen. The check
 * shows only once the app says the text is on the clipboard; a refusal, a
 * throw or a rejection leaves the button as it was.
 */
function CopyPayloadButton({ part, text, onCopy, labels, }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = async () => {
        let ok = false;
        try {
            ok = (await onCopy(part, text)) === true;
        }
        catch {
            ok = false;
        }
        if (!ok)
            return;
        clearTimeout(timer.current);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    };
    return (_jsx(IconButton, { size: "xs", icon: copied ? CheckIcon : CopyIcon, label: copied ? labels.copied : labels.copy, onClick: () => void copy(), className: "shrink-0" }));
}
function PayloadBlock({ part, payload, from, labels, onCopy, onLoad, }) {
    // Output that came from a command carries its escapes even outside a terminal block.
    const text = useMemo(() => (payload.text ? stripAnsi(payload.text) : null), [payload.text]);
    const lines = useMemo(() => (text ? splitLines(text) : []), [text]);
    const size = payload.bytes !== undefined ? formatBytes(payload.bytes) : undefined;
    const loading = payload.load === "loading";
    if (payload.binary) {
        return _jsx("p", { className: "font-mono text-xs text-muted-foreground", children: labels.binary(part, size) });
    }
    return (_jsxs(Frame, { label: part === "input" ? "Input" : "Output", aside: 
        // A truncated payload holds only its head; Copy offers the whole text or nothing.
        onCopy &&
            text !== null &&
            !payload.truncated && (_jsx(CopyPayloadButton, { part: part, text: text, onCopy: onCopy, labels: labels })), children: [lines.length > 0 && _jsx(Lines, { lines: lines, from: from, showMore: labels.showMore }), payload.truncated &&
                (onLoad ? (_jsxs(Button, { variant: "ghost", size: "sm", "data-load": payload.load, 
                    // Disabled while the app fetches, but still focusable (`aria-disabled`),
                    // so keyboard focus stays on the button through the load.
                    disabled: loading, focusableWhenDisabled: true, "aria-busy": loading || undefined, className: "w-full rounded-none border-t border-border-subtle font-mono", onClick: onLoad, children: [loading && _jsx(Spinner, { size: "xs", label: "" }), payload.load === "failed"
                            ? (labels.loadFailed ?? DEFAULT_LOAD_FAILED)(part)
                            : labels.loadFull(part, size)] })) : (_jsx("p", { className: "border-t border-border-subtle px-3 py-1.5 font-mono text-xs text-disabled", children: labels.truncated(part) })))] }));
}
function TerminalBlock({ terminal, labels, onCopy, }) {
    const text = useMemo(() => stripAnsi(terminal.output), [terminal.output]);
    const lines = useMemo(() => splitLines(text), [text]);
    const failed = terminal.exitCode !== undefined && terminal.exitCode !== 0;
    return (_jsx(Frame, { terminal: true, icon: SquareTerminalIcon, label: terminal.command ? `$ ${terminal.command}` : "Terminal", aside: (failed || onCopy) && (_jsxs(_Fragment, { children: [failed && (_jsxs("span", { className: "shrink-0 font-mono text-xs text-error", children: ["exit ", terminal.exitCode] })), onCopy && (_jsx(CopyPayloadButton, { part: "output", text: text, onCopy: onCopy, labels: labels }))] })), children: _jsx(Lines, { lines: lines, from: "tail", dim: true, showMore: labels.showMore }) }));
}
function diffLines(diff) {
    if (diff.patch !== undefined) {
        return {
            lines: splitLines(diff.patch),
            tone: (line) => line.startsWith("@@")
                ? "hunk"
                : line.startsWith("+++") || line.startsWith("---")
                    ? "hunk"
                    : line.startsWith("+")
                        ? "added"
                        : line.startsWith("-")
                            ? "removed"
                            : undefined,
        };
    }
    // No patch: the texts as they are, removed above added. Not a diff
    // algorithm; a real diff view plugs into `renderDiff`.
    const removed = diff.oldText ? splitLines(diff.oldText).map((l) => `-${l}`) : [];
    const added = diff.newText ? splitLines(diff.newText).map((l) => `+${l}`) : [];
    return {
        lines: [...removed, ...added],
        tone: (line) => (line.startsWith("+") ? "added" : "removed"),
    };
}
/**
 * A diff as the patch's lines, tinted by sign, or the old text above the new
 * when there is no patch. The fallback for `ToolCallCard`'s `renderDiff`.
 */
export function DefaultDiff({ diff, labels }) {
    const { lines, tone } = useMemo(() => diffLines(diff), [diff]);
    const known = diff.insertions !== undefined || diff.deletions !== undefined;
    return (_jsx("div", { "data-slot": "default-diff", children: _jsx(Frame, { label: diff.path, aside: known && (_jsx(DiffStat, { added: diff.insertions ?? 0, removed: diff.deletions ?? 0, className: "font-mono" })), children: lines.length > 0 ? (_jsx(Lines, { lines: lines, from: "head", tone: tone, showMore: labels?.showMore })) : (_jsx("p", { className: "px-3 py-1.5 font-mono text-xs text-disabled", children: "No changes recorded." })) }) }));
}
//# sourceMappingURL=tool-call-card.js.map
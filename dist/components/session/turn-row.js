"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrainIcon, ChevronDownIcon, ChevronRightIcon, CircleCheckIcon, CircleDashedIcon, CircleIcon, GitCommitHorizontalIcon, PaperclipIcon, } from "lucide-react";
import { Fragment, memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { Icon } from "../../ui/icon.js";
import { Callout } from "../ui/callout.js";
import { DiffStat } from "../ui/code-block.js";
import { Spinner } from "../ui/spinner.js";
import { formatBytes, useWindow } from "./session-view-helpers.js";
import { StreamingMarkdown } from "./streaming-markdown.js";
import { TOOL_KIND_ICON, ToolCallCard } from "./tool-call-card.js";
/** "17s", "1m 29s", "1h 3m": a turn's work, in whole seconds (desktop's `formatWorked`). */
function formatWorked(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    if (s < 60)
        return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60)
        return `${m}m ${s % 60}s`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
}
/** A run of more tool calls than this folds behind one line. */
const FOLD_OVER = 3;
/** Consecutive tool items become one run. */
function blocksOf(items) {
    const blocks = [];
    for (const item of items) {
        if (item.kind === "tool") {
            const last = blocks[blocks.length - 1];
            if (last?.kind === "tools")
                last.calls.push(item.call);
            else
                blocks.push({ kind: "tools", key: `tools:${item.call.id}`, calls: [item.call] });
        }
        else {
            blocks.push({ kind: "item", item });
        }
    }
    return blocks;
}
export const TurnRow = memo(function TurnRow({ turn, streaming, commentSlot, renderMarkdown, rehypePlugins, onLoadPayload, renderDiff, errorAction, renderItemFooter, renderCheckpointFooter, openToolCallIds, onOpenToolCallIdsChange, thinkingLabel, thinkingBody = "text", onOpenAttachment, onCopyPayload, onLoadBody, openToolRunIds, onOpenToolRunIdsChange, revealItemId, clampResponses = false, toolRunSummary = "kinds", className, }) {
    const blocks = useMemo(() => blocksOf(turn.items), [turn.items]);
    const markdown = renderMarkdown ??
        ((source, live) => (_jsx(StreamingMarkdown, { source: source, streaming: live, rehypePlugins: rehypePlugins })));
    // The prompt is the same markdown one step up the type scale.
    const userMarkdown = renderMarkdown
        ? (source) => _jsx("div", { className: "prose-session-user", children: renderMarkdown(source, false) })
        : (source) => (_jsx(StreamingMarkdown, { source: source, rehypePlugins: rehypePlugins, className: "prose-session-user" }));
    const outcome = turn.outcome;
    const live = !outcome && streaming !== undefined;
    // The first answer carries the model line; the ones after it are the same voice.
    const firstText = turn.items.find((i) => i.kind === "text");
    return (_jsxs("div", { "data-slot": "turn-row", "data-turn-key": turn.key, className: cn("flex min-w-0 flex-col", className), children: [turn.user && (_jsx(UserMessage, { user: turn.user, commentSlot: commentSlot, markdown: userMarkdown, footer: renderItemFooter?.({ kind: "user", id: turn.user.id }), onOpenAttachment: onOpenAttachment, onLoadBody: onLoadBody })), turn.durationMs !== undefined && outcome && (_jsx("div", { className: "mb-1 flex h-6 items-center border-b border-border-subtle pb-2 text-base text-muted-foreground", children: _jsxs("span", { children: [outcome?.kind === "cancelled" ? "Stopped after" : "Worked for", " ", _jsx("span", { className: "tabular-nums", children: formatWorked(turn.durationMs) })] }) })), blocks.map((block) => block.kind === "tools" ? (_jsx(ToolRun, { calls: block.calls, onLoadPayload: onLoadPayload, renderDiff: renderDiff, commentSlot: commentSlot, renderItemFooter: renderItemFooter, openIds: openToolCallIds, onOpenIdsChange: onOpenToolCallIdsChange, onCopy: onCopyPayload, openRunIds: openToolRunIds, onOpenRunIdsChange: onOpenToolRunIdsChange, revealId: revealItemId, summary: toolRunSummary }, block.key)) : (_jsxs(Fragment, { children: [block.item.kind === "text" ? (_jsx(TextItem, { item: block.item, header: block.item === firstText, live: streaming?.itemId === block.item.id, markdown: markdown, commentSlot: commentSlot, onLoadBody: onLoadBody, clamp: clampResponses })) : block.item.kind === "thinking" ? (_jsx(ThinkingItem, { id: block.item.id, text: block.item.text, live: streaming?.itemId === block.item.id, label: thinkingLabel, body: thinkingBody, markdown: markdown, commentSlot: commentSlot })) : (_jsx(PlanList, { items: block.item.items, className: "py-2" })), renderItemFooter?.(block.item)] }, block.item.id))), live && streaming?.retry && (_jsxs("p", { className: "py-1 text-sm text-muted-foreground", children: ["Retrying (", streaming.retry.attempt, "/", streaming.retry.maxAttempts, ")"] })), live && streaming?.compacting && (_jsx("p", { className: "py-1 text-sm text-muted-foreground", children: "Compacting context" })), turn.checkpoints?.map((checkpoint) => (_jsxs(Fragment, { children: [_jsx(Checkpoint, { checkpoint: checkpoint, commentSlot: commentSlot }), renderCheckpointFooter?.(checkpoint)] }, checkpoint.id))), outcome?.kind === "failed" && (_jsx(Callout, { tone: "error", role: "alert", className: "mt-2", action: outcome.error?.kind === "auth" ? errorAction : undefined, children: outcome.error?.kind === "auth" ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "font-medium", children: "Sign in again to continue" }), _jsx("p", { className: "mt-0.5 opacity-80", children: outcome.error.message })] })) : ((outcome.error?.message ?? "The turn failed.")) })), outcome?.kind === "cancelled" && (_jsxs("p", { className: "mt-2 flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("span", { className: "h-px w-4 bg-border-strong", "aria-hidden": true }), "Cancelled"] }))] }));
});
// ── The prompt ───────────────────────────────────────────────────────────────
/** Lines a prompt shows before "Show more", and their height in the bubble. */
const USER_MAX_LINES = 12;
const USER_LINE_HEIGHT = 22;
const USER_CLAMP_PX = USER_MAX_LINES * USER_LINE_HEIGHT;
function UserMessage({ user, commentSlot, markdown, footer, onOpenAttachment, onLoadBody, }) {
    const [expanded, setExpanded] = useState(false);
    const clampRef = useRef(null);
    const { height, overflows } = useWholeLineClamp(clampRef, !expanded);
    // Each keeps its index in `user.attachments`, which is what `onOpenAttachment` reports.
    const indexed = (user.attachments ?? []).map((attachment, index) => ({ attachment, index }));
    const images = indexed.filter((a) => a.attachment.kind === "image");
    const files = indexed.filter((a) => a.attachment.kind === "file");
    return (_jsxs("div", { className: "flex justify-end gap-2 pt-2 pb-6", children: [commentSlot && (_jsx("div", { className: "shrink-0 self-start", children: commentSlot({ kind: "message", id: user.id }) })), _jsxs("div", { className: "flex max-w-4/5 min-w-0 flex-col items-end", children: [images.length > 0 && (_jsx("div", { className: "mb-2 flex flex-wrap justify-end gap-1.5", children: images.map(({ attachment: image, index }) => {
                            const img = (_jsx("img", { src: image.src, alt: image.name ?? "", className: "size-16 rounded-lg border border-border-subtle bg-card object-cover" }));
                            return onOpenAttachment ? (_jsx("button", { type: "button", "aria-label": `Open ${image.name ?? "attachment"}`, onClick: () => onOpenAttachment(image, index), className: "cursor-pointer rounded-lg transition-opacity hover:opacity-85", children: img }, index)) : (_jsx(Fragment, { children: img }, index));
                        }) })), _jsx("div", { "data-comment-anchor": user.id, className: cn(
                        // One continuous radius, above the `rounded-*` scale: a bubble
                        // grows to many lines, and `rounded-full` turns that into an
                        // ellipse whose curve cuts off the first and last line.
                        // ratchet-allow: 20px sits above the radius scale (xl is 12px) and a full radius clips multi-line bubbles
                        "max-w-full min-w-0 rounded-[20px] bg-primary-muted px-4 py-2.5 select-text"), children: _jsx("div", { ref: clampRef, style: expanded ? undefined : { maxHeight: height, overflow: "hidden" }, children: markdown(user.text) }) }), files.length > 0 && (_jsx("div", { className: "mt-1.5 flex flex-wrap justify-end gap-1.5", children: files.map(({ attachment: file, index }) => (_jsx(FileChip, { file: file, onOpen: onOpenAttachment && (() => onOpenAttachment(file, index)) }, index))) })), (overflows || user.truncated) && (_jsxs("div", { className: "mt-0.5 flex items-center gap-2 text-2xs text-muted-foreground", children: [user.truncated &&
                                (onLoadBody ? (_jsx(ReadRest, { id: user.id, bytes: user.bytes, load: user.load, onLoad: onLoadBody })) : (_jsx("span", { children: "Truncated" }))), overflows && (_jsx("button", { type: "button", "aria-expanded": expanded, onClick: () => setExpanded((v) => !v), className: "h-4.5 cursor-pointer transition-colors hover:text-secondary-foreground", children: expanded ? "Show less" : "Show more" }))] })), footer] })] }));
}
function FileChip({ file, onOpen }) {
    const chip = cn("flex h-6 max-w-60 items-center gap-1.5 rounded-md border border-border-subtle bg-card px-2 text-xs text-secondary-foreground", onOpen && "cursor-pointer transition-colors hover:bg-element-hover");
    const Tag = onOpen ? "button" : "span";
    return (_jsxs(Tag, { ...(onOpen
            ? {
                type: "button",
                onClick: onOpen,
            }
            : {}), className: chip, children: [_jsx(Icon, { icon: PaperclipIcon, size: "xs", className: "text-muted-foreground" }), onOpen && _jsx("span", { className: "sr-only", children: "Open " }), _jsx("span", { className: "min-w-0 truncate", children: file.name ?? "Attachment" }), file.bytes !== undefined && (_jsx("span", { className: "shrink-0 text-muted-foreground tabular-nums", children: formatBytes(file.bytes) }))] }));
}
/**
 * The collapsed bubble's `max-height`, snapped down to the bottom of the last
 * line that fits whole inside the budget. A fixed cut is only exact for one
 * unbroken paragraph; paragraph gaps and fences knock later lines off the grid,
 * so only the block the cut falls in is read line by line. Also reports
 * whether the prompt overflows at all, which decides "Show more".
 */
function useWholeLineClamp(ref, active) {
    const [height, setHeight] = useState(USER_CLAMP_PX);
    const [overflows, setOverflows] = useState(false);
    useLayoutEffect(() => {
        // The markdown root: its children are the blocks the cut falls between.
        let root = ref.current?.firstElementChild;
        if (root && !root.matches(".prose-session") && root.firstElementChild) {
            root = root.firstElementChild;
        }
        if (!(root instanceof HTMLElement))
            return;
        const measure = () => {
            const over = root.scrollHeight > USER_CLAMP_PX;
            setOverflows(over);
            if (!active)
                return;
            if (!over) {
                setHeight(USER_CLAMP_PX);
                return;
            }
            const base = root.getBoundingClientRect().top;
            let fit = 0;
            for (const child of Array.from(root.children)) {
                const box = child.getBoundingClientRect();
                if (box.top - base >= USER_CLAMP_PX)
                    break;
                if (box.bottom - base <= USER_CLAMP_PX) {
                    fit = box.bottom - base;
                    continue;
                }
                const range = document.createRange();
                range.selectNodeContents(child);
                for (const line of Array.from(range.getClientRects())) {
                    const bottom = line.bottom - base;
                    if (bottom <= USER_CLAMP_PX && bottom > fit)
                        fit = bottom;
                }
                break;
            }
            setHeight(fit > 0 ? Math.ceil(fit) : USER_CLAMP_PX);
        };
        measure();
        if (typeof ResizeObserver === "undefined")
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        return () => observer.disconnect();
    }, [ref, active]);
    return { height, overflows };
}
/**
 * A truncated body's "Read the rest": web's reader button, in the quiet type
 * of the prompt's "Show more". The app fetches; `load` is how that is going.
 */
function ReadRest({ id, bytes, load, onLoad, }) {
    const loading = load === "loading";
    return (_jsxs("button", { type: "button", "data-slot": "read-the-rest", "data-load": load, "aria-disabled": loading || undefined, "aria-busy": loading || undefined, onClick: () => {
            if (!loading)
                onLoad(id);
        }, className: "flex h-4.5 cursor-pointer items-center gap-1 transition-colors hover:text-secondary-foreground aria-disabled:cursor-default aria-disabled:hover:text-current", children: [loading && _jsx(Spinner, { size: "xs", label: "" }), load === "failed"
                ? "Couldn't load the rest, retry"
                : `Read the rest${bytes !== undefined ? ` · ${formatBytes(bytes)}` : ""}`] }));
}
// ── Agent items ──────────────────────────────────────────────────────────────
function time(iso) {
    if (!iso)
        return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime()))
        return null;
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function TextItem({ item, header, live, markdown, commentSlot, onLoadBody, clamp, }) {
    const at = time(item.at);
    return (_jsxs("div", { className: "flex min-w-0 gap-2 py-2", "data-comment-anchor": item.id, children: [_jsxs("div", { className: "min-w-0 flex-1", children: [header && (item.model || at) && (_jsxs("div", { className: "flex h-5.5 items-center gap-1.5 font-mono text-2xs text-muted-foreground", children: [item.model && _jsx("span", { className: "min-w-0 truncate", children: item.model }), item.model && at && (_jsx("span", { "aria-hidden": true, className: "text-disabled", children: "\u00B7" })), at && _jsx("span", { className: "shrink-0", children: at })] })), clamp && !live ? (_jsx(ResponseClamp, { children: markdown(item.text, live) })) : (markdown(item.text, live)), item.truncated &&
                        (onLoadBody ? (_jsx("div", { className: "mt-1 flex text-2xs text-muted-foreground", children: _jsx(ReadRest, { id: item.id, bytes: item.bytes, load: item.load, onLoad: onLoadBody }) })) : (_jsx("p", { className: "mt-1 text-2xs text-disabled", children: "Truncated" })))] }), commentSlot && (_jsx("div", { className: "shrink-0 self-start", children: commentSlot({ kind: "message", id: item.id }) }))] }));
}
/** An answer's clamped height, and how far past it an answer may run before it clamps. */
const RESPONSE_CLAMP_PX = 340;
const RESPONSE_CLAMP_SLACK_PX = 60;
/**
 * Desktop's session-detail clamp: past 400px, an answer shows its first 340
 * and fades out (a mask, so it fades into whatever surface it sits on) under
 * a pill that hangs half over the edge. Expanded, the pill sits below as
 * "Show less". The slack keeps an answer only a little over from being cut by
 * a sliver. Measured on every resize, since a body that loads later grows.
 */
function ResponseClamp({ children }) {
    const ref = useRef(null);
    const [overflows, setOverflows] = useState(false);
    const [expanded, setExpanded] = useState(false);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const measure = () => {
            // Zero is "not laid out yet", not "empty": it must not close an open clamp.
            if (el.scrollHeight === 0)
                return;
            setOverflows(el.scrollHeight > RESPONSE_CLAMP_PX + RESPONSE_CLAMP_SLACK_PX);
        };
        measure();
        if (typeof ResizeObserver === "undefined")
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    const clamped = overflows && !expanded;
    return (_jsxs("div", { "data-slot": "response-clamp", className: cn("relative", clamped && "pb-3.5"), children: [_jsx("div", { ref: ref, className: cn(clamped && "mask-b-from-[calc(100%-4rem)] overflow-hidden"), style: clamped ? { maxHeight: RESPONSE_CLAMP_PX } : undefined, children: children }), overflows && (_jsx("div", { className: cn("flex justify-center", expanded ? "mt-2" : "absolute inset-x-0 bottom-0"), children: _jsxs("button", { type: "button", "aria-expanded": expanded, onClick: () => setExpanded((v) => !v), className: "flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-secondary-foreground shadow-md transition-colors hover:border-border-strong hover:text-foreground", children: [_jsx(Icon, { icon: ChevronDownIcon, size: "xs", className: cn("transition-transform duration-fast", expanded && "rotate-180") }), expanded ? "Show less" : "Show more"] }) }))] }));
}
function ThinkingItem({ id, text, live, label, body, markdown, commentSlot, }) {
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { className: "py-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", "aria-expanded": open, onClick: () => setOpen((v) => !v), className: "flex h-6.5 min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-base text-muted-foreground transition-colors hover:text-secondary-foreground", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center", children: _jsx(Icon, { icon: BrainIcon, size: "md" }) }), _jsx("span", { className: "min-w-0 truncate", children: label ? label({ streaming: live }) : live ? "Thinking…" : "Thought process" }), _jsx(Icon, { icon: ChevronRightIcon, size: "md", className: cn("transition-transform duration-fast", open && "rotate-90") })] }), commentSlot && _jsx("div", { className: "shrink-0", children: commentSlot({ kind: "message", id }) })] }), open && (_jsx("div", { className: "pb-3 pl-6", children: body === "markdown" ? (_jsx("div", { className: "text-muted-foreground", children: markdown(text, live) })) : (_jsx("pre", { className: "font-sans text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground select-text", children: text })) }))] }));
}
/** "3 edited · 4 read · 2 ran" — what a folded run did. */
function summarise(calls) {
    const count = (...kinds) => calls.filter((c) => kinds.includes(c.kind)).length;
    const parts = [];
    const edited = count("edit", "delete", "move");
    if (edited)
        parts.push(`${edited} edited`);
    if (count("read"))
        parts.push(`${count("read")} read`);
    if (count("execute"))
        parts.push(`${count("execute")} ran`);
    if (count("search"))
        parts.push(`${count("search")} searched`);
    const other = calls.length - edited - count("read", "execute", "search");
    if (other > 0)
        parts.push(`${other} other`);
    return parts.join(" · ");
}
/**
 * "2 modified · 3 read", and the lines the edits added and removed: what a
 * folded run did to the tree (desktop's session-detail `CallStat`).
 */
function summariseFiles(calls) {
    const modified = new Set();
    const read = new Set();
    let added = 0;
    let removed = 0;
    for (const call of calls) {
        if (call.status === "failed")
            continue;
        if (call.kind === "edit") {
            for (const path of call.paths ?? [])
                modified.add(path);
            for (const diff of call.diffs ?? []) {
                modified.add(diff.path);
                added += diff.insertions ?? 0;
                removed += diff.deletions ?? 0;
            }
        }
        else if (call.kind === "read") {
            for (const path of call.paths ?? [])
                read.add(path);
        }
    }
    const parts = [];
    if (modified.size)
        parts.push(`${modified.size} modified`);
    if (read.size)
        parts.push(`${read.size} read`);
    return { text: parts.join(" · "), added, removed };
}
function ToolRun({ openRunIds, onOpenRunIdsChange, summary: summaryKind = "kinds", ...props }) {
    const { calls, openIds } = props;
    const foldable = calls.length > FOLD_OVER;
    // A run holding a call the host opened or revealed unfolds, on mount or when
    // it starts to hold it; folding it again afterwards is the person's call.
    const { revealId } = props;
    const held = calls.some((c) => openIds?.has(c.id) || c.id === revealId);
    const [open, setOpen] = useState(!foldable || held);
    const [wasHeld, setWasHeld] = useState(held);
    if (held !== wasHeld) {
        setWasHeld(held);
        if (held)
            setOpen(true);
    }
    // Controlled: the host's set alone decides, and a toggle reports the next set.
    const shown = !foldable || (openRunIds ? calls.some((c) => openRunIds.has(c.id)) : open);
    const toggle = () => {
        if (!openRunIds)
            return setOpen((v) => !v);
        const ids = new Set(openRunIds);
        if (shown)
            for (const c of calls)
                ids.delete(c.id);
        else
            ids.add(calls[0].id);
        onOpenRunIdsChange?.(ids);
    };
    const running = calls.find((c) => c.status === "running");
    const failed = calls.some((c) => c.status === "failed");
    const summary = useMemo(() => summaryKind === "files"
        ? summariseFiles(calls)
        : { text: summarise(calls), added: 0, removed: 0 }, [calls, summaryKind]);
    return (_jsxs("div", { className: "py-1", children: [foldable && (_jsxs("button", { type: "button", "aria-expanded": shown, onClick: toggle, className: "group/run flex h-6.5 w-full min-w-0 cursor-pointer items-center gap-2 text-left text-base text-muted-foreground transition-colors hover:text-secondary-foreground", children: [_jsx("span", { className: "flex w-4 shrink-0 justify-center", children: running ? (_jsx(Spinner, { size: "sm", label: "" })) : (_jsx(Icon, { icon: TOOL_KIND_ICON[calls[0].kind], size: "md", className: cn(failed && "text-error") })) }), _jsx("span", { className: "min-w-0 truncate", children: running ? (running.title ?? running.name) : `${calls.length} tool calls` }), !running && summary.text && (_jsx("span", { className: "min-w-0 truncate font-mono text-xs text-disabled", children: summary.text })), !running && summary.added + summary.removed > 0 && (_jsx(DiffStat, { added: summary.added, removed: summary.removed, className: "shrink-0 font-mono text-xs" })), _jsx(Icon, { icon: ChevronRightIcon, size: "md", className: cn("ml-auto shrink-0 transition-[transform,opacity] duration-fast", shown
                            ? "rotate-90 opacity-100"
                            : "opacity-0 group-hover/run:opacity-100 group-focus-visible/run:opacity-100") })] })), shown && _jsx(ToolCalls, { ...props, className: cn(foldable && "mt-1") })] }));
}
/** A run's calls in one bordered box; past 80, windowed. */
function ToolCalls({ calls, onLoadPayload, renderDiff, commentSlot, renderItemFooter, openIds, onOpenIdsChange, onCopy, revealId, className, }) {
    const { end: windowEnd, sentinelRef } = useWindow({ count: calls.length, grow: "down" });
    // A held or revealed call past the window is still drawn, so the host can scroll to it.
    let end = windowEnd;
    if (openIds || revealId !== undefined) {
        for (let i = calls.length - 1; i >= end; i--) {
            const id = calls[i].id;
            if (openIds?.has(id) || id === revealId) {
                end = i + 1;
                break;
            }
        }
    }
    return (_jsxs("div", { className: cn("divide-y divide-border-subtle overflow-hidden rounded-md border border-border", className), children: [calls.slice(0, end).map((call) => {
                const card = (_jsx(ToolCallCard, { call: call, open: openIds ? openIds.has(call.id) : undefined, onOpenChange: openIds &&
                        ((next) => {
                            const ids = new Set(openIds);
                            if (next)
                                ids.add(call.id);
                            else
                                ids.delete(call.id);
                            onOpenIdsChange?.(ids);
                        }), onCopy: onCopy, onLoadPayload: onLoadPayload && ((part) => onLoadPayload(call.id, part)), renderDiff: renderDiff, commentSlot: commentSlot }, call.id));
                // Wrapped whenever there is a footer renderer, so a footer that comes
                // and goes never remounts the card (and its open or Copy state).
                return renderItemFooter ? (_jsxs("div", { children: [card, renderItemFooter({ kind: "tool", call })] }, call.id)) : (card);
            }), end < calls.length && _jsx("div", { ref: sentinelRef, "aria-hidden": true, className: "h-px" })] }));
}
const PLAN_ICON = {
    completed: CircleCheckIcon,
    in_progress: CircleDashedIcon,
    pending: CircleIcon,
};
/** The agent's plan as a checklist: done is struck through, the current step turns. */
function PlanList({ items, className }) {
    return (_jsx("ul", { "data-slot": "plan-list", className: cn("space-y-1", className), children: items.map((item, i) => (_jsxs("li", { "data-status": item.status, className: cn("flex min-h-5.5 items-start gap-2 text-base", item.status === "completed" && "text-muted-foreground line-through opacity-60", item.status === "in_progress" && "text-foreground", item.status === "pending" && "text-secondary-foreground"), children: [_jsx("span", { className: "flex h-5.5 w-4 shrink-0 items-center justify-center", children: item.status === "in_progress" ? (_jsx(Spinner, { size: "md", label: "In progress", className: "text-foreground" })) : (_jsx(Icon, { icon: PLAN_ICON[item.status], size: "md", className: "text-muted-foreground" })) }), _jsx("span", { className: "min-w-0 leading-5.5", children: item.content })] }, i))) }));
}
// ── Checkpoints ──────────────────────────────────────────────────────────────
const FILES_SHOWN = 12;
/**
 * A commit, as a card: desktop's session checkpoint. An orphaned one says so
 * outright and hides its branch, since the branch no longer holds it.
 */
function Checkpoint({ checkpoint, commentSlot, }) {
    const orphaned = checkpoint.linkState === "orphaned";
    const files = checkpoint.files ?? [];
    const known = checkpoint.insertions !== undefined || checkpoint.deletions !== undefined;
    return (_jsxs("div", { "data-slot": "checkpoint", "data-link-state": checkpoint.linkState, className: cn("mt-2.5 overflow-hidden rounded-md border", orphaned ? "border-dashed border-border-strong" : "border-border bg-card"), children: [_jsxs("div", { className: "flex items-center gap-2.5 border-b border-border-subtle bg-card px-3 py-2 last:border-b-0", children: [_jsx(Icon, { icon: GitCommitHorizontalIcon, size: "sm", className: "text-muted-foreground" }), checkpoint.commitSha && (_jsx("span", { className: "shrink-0 font-mono text-xs text-muted-foreground", children: checkpoint.commitSha.slice(0, 7) })), _jsx("span", { className: cn("min-w-0 flex-1 truncate text-sm", orphaned ? "text-secondary-foreground" : "text-foreground"), children: checkpoint.subject ?? (_jsx("span", { className: "text-muted-foreground", children: orphaned ? "Commit no longer reachable" : "Checkpoint" })) }), orphaned && (_jsx("span", { className: "shrink-0 rounded-full bg-warning-muted px-2 py-px font-mono text-2xs text-warning", title: "This commit is no longer in history: rewritten or squashed. The session record is kept.", children: "Orphaned" })), known && (_jsx(DiffStat, { added: checkpoint.insertions ?? 0, removed: checkpoint.deletions ?? 0, className: "shrink-0 font-mono text-xs" })), commentSlot?.({ kind: "checkpoint", id: checkpoint.id })] }), files.length > 0 && (_jsxs("ul", { className: "px-3 py-2", children: [files.slice(0, FILES_SHOWN).map((file) => (_jsx("li", { className: "truncate font-mono text-xs leading-[1.75] text-muted-foreground", children: file }, file))), files.length > FILES_SHOWN && (_jsxs("li", { className: "font-mono text-xs leading-[1.75] text-disabled", children: ["+", files.length - FILES_SHOWN, " more"] }))] })), checkpoint.branch && !orphaned && (_jsx("p", { className: "border-t border-border-subtle px-3 py-1.5 font-mono text-xs text-disabled", children: checkpoint.branch }))] }));
}
//# sourceMappingURL=turn-row.js.map
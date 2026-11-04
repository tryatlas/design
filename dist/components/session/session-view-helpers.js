"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
/**
 * Pure helpers the session blocks share, and the one hook (`useWindow`). An
 * adapter uses `toolKindOf` to fold a tool name onto a `ToolKind`; the rest are
 * exported so an app's own session surfaces agree with the blocks.
 */
const TOOL_KINDS = new Set([
    "read",
    "edit",
    "delete",
    "move",
    "search",
    "execute",
    "think",
    "fetch",
    "other",
]);
/**
 * Agents name their tools differently (Claude Code's `Bash` is ACP's
 * `execute`, its `Grep` a `search`), so a name is folded onto a kind. Keys are
 * lower-cased with spaces, hyphens and underscores removed. Web's table, plus
 * the names ACP agents commonly send.
 */
const KIND_OF = {
    read: "read",
    view: "read",
    cat: "read",
    notebookread: "read",
    edit: "edit",
    multiedit: "edit",
    strreplace: "edit",
    strreplaceeditor: "edit",
    strreplacebasededittool: "edit",
    applypatch: "edit",
    patch: "edit",
    notebookedit: "edit",
    write: "edit",
    create: "edit",
    delete: "delete",
    remove: "delete",
    rm: "delete",
    move: "move",
    mv: "move",
    rename: "move",
    bash: "execute",
    bashoutput: "execute",
    execute: "execute",
    exec: "execute",
    shell: "execute",
    terminal: "execute",
    run: "execute",
    search: "search",
    grep: "search",
    glob: "search",
    find: "search",
    ls: "search",
    list: "search",
    fetch: "fetch",
    webfetch: "fetch",
    websearch: "fetch",
    think: "think",
    todowrite: "think",
    task: "think",
};
/**
 * The `ToolKind` for a call. A valid ACP `acpKind` wins; otherwise the name is
 * folded through the table, and anything unknown is `other`.
 */
export function toolKindOf(name, acpKind) {
    if (acpKind && TOOL_KINDS.has(acpKind))
        return acpKind;
    return KIND_OF[name.toLowerCase().replace(/[\s_-]/g, "")] ?? "other";
}
/** The `StatusIcon` glyph for a phase. */
export function statusIconOf(phase) {
    switch (phase) {
        case "running":
        case "waiting":
            return "live";
        case "done":
        case "cancelled":
            return "done";
        case "queued":
            return "queued";
        case "failed":
            return "failed";
    }
}
/** CSI (`ESC [ … final byte`) and OSC (`ESC ] … BEL` or `ESC ] … ESC \`). */
// oxlint-disable-next-line no-control-regex -- the escapes are what it matches
const ANSI = /\u001b\[[0-?]*[ -/]*[@-~]|\u001b\][^\u0007\u001b]*(?:\u0007|\u001b\\)/g;
/** Terminal output without its escape sequences. No colour is kept. */
export function stripAnsi(text) {
    return text.replace(ANSI, "");
}
/** `850ms`, `4.2s`, `1m 12s`, `1h 3m`. */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${Math.max(0, Math.round(ms))}ms`;
    if (ms < 60_000)
        return `${(ms / 1000).toFixed(1)}s`;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    if (m < 60)
        return `${m}m ${s % 60}s`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
}
/** `512 B`, `4.2 KB`, `1.3 MB`. */
export function formatBytes(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
/** How far ahead of the reader the window grows, in px. Desktop's `GROW_MARGIN`. */
const GROW_MARGIN = 2200;
function scrollParent(el) {
    for (let node = el.parentElement; node; node = node.parentElement) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay")
            return node;
    }
    return null;
}
/**
 * A window over a long list of real DOM rows, grown as the reader nears its
 * edge. Desktop's transcript, which measured virtualisation losing to this: a
 * virtualiser unmounts rows, a fast flick outruns the remount and the reader
 * watches blank space; a row already in the DOM cannot blank. So rows are
 * never unmounted, only added.
 *
 * `down` renders `[0, initial)` and extends `end` by `chunk` when the sentinel
 * (placed after the last row) comes within 2200px of the scroll root. `up`
 * renders the last `initial` rows and lowers `start` when the sentinel (placed
 * before the first row) does, keeping the reader's place by adding the growth
 * to `scrollTop`. The scroll root is the sentinel's nearest scrollable
 * ancestor.
 *
 * Rows that arrive while streaming (`count` grows) do not grow a `down` window
 * unless the sentinel is in range. A server renders the initial window, as the
 * client's first render does; a browser without `IntersectionObserver`
 * (jsdom) renders everything.
 */
export function useWindow({ count, initial = 80, chunk = 40, grow = "down", }) {
    const [sentinel, setSentinel] = useState(null);
    const sentinelRef = useCallback((el) => setSentinel(el), []);
    const [end, setEnd] = useState(initial);
    // `up`: fixed once there are rows, so rows streaming in at the bottom never
    // push the top of the window down.
    const [startState, setStartState] = useState(null);
    const pendingHeight = useRef(null);
    // On the server there is no observer either, but the client's first render
    // will have one: render the same initial window there, or hydration
    // mismatches. Only a browser without one (jsdom) gets everything.
    const observable = typeof window === "undefined" || typeof IntersectionObserver !== "undefined";
    const start = grow === "up" ? Math.min(count, startState ?? Math.max(0, count - initial)) : 0;
    useLayoutEffect(() => {
        if (grow === "up" && startState === null && count > 0) {
            setStartState(Math.max(0, count - initial));
        }
    }, [grow, startState, count, initial]);
    // A list that shrank (a new session in the same view) restarts the window
    // rather than keeping room for rows that are gone.
    useLayoutEffect(() => {
        if (count < end && end > initial)
            setEnd(Math.max(initial, count));
    }, [count, end, initial]);
    // Keep the reader's place after rows were added above them.
    useLayoutEffect(() => {
        const pending = pendingHeight.current;
        if (!pending)
            return;
        pendingHeight.current = null;
        pending.root.scrollTop += pending.root.scrollHeight - pending.height;
    }, [start]);
    const atEdge = grow === "up" ? start === 0 : Math.min(count, end) >= count;
    // Re-created whenever the window moves, so a sentinel still in range after a
    // growth fires again and the window keeps growing until it is out of range.
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined" || !sentinel || atEdge)
            return;
        const root = scrollParent(sentinel);
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((e) => e.isIntersecting))
                return;
            observer.disconnect();
            if (grow === "up") {
                if (root)
                    pendingHeight.current = { root, height: root.scrollHeight };
                setStartState((s) => Math.max(0, (s ?? 0) - chunk));
            }
            else {
                setEnd((e) => e + chunk);
            }
        }, {
            root,
            rootMargin: grow === "up" ? `${GROW_MARGIN}px 0px 0px 0px` : `0px 0px ${GROW_MARGIN}px 0px`,
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [sentinel, atEdge, grow, chunk, start, end]);
    if (!observable)
        return { start: 0, end: count, sentinelRef };
    return { start, end: grow === "up" ? count : Math.min(count, end), sentinelRef };
}
//# sourceMappingURL=session-view-helpers.js.map
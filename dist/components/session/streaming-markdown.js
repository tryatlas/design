"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../lib/utils.js";
import { EMPTY_SPLIT, hasReferenceDefinitions, isIncompleteCodeFence, splitIncremental, } from "./markdown-blocks.js";
const REMARK_PLUGINS = [remarkGfm];
/** Below this the trailing block parses on every frame. Desktop's `INLINE_PARSE_LIMIT`. */
const INLINE_PARSE_LIMIT = 2000;
/** Parse cadence for a long trailing block. */
const TRAILING_THROTTLE_MS = 120;
/** A task item's own words, without its checkbox or a nested list. */
function taskText(node) {
    if (node.type === "text")
        return node.value;
    if (node.type !== "element" || ["input", "ul", "ol"].includes(node.tagName))
        return "";
    return node.children.map(taskText).join("");
}
/** The task a GFM checkbox belongs to, so it can be named for it. */
const TaskLabel = createContext(null);
function TaskCheckbox(props) {
    const label = useContext(TaskLabel);
    return _jsx("input", { "aria-label": label || "Task", ...props });
}
/**
 * Links leave the page: a transcript is read in place. A fence scrolls
 * sideways, so it takes keyboard focus. A GFM task's checkbox has no label
 * of its own, so it is named for its item's words.
 */
const DEFAULT_COMPONENTS = {
    a: ({ node: _node, ...props }) => _jsx("a", { ...props, target: "_blank", rel: "noreferrer noopener" }),
    pre: ({ node: _node, ...props }) => _jsx("pre", { tabIndex: 0, ...props }),
    li: ({ node, ...props }) => node && String(node.properties.className ?? "").includes("task-list-item") ? (_jsx(TaskLabel.Provider, { value: taskText(node).trim(), children: _jsx("li", { ...props }) })) : (_jsx("li", { ...props })),
    input: ({ node: _node, ...props }) => props.type === "checkbox" ? _jsx(TaskCheckbox, { ...props }) : _jsx("input", { ...props }),
};
const MarkdownBlock = memo(function MarkdownBlock({ source, components, rehypePlugins, }) {
    return (_jsx(Markdown, { remarkPlugins: REMARK_PLUGINS, rehypePlugins: rehypePlugins, components: components, children: source }));
});
function Caret() {
    return _jsx("span", { "data-slot": "stream-caret", className: "stream-caret", "aria-hidden": true });
}
/** A fence still streaming: its body as plain code, the language class kept. */
function OpenFence({ source }) {
    const newline = source.indexOf("\n");
    const opener = (newline === -1 ? source : source.slice(0, newline)).trim();
    const language = opener
        .replace(/^(`{3,}|~{3,})/, "")
        .trim()
        .split(/\s/)[0];
    const body = newline === -1 ? "" : source.slice(newline + 1);
    return (_jsxs("pre", { "data-slot": "open-fence", tabIndex: 0, children: [_jsx("code", { className: language ? `language-${language}` : undefined, children: body }), _jsx(Caret, {})] }));
}
/** The trailing block: every frame while short, throttled once long. */
function TrailingBlock({ source, components, rehypePlugins, }) {
    const small = source.length <= INLINE_PARSE_LIMIT;
    const [throttled, setThrottled] = useState(source);
    const latest = useRef(source);
    latest.current = source;
    const timer = useRef(null);
    useEffect(() => {
        if (small || timer.current !== null)
            return;
        timer.current = setTimeout(() => {
            timer.current = null;
            setThrottled(latest.current);
        }, TRAILING_THROTTLE_MS);
    }, [small, source]);
    useEffect(() => () => {
        if (timer.current !== null)
            clearTimeout(timer.current);
        // A remount (StrictMode) must be able to schedule again.
        timer.current = null;
    }, []);
    return (_jsx(MarkdownBlock, { source: small ? source : throttled, components: components, rehypePlugins: rehypePlugins }));
}
/**
 * The split, at most once per frame while streaming and at once when settled.
 * The carry holds the settled blocks, so a frame parses only the growing tail.
 */
function useBlocks(source, streaming, whole) {
    const carry = useRef(EMPTY_SPLIT);
    const [blocks, setBlocks] = useState(() => {
        if (whole)
            return [source];
        carry.current = splitIncremental(source, EMPTY_SPLIT);
        return carry.current.blocks;
    });
    const frame = useRef(null);
    const latest = useRef(source);
    latest.current = source;
    useEffect(() => {
        if (whole)
            return;
        const split = (text) => {
            carry.current = splitIncremental(text, carry.current);
            setBlocks(carry.current.blocks);
        };
        if (!streaming || typeof requestAnimationFrame === "undefined") {
            if (frame.current !== null) {
                cancelAnimationFrame(frame.current);
                frame.current = null;
            }
            split(source);
            return;
        }
        if (frame.current !== null)
            return;
        frame.current = requestAnimationFrame(() => {
            frame.current = null;
            split(latest.current);
        });
    }, [source, streaming, whole]);
    useEffect(() => () => {
        if (frame.current !== null) {
            cancelAnimationFrame(frame.current);
            // A cancelled frame left recorded reads as pending forever, and every
            // later change would wait on it (StrictMode's remount hit this).
            frame.current = null;
        }
    }, []);
    return blocks;
}
export function StreamingMarkdown({ source, streaming = false, rehypePlugins, components, className, }) {
    const merged = useMemo(() => (components ? { ...DEFAULT_COMPONENTS, ...components } : DEFAULT_COMPONENTS), [components]);
    // While streaming the definition may not have arrived yet, and block-level
    // rendering avoids a whole-message parse per frame; settled, render whole.
    const hasRefs = useMemo(() => hasReferenceDefinitions(source), [source]);
    const whole = hasRefs && !streaming;
    const blocks = useBlocks(source, streaming, whole);
    const last = blocks.length - 1;
    const trailingOpen = streaming && last >= 0 && isIncompleteCodeFence(blocks[last]);
    return (_jsxs("div", { "data-slot": "streaming-markdown", className: cn("prose-session", className), children: [whole ? (_jsx(MarkdownBlock, { source: source, components: merged, rehypePlugins: rehypePlugins })) : (blocks.map((block, i) => streaming && i === last ? (trailingOpen ? (_jsx(OpenFence, { source: block }, i)) : (_jsx(TrailingBlock, { source: block, components: merged, rehypePlugins: rehypePlugins }, i))) : (_jsx(MarkdownBlock, { source: block, components: merged, rehypePlugins: rehypePlugins }, i)))), streaming && !trailingOpen && _jsx(Caret, {})] }));
}
//# sourceMappingURL=streaming-markdown.js.map
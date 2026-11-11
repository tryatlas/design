"use client";

import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import type { Components, ExtraProps, Options } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "../../lib/utils.ts";
import {
  type BlockSplit,
  EMPTY_SPLIT,
  hasReferenceDefinitions,
  isIncompleteCodeFence,
  splitIncremental,
} from "./markdown-blocks.ts";

/**
 * Markdown that formats live as it streams, with bounded re-work. Desktop's
 * renderer (`streaming-markdown.tsx`), on `react-markdown`.
 *
 * The source is split into its top-level blocks and each renders through a
 * memoised `MarkdownBlock` keyed by position, so a finished block's source is
 * byte-identical every frame and it never re-parses: only the trailing block
 * does. The split itself is incremental (`splitIncremental`) and runs at most
 * once per animation frame while streaming, so the parsing done per frame does
 * not grow with the length of the answer (what remains linear is a string
 * compare and a regex scan, orders of magnitude cheaper than a parse).
 *
 * Two more of desktop's bargains:
 *
 *  - A trailing fence that has not closed renders as plain code, not through
 *    the parser: a growing code block would otherwise re-highlight every frame.
 *    It is parsed (and highlighted, with `rehype-highlight`) once it closes.
 *  - A long trailing block (over 2,000 characters) re-parses at most every
 *    120ms; its growth is mostly invisible mid-word anyway.
 *
 * Reference-style link and footnote definitions need context across blocks,
 * so a settled message that has them renders whole.
 *
 * No `rehype-raw`, ever: HTML in the source renders as text. react-markdown's
 * default `urlTransform` stays, which drops `javascript:` links. Highlighting
 * is the consumer's: pass `rehypePlugins={[rehypeHighlight]}`; `syntax.css`
 * colours its classes from the theme's `syntax.*` keys.
 */

type RehypePlugins = Options["rehypePlugins"];

const REMARK_PLUGINS: Options["remarkPlugins"] = [remarkGfm];

/** Below this the trailing block parses on every frame. Desktop's `INLINE_PARSE_LIMIT`. */
const INLINE_PARSE_LIMIT = 2000;
/** Parse cadence for a long trailing block. */
const TRAILING_THROTTLE_MS = 120;

type HastNode = NonNullable<ExtraProps["node"]>;

/** A task item's own words, without its checkbox or a nested list. */
function taskText(node: HastNode | HastNode["children"][number]): string {
  if (node.type === "text") return node.value;
  if (node.type !== "element" || ["input", "ul", "ol"].includes(node.tagName)) return "";
  return node.children.map(taskText).join("");
}

/** The task a GFM checkbox belongs to, so it can be named for it. */
const TaskLabel = createContext<string | null>(null);

function TaskCheckbox(props: React.ComponentProps<"input">) {
  const label = useContext(TaskLabel);
  return <input aria-label={label || "Task"} {...props} />;
}

/**
 * Links leave the page: a transcript is read in place. A fence scrolls
 * sideways, so it takes keyboard focus. A GFM task's checkbox has no label
 * of its own, so it is named for its item's words.
 */
const DEFAULT_COMPONENTS: Components = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
  pre: ({ node: _node, ...props }) => <pre tabIndex={0} {...props} />,
  li: ({ node, ...props }) =>
    node && String(node.properties.className ?? "").includes("task-list-item") ? (
      <TaskLabel.Provider value={taskText(node).trim()}>
        <li {...props} />
      </TaskLabel.Provider>
    ) : (
      <li {...props} />
    ),
  input: ({ node: _node, ...props }) =>
    props.type === "checkbox" ? <TaskCheckbox {...props} /> : <input {...props} />,
};

const MarkdownBlock = memo(function MarkdownBlock({
  source,
  components,
  rehypePlugins,
}: {
  source: string;
  components: Components;
  rehypePlugins: RehypePlugins;
}) {
  return (
    <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={rehypePlugins} components={components}>
      {source}
    </Markdown>
  );
});

function Caret() {
  return <span data-slot="stream-caret" className="stream-caret" aria-hidden />;
}

/** A fence still streaming: its body as plain code, the language class kept. */
function OpenFence({ source }: { source: string }) {
  const newline = source.indexOf("\n");
  const opener = (newline === -1 ? source : source.slice(0, newline)).trim();
  const language = opener
    .replace(/^(`{3,}|~{3,})/, "")
    .trim()
    .split(/\s/)[0];
  const body = newline === -1 ? "" : source.slice(newline + 1);
  return (
    <pre data-slot="open-fence" tabIndex={0}>
      <code className={language ? `language-${language}` : undefined}>{body}</code>
      <Caret />
    </pre>
  );
}

/** The trailing block: every frame while short, throttled once long. */
function TrailingBlock({
  source,
  components,
  rehypePlugins,
}: {
  source: string;
  components: Components;
  rehypePlugins: RehypePlugins;
}) {
  const small = source.length <= INLINE_PARSE_LIMIT;
  const [throttled, setThrottled] = useState(source);
  const latest = useRef(source);
  latest.current = source;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (small || timer.current !== null) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      setThrottled(latest.current);
    }, TRAILING_THROTTLE_MS);
  }, [small, source]);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
      // A remount (StrictMode) must be able to schedule again.
      timer.current = null;
    },
    [],
  );

  return (
    <MarkdownBlock
      source={small ? source : throttled}
      components={components}
      rehypePlugins={rehypePlugins}
    />
  );
}

/**
 * The split, at most once per frame while streaming and at once when settled.
 * The carry holds the settled blocks, so a frame parses only the growing tail.
 */
function useBlocks(source: string, streaming: boolean, whole: boolean): string[] {
  const carry = useRef<BlockSplit>(EMPTY_SPLIT);
  const [blocks, setBlocks] = useState<string[]>(() => {
    if (whole) return [source];
    carry.current = splitIncremental(source, EMPTY_SPLIT);
    return carry.current.blocks;
  });
  const frame = useRef<number | null>(null);
  const latest = useRef(source);
  latest.current = source;

  useEffect(() => {
    if (whole) return;
    const split = (text: string) => {
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
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      split(latest.current);
    });
  }, [source, streaming, whole]);

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        // A cancelled frame left recorded reads as pending forever, and every
        // later change would wait on it (StrictMode's remount hit this).
        frame.current = null;
      }
    },
    [],
  );

  return blocks;
}

export interface StreamingMarkdownProps {
  /** The markdown so far. */
  source: string;
  /** More is arriving: only the trailing block re-parses, and a caret follows it. */
  streaming?: boolean;
  /** Passed to react-markdown, e.g. `[rehypeHighlight]`. Keep the array's identity stable. */
  rehypePlugins?: RehypePlugins;
  /** Merged over the defaults (links open in a new tab). Keep the object's identity stable. */
  components?: Components;
  className?: string;
}

export function StreamingMarkdown({
  source,
  streaming = false,
  rehypePlugins,
  components,
  className,
}: StreamingMarkdownProps) {
  const merged = useMemo<Components>(
    () => (components ? { ...DEFAULT_COMPONENTS, ...components } : DEFAULT_COMPONENTS),
    [components],
  );
  // While streaming the definition may not have arrived yet, and block-level
  // rendering avoids a whole-message parse per frame; settled, render whole.
  const hasRefs = useMemo(() => hasReferenceDefinitions(source), [source]);
  const whole = hasRefs && !streaming;
  const blocks = useBlocks(source, streaming, whole);

  const last = blocks.length - 1;
  const trailingOpen = streaming && last >= 0 && isIncompleteCodeFence(blocks[last]!);

  return (
    <div data-slot="streaming-markdown" className={cn("prose-session", className)}>
      {whole ? (
        <MarkdownBlock source={source} components={merged} rehypePlugins={rehypePlugins} />
      ) : (
        blocks.map((block, i) =>
          streaming && i === last ? (
            trailingOpen ? (
              <OpenFence key={i} source={block} />
            ) : (
              <TrailingBlock
                key={i}
                source={block}
                components={merged}
                rehypePlugins={rehypePlugins}
              />
            )
          ) : (
            <MarkdownBlock
              key={i}
              source={block}
              components={merged}
              rehypePlugins={rehypePlugins}
            />
          ),
        )
      )}
      {streaming && !trailingOpen && <Caret />}
    </div>
  );
}

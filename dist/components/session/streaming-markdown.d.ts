import type { Components, Options } from "react-markdown";
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
export declare function StreamingMarkdown({ source, streaming, rehypePlugins, components, className, }: StreamingMarkdownProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=streaming-markdown.d.ts.map
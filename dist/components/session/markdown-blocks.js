// Block-level splitting for streaming markdown, ported from desktop's
// `src/lib/markdown-blocks.ts` (the design source, ADR-0027).
//
// Parse the source to an mdast
// (parse only — no rehype/highlight/sanitize, so it's cheap + linear) and slice
// it into its top-level blocks by source offset. A completed block's slice is
// byte-identical every frame, so rendering each block through the source-keyed
// `MarkdownBlock` memo makes completed blocks pure cache hits — only the
// trailing (still-streaming) block re-parses.
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
function buildParser() {
    return unified().use(remarkParse).use(remarkGfm);
}
let parser = null;
function getBlockParser() {
    if (!parser)
        parser = buildParser();
    return parser;
}
/**
 * Split a markdown source into its top-level block source strings. Returns
 * `[source]` (a single block) when there's nothing to split or on any parse
 * error — the caller renders that one block as a whole, which is always safe.
 */
export function splitTopLevelBlocks(source) {
    return splitFrom(source, 0, [], []).blocks;
}
export const EMPTY_SPLIT = { blocks: [], starts: [], windowStart: 0, source: "" };
/**
 * `splitTopLevelBlocks` for a source that is still growing, reusing `prev`.
 *
 * The whole-source parse this replaces ran once per animation frame while an
 * answer streamed, so a reply cost O(length) to split on every frame and
 * O(length²) over the turn — the parse the "only the trailing block re-parses"
 * design was meant to avoid, moved one layer down into the split itself.
 *
 * **Why one block of lookback is enough.** Appending to a markdown document can
 * only reach backwards as far as the block immediately before the last one:
 * `---` turns the paragraph *directly* above it into a setext heading, a lazy
 * continuation extends the paragraph it touches, and a list can only absorb
 * what follows it while nothing else has intervened (anything that intervened
 * already closed it). An unclosed fence is one block by construction, so the
 * tail is inside it and the window covers it. Keeping blocks up to
 * `windowStart` and re-parsing from there is therefore the same answer a full
 * parse gives, which `markdown-blocks.test.ts` checks block-for-block
 * against every prefix of documents containing each of those constructs — and
 * repeated and lookalike blocks, which is where a text-search version failed.
 *
 * Reuse is conditional on the settled prefix being unchanged — verified with a
 * string compare, which is on the order of a thousand times cheaper than the
 * parse it guards and is exact, so a source that was replaced rather than
 * appended to simply re-splits in full.
 */
export function splitIncremental(source, prev) {
    if (!source)
        return EMPTY_SPLIT;
    const reusable = prev.windowStart > 0 &&
        source.length >= prev.source.length &&
        source.startsWith(prev.source.slice(0, prev.windowStart));
    if (!reusable)
        return finish(source, splitFrom(source, 0, [], []));
    // Settled: every block that starts before the window. The last-but-one
    // block starts AT the window, so this is exactly blocks 0..n-3.
    let keep = 0;
    while (keep < prev.starts.length && prev.starts[keep] < prev.windowStart)
        keep++;
    return finish(source, splitFrom(source, prev.windowStart, prev.blocks.slice(0, keep), prev.starts.slice(0, keep)));
}
function finish(source, split) {
    const { blocks, starts } = split;
    const windowStart = starts.length >= 3 ? starts[starts.length - 2] : 0;
    return { blocks, starts, windowStart, source };
}
/** Parse `source` from `offset`, appending its blocks (and their absolute
 *  offsets) to the settled ones. */
function splitFrom(source, offset, settled, settledStarts) {
    if (!source)
        return { blocks: [], starts: [] };
    const tail = offset > 0 ? source.slice(offset) : source;
    try {
        const tree = getBlockParser().parse(tail);
        const children = tree.children ?? [];
        if (children.length <= 1 && settled.length === 0)
            return { blocks: [source], starts: [0] };
        const blocks = settled.slice();
        const starts = settledStarts.slice();
        for (const child of children) {
            const start = child.position?.start?.offset;
            const end = child.position?.end?.offset;
            if (start == null || end == null)
                continue;
            const block = tail.slice(start, end);
            if (block.trim().length > 0) {
                blocks.push(block);
                starts.push(offset + start);
            }
        }
        return blocks.length > 0 ? { blocks, starts } : { blocks: [source], starts: [0] };
    }
    catch {
        return settled.length > 0
            ? { blocks: [...settled, tail], starts: [...settledStarts, offset] }
            : { blocks: [source], starts: [0] };
    }
}
const REF_DEF = /^\s{0,3}\[[^\]]+\]:\s/m;
const FOOTNOTE_DEF = /^\s{0,3}\[\^[^\]]+\]:\s/m;
/**
 * True when the source uses reference-style link/image or footnote
 * *definitions* — the one case where independent per-block parsing loses
 * cross-block context. The caller falls back to a whole-message render. Rare in
 * agent output.
 */
export function hasReferenceDefinitions(source) {
    return REF_DEF.test(source) || FOOTNOTE_DEF.test(source);
}
/**
 * True when `block` opens a fenced code block that hasn't been closed yet — the
 * still-streaming trailing code block. Render it as plain text until the fence
 * closes so a growing code block doesn't re-highlight every frame (it snaps to
 * highlighted once complete).
 */
export function isIncompleteCodeFence(block) {
    const lines = block.split("\n");
    const first = (lines[0] ?? "").trimStart();
    const open = first.match(/^(`{3,}|~{3,})/);
    if (!open)
        return false;
    const fenceChar = open[1][0]; // ` or ~ (both are literal in regex)
    const minLen = open[1].length;
    const closeRe = new RegExp(`^\\s{0,3}${fenceChar}{${minLen},}\\s*$`);
    for (let i = 1; i < lines.length; i++) {
        if (closeRe.test(lines[i]))
            return false; // found the closing fence
    }
    return true; // opened, never closed
}
//# sourceMappingURL=markdown-blocks.js.map
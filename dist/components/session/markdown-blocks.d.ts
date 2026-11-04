/**
 * Split a markdown source into its top-level block source strings. Returns
 * `[source]` (a single block) when there's nothing to split or on any parse
 * error — the caller renders that one block as a whole, which is always safe.
 */
export declare function splitTopLevelBlocks(source: string): string[];
/**
 * A split, plus where the next one may resume from.
 *
 * `starts[i]` is the absolute source offset of `blocks[i]`. `windowStart` is
 * the offset of the LAST-BUT-ONE block. Everything before it is settled:
 * appending to the source cannot change those blocks, so the next split can
 * keep them and parse only from there.
 *
 * Offsets are carried rather than recovered by searching for the block's text:
 * a block that repeats (`ok` twice), or whose text is a prefix of a later block
 * (`foo` then `foo bar`), makes `indexOf` land on the wrong one — which
 * duplicated blocks and, worse, truncated the last one to its lookalike.
 */
export interface BlockSplit {
    blocks: string[];
    starts: number[];
    windowStart: number;
    /** The source this split describes — the next call checks it still prefixes. */
    source: string;
}
export declare const EMPTY_SPLIT: BlockSplit;
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
export declare function splitIncremental(source: string, prev: BlockSplit): BlockSplit;
/**
 * True when the source uses reference-style link/image or footnote
 * *definitions* — the one case where independent per-block parsing loses
 * cross-block context. The caller falls back to a whole-message render. Rare in
 * agent output.
 */
export declare function hasReferenceDefinitions(source: string): boolean;
/**
 * True when `block` opens a fenced code block that hasn't been closed yet — the
 * still-streaming trailing code block. Render it as plain text until the fence
 * closes so a growing code block doesn't re-highlight every frame (it snaps to
 * highlighted once complete).
 */
export declare function isIncompleteCodeFence(block: string): boolean;
//# sourceMappingURL=markdown-blocks.d.ts.map
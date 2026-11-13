/**
 * The one line a thinking block shows while collapsed: what the agent is
 * thinking about right now, not just that it is thinking.
 *
 * Reasoning streams as markdown, often as a run of short sections that each
 * open with a bold heading ("**Checking the cache key**"). The newest section
 * is the current thought, so this reads the last heading on a line of its
 * own. Reasoning with no headings gives the first sentence of its last
 * paragraph instead. Inline markdown is stripped. Null when there is nothing
 * worth showing yet.
 *
 * It runs on the live thought every streaming frame, so it only ever strips
 * a bounded slice of text, and its patterns stay linear.
 */
export declare function thoughtHeadline(markdown: string): string | null;
/**
 * The thought the agent is in the middle of, for the live row that shows it
 * open while it streams: the body of the newest bold-headed section (its
 * heading is the row's line, from `thoughtHeadline`), else the newest
 * paragraph. Only its tail, with inline markdown stripped — the row bottom-
 * aligns it, so the reader sees the words as they arrive. Null when there is
 * no body yet.
 */
export declare function liveThought(markdown: string): string | null;
//# sourceMappingURL=thought-headline.d.ts.map
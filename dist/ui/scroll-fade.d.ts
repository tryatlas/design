/** Which edges have content past them. Both false means nothing to scroll. */
export interface ScrollEdges {
    top: boolean;
    bottom: boolean;
}
/**
 * Whether a scroll container has content above and below its viewport.
 *
 * Re-measured on scroll and on resize, because a list can become scrollable
 * without anyone scrolling it (the panel narrows, a row grows, rows arrive).
 * `deps` is for the content: new rows change `scrollHeight` with no event of
 * their own.
 *
 * The 2px slack absorbs fractional scroll positions — at a UI scale the root
 * font size sets, `scrollTop + clientHeight` lands a hair short of
 * `scrollHeight` at the true bottom, which left the bottom fade on forever.
 */
export declare function useScrollEdges(ref: React.RefObject<HTMLElement | null>, deps: unknown[]): ScrollEdges;
/**
 * One edge fade. Absolutely positioned, so the scroll container needs a
 * `relative` ancestor that is NOT itself the scroller — inside the scroller the
 * fade would scroll away with the content.
 *
 * `className` supplies the gradient stops (`from-…`, `via-…`); everything else
 * — geometry, direction, the opacity transition — is fixed here so the two
 * edges of one list cannot drift apart.
 */
export declare function ScrollFade({ at, visible, className, }: {
    at: "top" | "bottom";
    visible: boolean;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=scroll-fade.d.ts.map
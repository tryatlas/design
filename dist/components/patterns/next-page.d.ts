/**
 * The end of an infinite list: asks for the next page as it comes into view
 * (a little before, so scrolling rarely meets it), shows the list's own
 * skeleton rows while it loads, and a retry if it failed. Nothing at all
 * once there is no next page.
 *
 * It owns no data and no fetching: the app's query says whether there is a
 * next page and whether it is loading or failed, and `onNext` asks for it
 * (TanStack Query's `fetchNextPage`, a cursor in a store). A failed page
 * stops the automatic asking, so a broken endpoint is not hammered by a
 * scroll; "Try again" asks once more.
 *
 * While the end stays in view after a page lands, it asks again, which is
 * what fills a tall viewport. So a page must move the cursor: a server that
 * answers an empty page with the same cursor and `hasNext` still true is
 * asked forever. Set `hasNext` false on an empty page if yours can.
 *
 *   <NextPage
 *     root={scrollerRef}
 *     hasNext={query.hasNextPage}
 *     fetching={query.isFetchingNextPage}
 *     failed={query.isFetchNextPageError}
 *     onNext={query.fetchNextPage}
 *     skeleton={<SessionRowSkeleton count={3} />}
 *     failure="Couldn't load more sessions."
 *   />
 */
export interface NextPageProps {
    /** The scrolling element the list lives in. Omitted, the viewport. */
    root?: React.RefObject<HTMLElement | null>;
    hasNext: boolean;
    fetching: boolean;
    failed: boolean;
    /** Ask for the next page. Need not be stable. */
    onNext: () => void;
    /** Rows shaped like the list's, shown while the next page loads. */
    skeleton?: React.ReactNode;
    /** What failed, in the list's own words. */
    failure: React.ReactNode;
    /** The retry button's label. */
    retryLabel?: string;
    /** How far ahead of the end to ask, as an IntersectionObserver margin. */
    rootMargin?: string;
}
declare function NextPage({ root, hasNext, fetching, failed, onNext, skeleton, failure, retryLabel, rootMargin, }: NextPageProps): import("react").JSX.Element | null;
export { NextPage };
//# sourceMappingURL=next-page.d.ts.map
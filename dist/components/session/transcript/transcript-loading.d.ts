/**
 * A transcript whose rows are still loading: a structural skeleton over the
 * transcript-width column, so opening a recorded session reads as "loading
 * messages" instead of a blank spinner. The bars are static (no animation),
 * with a slight width variation so they read as a list rather than a grid of
 * identical bars.
 */
export declare function LoadingTranscriptState({ rows }: {
    rows?: number;
}): import("react").JSX.Element;
/** The skeleton's rows alone, for a frame of the app's own. */
export declare function TranscriptSkeleton({ rows }: {
    rows?: number;
}): import("react").JSX.Element;
//# sourceMappingURL=transcript-loading.d.ts.map
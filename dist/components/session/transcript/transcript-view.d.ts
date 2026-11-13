import type { ReactNode, RefObject } from "react";
/** How far the header's blur band ramps BELOW the bar. Content must clear this
 *  too, or the first message renders permanently blurred. */
export declare const TOP_BLUR_RAMP = 34;
/** Without a header over it, only a short soft edge where rows scroll out
 *  under the bar. */
export declare const TOP_EDGE_RAMP = 16;
/** Breathing room between the last row and the composer. Applied as content
 *  padding rather than a spacer element so it scrolls with the thread and the
 *  bottom fade still has live content to dissolve into. */
export declare const BOTTOM_GAP = 28;
export interface TranscriptViewProps {
    scrollRef: RefObject<HTMLDivElement | null>;
    contentRef: RefObject<HTMLDivElement | null>;
    onScroll?: () => void;
    /** Vertical space (px) reserved at the top for a header floating over the
     *  transcript. `0` is no header: just a soft top edge. */
    topInset: number;
    /** No rows and no turn running: the "No messages yet." line. */
    empty: boolean;
    /** The mounted rows, as one memoised element list (`TranscriptRowItem`s).
     *  They must be direct children of the content element. */
    rowViews: ReactNode;
    turnInProgress: boolean;
    footer?: ReactNode;
    /** The live turn has produced nothing yet: show the working indicator. */
    working: boolean;
    workingEpoch?: number;
    workingLabel?: string;
    onStallRestart?: () => void;
    onStallSwitch?: () => void;
    onStallCopyDiagnostics?: () => void;
    /** Content below the viewport: the bottom fade shows. */
    more: boolean;
    /** The app's layers over the scroller, between it and the edge treatments
     *  (desktop: the selection actions and the turn rail). */
    overlays?: ReactNode;
}
/** The transcript's frame: the scroller, its padded content, the app's
 *  overlays and the two edge treatments. Props only: the app owns the rows,
 *  the scroll window and the jumps. */
export declare function TranscriptView({ scrollRef, contentRef, onScroll, topInset, empty, rowViews, turnInProgress, footer, working, workingEpoch, workingLabel, onStallRestart, onStallSwitch, onStallCopyDiagnostics, more, overlays, }: TranscriptViewProps): import("react").JSX.Element;
//# sourceMappingURL=transcript-view.d.ts.map
import type { SessionView } from "./session-view.ts";
import type { TurnRowProps } from "./turn-row.tsx";
/**
 * A whole session, read top to bottom: a head that says where it stands, then
 * every turn on a thin rail in the gutter. Desktop's session timeline: the
 * rail is a hairline with a node per turn, so the shape of the session scans
 * without reading a word and the prose keeps the column.
 *
 * Long sessions are windowed, not virtualised (`useWindow`): real DOM rows,
 * grown as the reader nears the edge, so a fast flick never shows blank space.
 * `grow="up"` is for a live session read newest-first, which opens at the
 * bottom and grows upward without moving what the reader is looking at.
 *
 * Only the first rows on screen fade in, once, as a CSS animation (it plays
 * while the app is busy loading the session, where a JS-driven one would drop
 * frames) and not at all under reduced motion. A row the window adds while
 * the reader scrolls is already where they are looking and appears as it is.
 */
export interface SessionTimelineProps extends Pick<TurnRowProps, "commentSlot" | "renderMarkdown" | "rehypePlugins" | "onLoadPayload" | "renderDiff" | "errorAction"> {
    session: SessionView;
    /** `down` (the default) for a record read from the top; `up` for a live session. */
    grow?: "down" | "up";
    className?: string;
}
export declare function SessionTimeline({ session, grow, className, ...rowProps }: SessionTimelineProps): import("react").JSX.Element;
//# sourceMappingURL=session-timeline.d.ts.map
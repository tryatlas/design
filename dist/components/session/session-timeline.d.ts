import type { ReactNode } from "react";
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
 *
 * Every other prop goes to each `TurnRow`. A turn holding a call in
 * `openToolCallIds` or `openToolRunIds`, or the item `revealItemId` names, is
 * drawn even past the window, so the host can scroll to it (a comment link
 * into turn 300).
 */
export interface SessionTimelineProps extends Pick<TurnRowProps, "commentSlot" | "renderMarkdown" | "rehypePlugins" | "onLoadPayload" | "renderDiff" | "errorAction" | "renderItemFooter" | "renderCheckpointFooter" | "clampResponses" | "toolRunSummary" | "openToolCallIds" | "onOpenToolCallIdsChange" | "thinkingLabel" | "thinkingBody" | "onOpenAttachment" | "onCopyPayload" | "onLoadBody" | "openToolRunIds" | "onOpenToolRunIdsChange"> {
    session: SessionView;
    /**
     * An item to keep drawn, by id: a prompt, an answer, a thought, a plan, a
     * tool call or a checkpoint. Its turn is drawn even past the window, a call
     * past its run's window is drawn, and a folded run holding it unfolds
     * (unless `openToolRunIds` is set, when the host decides). For a deep link:
     * set it, then scroll to the item. Like a held call, the reach it adds stays
     * once the id changes or clears.
     */
    revealItemId?: string;
    /**
     * The head: the phase ("Session complete"), the title and the agent line.
     * `false` for a host that draws its own title above the timeline; the rail
     * then starts at the first turn, and a session error still shows, as an
     * alert above it.
     */
    heading?: boolean;
    /**
     * The agent's mark, in the rail node of a turn the agent started on its own,
     * in place of the sparkle: desktop's session-detail rail, where the agent's
     * glyph identifies its turns. Pass a 16px glyph (`ModelMark`, a brand mark).
     */
    agentMark?: ReactNode;
    /**
     * The face of whoever prompted (the session's author), as the rail node of
     * each turn a person started, in place of the ringed person glyph: web's
     * reader drew it there. Pass a 32px avatar (`Avatar size="lg"`). Desktop's
     * rail keeps the glyph; leave this unset to match it.
     */
    authorFace?: ReactNode;
    /** `down` (the default) for a record read from the top; `up` for a live session. */
    grow?: "down" | "up";
    className?: string;
}
export declare function SessionTimeline({ session, grow, revealItemId, heading, agentMark, authorFace, className, ...rowProps }: SessionTimelineProps): import("react").JSX.Element;
//# sourceMappingURL=session-timeline.d.ts.map
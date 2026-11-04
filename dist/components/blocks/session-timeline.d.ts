import type { SessionStatus, TimelineEntry } from "../../lib/types.ts";
/**
 * A session's entries on a dashed rail with elbow connectors,
 * drawn from real timeline data.
 *
 * The rail is a dashed hairline; each entry hangs off it on a quarter-round
 * elbow (`rounded-bl-full` on a bordered box, which is the whole trick). The
 * head card carries the session's status glyph so the rail reads as one
 * story with a conclusion, not a list.
 */
declare function SessionTimeline({ status, entries, className, }: {
    status: SessionStatus;
    entries: Array<TimelineEntry>;
    className?: string;
}): import("react").JSX.Element;
export { SessionTimeline };
//# sourceMappingURL=session-timeline.d.ts.map
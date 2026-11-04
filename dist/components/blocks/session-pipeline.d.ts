import type { Session, TimelineEntry } from "../../lib/types.ts";
/**
 * A session as a pipeline of steps, drawn from real session data.
 *
 * Three visual states, and they are read by silhouette before colour: done
 * is a filled check with the title struck through and dimmed; the running
 * step is the one highlighted row with a slow dashed spinner; everything
 * after it sits at 40%. Only the running row gets the ring, so the eye
 * lands there first.
 */
declare function SessionPipeline({ session, entries, className, }: {
    session: Session;
    entries: Array<TimelineEntry>;
    className?: string;
}): import("react").JSX.Element;
export { SessionPipeline };
//# sourceMappingURL=session-pipeline.d.ts.map
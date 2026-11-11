import type { SessionView } from "./session-view.ts";
/**
 * A session as a pipeline of steps: the agent's plan when it keeps one,
 * otherwise every tool call in order.
 *
 * Three states, read by silhouette before colour: done is a filled check with
 * the title struck through and dimmed; the running step is the one ringed row
 * with a slow dashed spinner; everything still to come sits at 40%. Only the
 * running row gets the ring, so the eye lands there first. A failed call is
 * done, in the error ink.
 */
export interface SessionPipelineProps {
    session: SessionView;
    className?: string;
}
export declare function SessionPipeline({ session, className }: SessionPipelineProps): import("react").JSX.Element;
//# sourceMappingURL=session-pipeline.d.ts.map
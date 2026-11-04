import type { ReactNode } from "react";
import type { Options } from "react-markdown";
import type { CommentAnchor, DiffData, StreamingState, TurnView } from "./session-view.ts";
/**
 * One turn of a session: the prompt, what the agent did, the commits it made
 * and how it ended. Desktop's transcript turn, as a props-only view.
 *
 * The prompt is a right-aligned bubble, clamped to twelve whole lines behind
 * "Show more". The agent's work reads down the page in order: prose, a folded
 * "Thought process", runs of tool calls (a run longer than three folds behind
 * one counted line), the plan as a checklist. Checkpoints come last, as cards:
 * a commit is a boundary in the session, observed after the work that made
 * it. A failed turn ends on an error callout; an expired sign-in says so and
 * carries the app's action (`errorAction`), since the row cannot route.
 *
 * Nothing here reads a store or fetches. Comments come in through
 * `commentSlot`, anchored to the prompt, each answer, call and checkpoint.
 *
 * Memoised: keep the callbacks and `rehypePlugins` stable and pass the same
 * `turn` object while it is unchanged, and a streaming frame re-renders only
 * the turn that is streaming.
 */
type RehypePlugins = Options["rehypePlugins"];
export interface TurnRowProps {
    turn: TurnView;
    /** The session's streaming state, passed to the last turn only. */
    streaming?: StreamingState;
    /** The app's comment control, beside each anchorable thing. */
    commentSlot?: (anchor: CommentAnchor) => ReactNode;
    /** Renders prose. Defaults to `StreamingMarkdown`. */
    renderMarkdown?: (source: string, streaming: boolean) => ReactNode;
    /** For the default `renderMarkdown`, e.g. `[rehypeHighlight]`. */
    rehypePlugins?: RehypePlugins;
    /** A truncated payload's "Load full …". */
    onLoadPayload?: (callId: string, part: "input" | "output") => void;
    renderDiff?: (diff: DiffData) => ReactNode;
    /** Inside a failed turn's callout: what the person can do (sign in again). */
    errorAction?: ReactNode;
    className?: string;
}
export declare const TurnRow: import("react").MemoExoticComponent<({ turn, streaming, commentSlot, renderMarkdown, rehypePlugins, onLoadPayload, renderDiff, errorAction, className, }: TurnRowProps) => import("react").JSX.Element>;
export {};
//# sourceMappingURL=turn-row.d.ts.map
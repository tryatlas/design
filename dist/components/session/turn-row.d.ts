import type { ReactNode } from "react";
import type { Options } from "react-markdown";
import type { AgentItem, AttachmentView, CheckpointView, CommentAnchor, DiffData, StreamingState, TurnView } from "./session-view.ts";
import type { ToolCallCardProps } from "./tool-call-card.tsx";
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
    /** Under the prompt and under each agent item (each call, in a run), outside any disclosure. */
    renderItemFooter?: (item: AgentItem | {
        kind: "user";
        id: string;
    }) => ReactNode;
    /**
     * Under each checkpoint card: `renderItemFooter`'s counterpart for commits
     * (a separate prop, so existing `renderItemFooter` handlers keep their type).
     */
    renderCheckpointFooter?: (checkpoint: CheckpointView) => ReactNode;
    /** Tool calls held open; a run holding one unfolds. Pair with `onOpenToolCallIdsChange`. */
    openToolCallIds?: ReadonlySet<string>;
    /** A card was toggled: the next set, with its id added or removed. */
    onOpenToolCallIdsChange?: (next: ReadonlySet<string>) => void;
    /** The thinking disclosure's label. Defaults to "Thinking…" while it streams, else "Thought process". */
    thinkingLabel?: (state: {
        streaming: boolean;
    }) => ReactNode;
    /** How an opened thought renders: as plain text (the default) or as markdown. */
    thinkingBody?: "markdown" | "text";
    /** Makes each prompt image and file a button that opens it. */
    onOpenAttachment?: (attachment: AttachmentView, index: number) => void;
    /** Passed to each `ToolCallCard`: Copy on each text payload. */
    onCopyPayload?: ToolCallCardProps["onCopy"];
    /**
     * A truncated prompt's or answer's "Read the rest": asks the app for the
     * whole body by the item's id. The item's `load` shows the fetch in flight
     * and a failure (clicking again retries). Unset, a truncated body says
     * "Truncated".
     */
    onLoadBody?: (id: string) => void;
    /**
     * Folded runs held open, by call id: a run of more than three calls is open
     * while it holds any of these. Unset, each run folds itself (and unfolds
     * when `openToolCallIds` starts to hold one of its calls). Set, the host
     * decides alone; pair it with `onOpenToolRunIdsChange`, or the runs cannot
     * be toggled.
     */
    openToolRunIds?: ReadonlySet<string>;
    /** A run was toggled: unfolding adds its first call's id, folding removes all of its ids. */
    onOpenToolRunIdsChange?: (next: ReadonlySet<string>) => void;
    /**
     * A tool call to keep drawn, by id: drawn even past its run's window, and an
     * uncontrolled folded run holding it unfolds. `SessionTimeline` passes its
     * own `revealItemId` to the turn that holds it.
     */
    revealItemId?: string;
    /**
     * Clamps each long answer to 340px behind "Show more", fading out under
     * the button: desktop's session-detail clamp. An answer only a little over
     * (up to 400px) shows whole, and one still streaming is never clamped.
     */
    clampResponses?: boolean;
    /**
     * What a folded run's line says after its count. `kinds` (the default):
     * "3 edited · 4 read · 2 ran". `files`, desktop's session-detail line: the
     * distinct files it modified and read, then the lines its edits added and
     * removed (`+40 −12`, from each edit's `diffs`). A failed edit counts for
     * nothing, and a run that modified and read nothing (only commands, say)
     * shows its count alone, as desktop's does.
     */
    toolRunSummary?: "kinds" | "files";
    className?: string;
}
export declare const TurnRow: import("react").MemoExoticComponent<({ turn, streaming, commentSlot, renderMarkdown, rehypePlugins, onLoadPayload, renderDiff, errorAction, renderItemFooter, renderCheckpointFooter, openToolCallIds, onOpenToolCallIdsChange, thinkingLabel, thinkingBody, onOpenAttachment, onCopyPayload, onLoadBody, openToolRunIds, onOpenToolRunIdsChange, revealItemId, clampResponses, toolRunSummary, className, }: TurnRowProps) => import("react").JSX.Element>;
export {};
//# sourceMappingURL=turn-row.d.ts.map
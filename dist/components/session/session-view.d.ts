/**
 * SessionView: the one presentational shape every session block renders.
 *
 * Desktop renders a session from the session-delta wire and web from the
 * server's `TimelineEntry` pages. Neither shape reaches the blocks: each app
 * writes an adapter onto this one, so "web matches desktop" holds by
 * construction rather than by two transcripts happening to agree. Nothing here
 * imports either side's contract types; this file is the contract.
 *
 * A field only one source can supply is optional, and no id exists on only one
 * side: item ids are the message or entry ids both already have, which is what
 * comments anchor to.
 *
 * Where each source field lands, for adapter authors:
 *
 * | Source                                                  | SessionView                                                        |
 * | ------------------------------------------------------- | ------------------------------------------------------------------ |
 * | web `SessionSummary.title` / `agent` / `model`          | `SessionMeta.title` / `agent` / `model`                            |
 * | web `SessionSummary.number` (as `ses-N`)                | `SessionMeta.ref`                                                  |
 * | web `SessionSummary.workspaceSlug`                      | `SessionMeta.workspace`                                            |
 * | web `SessionSummary.branches[0]`                        | `SessionMeta.branch`                                               |
 * | web `SessionSummary.startedAt` / `lastActivityAt`       | `SessionMeta.startedAt` / `lastActivityAt`                         |
 * | web `SessionSummary.activeSeconds`                      | `SessionMeta.activeSeconds`                                        |
 * | web `SessionSummary.inputTokens` … `totalTokens`        | `SessionMeta.tokens`                                               |
 * | web `SessionSummary.contextUsed` / `contextSize`        | `SessionMeta.context` (only when both are non-null)                |
 * | web `SessionSummary.insertions` / `deletions` / `filesTouched` | `SessionMeta.diffStat`                                      |
 * | web `SessionSummary.messageCount` / `toolCallCount` / `checkpointCount` | `SessionMeta.counts`                               |
 * | web `SessionSummary.incomplete`                         | `SessionMeta.incomplete`                                           |
 * | web `SessionSummary.live`                               | `SessionView.phase` (`running` when live, else `done`)             |
 * | web `TimelineEntry.turnSeq`                             | `TurnView.key` (`turn-${turnSeq}`)                                 |
 * | web `TimelineEntry` `prompt`                            | `TurnView.user` (`id`, `text`, `at`, `truncated`)                  |
 * | web `TimelineEntry` `response` / `thinking`             | `AgentItem` `text` / `thinking`                                    |
 * | web `TimelineEntry` `tool_call`                         | `AgentItem` `tool` → `ToolCallView`                                |
 * | web `toolName` / `toolTitle` / `toolStatus` / `paths`   | `ToolCallView.name` / `title` / `status` / `paths`                 |
 * | web `toolName`                                          | `ToolCallView.kind` via `toolKindOf(name)`                         |
 * | web `arguments` + `argumentsTruncated` + `argumentsBytes` | `ToolCallView.input` (`text`, `truncated`, `bytes`)              |
 * | web `result` + `resultTruncated` + `resultBytes`        | `ToolCallView.output` (`text`, `truncated`, `bytes`)               |
 * | web `resultBinary`                                      | `Payload.binary` on `output`                                       |
 * | web `TimelineEntry` `checkpoint`                        | `TurnView.checkpoints[]` (`commitSha`, `branch`, `linkState`, `insertions`, `deletions`, `files`) |
 * | web `ArtifactComment` (anchors other than `thread_range`) | `CommentView`; `guestName` → `PersonRef { name, guest: true }`   |
 * | desktop `SessionStatus` idle / running / waiting / error | `SessionView.phase` `done` / `running` / `waiting` / `failed`     |
 * | desktop `Message` (role `user`) `id`                    | `TurnView.key` and `TurnView.user.id`                              |
 * | desktop `Message.images [{ mime_type, data }]`          | `TurnView.user.attachments` (`src` = `data:${mime_type};base64,${data}`) |
 * | desktop `Message.content` (assistant, mode text)        | `AgentItem` `text` (`id` = message id)                             |
 * | desktop `Message.model`                                 | `AgentItem` `text`.`model`                                         |
 * | desktop `Message.thinking` / `ThinkingChunk`            | `AgentItem` `thinking`                                             |
 * | desktop `Message.plan` / `PlanUpdated [PlanEntry]`      | `AgentItem` `plan` and `SessionView.plan`                          |
 * | desktop `Message.worked_ms`                             | `TurnView.durationMs`                                              |
 * | desktop `ToolCall.tool_name` / `title` / `status`       | `ToolCallView.name` / `title` / `status`                           |
 * | desktop `ToolCall.kind` (ACP)                           | `ToolCallView.kind` via `toolKindOf(name, kind)`                   |
 * | desktop `ToolCall.locations[].path`                     | `ToolCallView.paths`                                               |
 * | desktop `ToolCall.arguments` (JSON)                     | `ToolCallView.input.text` (stringified)                            |
 * | desktop `ToolCall.result` / `ToolCallOutputChunk`       | `ToolCallView.output.text`                                         |
 * | desktop `ToolCall.started_at_ms` / `ended_at_ms`        | `ToolCallView.at` / `durationMs`                                   |
 * | desktop `content_blocks` `Diff { path, oldText, newText }` | `ToolCallView.diffs[]` (`DiffData`)                             |
 * | desktop `content_blocks` `Terminal { terminalId }`      | `ToolCallView.terminal` (the terminal's output, read by the adapter) |
 * | desktop `TextChunk` (the item it extends)               | `StreamingState.itemId`, `activity: "text"`                        |
 * | desktop `RetryStatus`                                   | `StreamingState.retry`                                             |
 * | desktop `Compaction`                                    | `StreamingState.compacting`                                        |
 * | desktop `ContextUsage`                                  | `SessionMeta.context`                                              |
 * | desktop `UsageUpdated` (`Usage`)                        | `SessionMeta.tokens` and `SessionMeta.cost`                        |
 * | desktop `TitleUpdated`                                  | `SessionMeta.title`                                                |
 * | desktop `TurnFinished { stop_reason }`                  | `TurnView.outcome` `finished` (`cancelled` when it says so)        |
 * | desktop `TurnFailed { error, error_kind }`              | `TurnView.outcome` `failed`, `SessionErrorView.kind` = `error_kind` |
 * | desktop `AgentDisconnected`                             | `SessionView.error` with `ErrorKind` `"disconnected"`              |
 */
/** Where a session is. `waiting` is paused on the person (a permission, a plan). */
export type SessionPhase = "queued" | "running" | "waiting" | "done" | "failed" | "cancelled";
/** ACP's tool kinds plus `other`. `toolKindOf` folds an agent's tool name onto one. */
export type ToolKind = "read" | "edit" | "delete" | "move" | "search" | "execute" | "think" | "fetch" | "other";
export type ToolStatus = "pending" | "running" | "completed" | "failed";
/** Desktop's `TurnFailed.error_kind`, plus `disconnected` for `AgentDisconnected`. */
export type ErrorKind = "auth" | "transient" | "fatal" | "process_dead" | "disconnected" | "unknown";
export interface PersonRef {
    name: string;
    image?: string | null;
    /** Commented through a share link rather than as a member. */
    guest?: boolean;
}
export interface SessionMeta {
    title?: string;
    /** The short handle, `ses-5123`. */
    ref?: string;
    agent?: string;
    model?: string;
    branch?: string;
    workspace?: string;
    author?: PersonRef;
    startedAt?: string;
    lastActivityAt?: string;
    activeSeconds?: number;
    tokens?: {
        input?: number;
        output?: number;
        cacheRead?: number;
        cacheCreation?: number;
        total?: number;
    };
    /** Context-window occupancy: tokens used of the window's size. */
    context?: {
        used: number;
        size: number;
    };
    cost?: {
        amount: number;
        currency?: string;
    };
    diffStat?: {
        insertions: number;
        deletions: number;
        files?: number;
    };
    counts?: {
        messages?: number;
        toolCalls?: number;
        checkpoints?: number;
    };
    /** Parts of the session are missing rather than empty (web's placeholder sessions). */
    incomplete?: boolean;
}
/** A recorded payload: a tool call's input or output. */
export interface Payload {
    /** `null` when nothing is held locally (binary, or not yet loaded). */
    text: string | null;
    /** `text` is a preview; the full body can be loaded (`onLoadPayload`). */
    truncated?: boolean;
    /** Size of the full body. */
    bytes?: number;
    binary?: boolean;
}
/** One file's change. Named `DiffData`, not `DiffView`: `DiffView` is the diff component's name. */
export interface DiffData {
    path: string;
    oldText?: string;
    newText?: string;
    /** A unified patch, when the source has one rather than the two texts. */
    patch?: string;
    insertions?: number;
    deletions?: number;
    change?: "added" | "modified" | "deleted";
}
export interface TerminalView {
    command?: string;
    /** Raw output; ANSI escapes are stripped when drawn. */
    output: string;
    exitCode?: number;
}
export interface ToolCallView {
    /** The tool call's id on both sides; comments anchor to it. */
    id: string;
    /** The agent's own tool name (`Bash`, `str_replace_editor`). */
    name: string;
    /** The agent's one-line title for this call, when it gave one. */
    title?: string;
    kind: ToolKind;
    status: ToolStatus;
    at?: string;
    durationMs?: number;
    paths?: string[];
    input?: Payload;
    output?: Payload;
    diffs?: DiffData[];
    /** A command's run. When present it is drawn instead of `output`. */
    terminal?: TerminalView;
}
export interface AttachmentView {
    kind: "image" | "file";
    name?: string;
    mimeType?: string;
    /** A URL, or a `data:` URL (desktop builds one from `{ mime_type, data }`). */
    src?: string;
    bytes?: number;
}
export interface PlanItem {
    content: string;
    status: "pending" | "in_progress" | "completed";
    priority?: string;
}
/**
 * One thing the agent did in a turn, in order. `id` is the message or entry id
 * both sides already have, which is what a comment anchors to.
 */
export type AgentItem = {
    kind: "text";
    id: string;
    text: string;
    truncated?: boolean;
    model?: string;
    at?: string;
} | {
    kind: "thinking";
    id: string;
    text: string;
    truncated?: boolean;
    at?: string;
} | {
    kind: "tool";
    call: ToolCallView;
} | {
    kind: "plan";
    id: string;
    items: PlanItem[];
};
/** A commit the session produced. */
export interface CheckpointView {
    id: string;
    at?: string;
    commitSha?: string;
    subject?: string;
    branch?: string;
    /** `orphaned`: the commit is no longer in history (rewritten or squashed). */
    linkState?: "linked" | "orphaned";
    insertions?: number;
    deletions?: number;
    files?: string[];
}
export interface SessionErrorView {
    message: string;
    kind?: ErrorKind;
}
export interface TurnView {
    /**
     * Minted by the adapter and stable across re-projections, so a re-render
     * never remounts a turn: desktop uses the turn's user message id, web uses
     * `turn-${turnSeq}`.
     */
    key: string;
    /** The prompt that opened the turn; absent for a turn the agent started. */
    user?: {
        /** The message or entry id; comments anchor to it. */
        id: string;
        text: string;
        at?: string;
        truncated?: boolean;
        attachments?: AttachmentView[];
    };
    items: AgentItem[];
    /** Drawn after the items: a commit is observed after the work that made it. */
    checkpoints?: CheckpointView[];
    /** Absent while the turn is still running. */
    outcome?: {
        kind: "finished" | "failed" | "cancelled";
        stopReason?: string;
        error?: SessionErrorView;
    };
    /** How long the agent worked on the turn. */
    durationMs?: number;
}
/** What is arriving right now. Desktop only; web sessions are read after the fact. */
export interface StreamingState {
    /** The item whose text is still growing. */
    itemId?: string;
    activity?: "thinking" | "text" | "tool" | "waiting";
    retry?: {
        attempt: number;
        maxAttempts: number;
        delayMs: number;
        lastError: string;
    };
    compacting?: boolean;
}
/**
 * What a comment hangs off. Web's `thread_range` anchor is excluded: it belongs
 * to shared threads, not sessions.
 */
export type CommentAnchor = {
    kind: "session" | "message" | "tool_call" | "checkpoint";
    id: string;
};
export interface CommentView {
    id: string;
    anchor: CommentAnchor;
    parentId: string | null;
    author: PersonRef;
    /** `null` once deleted. */
    body: string | null;
    createdAt: string;
    editedAt?: string | null;
    resolvedAt?: string | null;
    votes?: {
        up: number;
        down: number;
    };
}
export interface SessionView {
    meta: SessionMeta;
    phase: SessionPhase;
    turns: TurnView[];
    /** The agent's current plan, when it keeps one. */
    plan?: PlanItem[];
    /** Only for a session that is running now. */
    streaming?: StreamingState;
    /** A session-level failure (a dead or disconnected agent), not one turn's. */
    error?: SessionErrorView;
    comments?: CommentView[];
}
//# sourceMappingURL=session-view.d.ts.map
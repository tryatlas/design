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
export {};
//# sourceMappingURL=session-view.js.map
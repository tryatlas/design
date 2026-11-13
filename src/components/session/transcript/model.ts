/**
 * The transcript's row model: a session projected into a closed set of row
 * kinds, each carrying everything its view needs. Desktop's transcript and
 * web's session reader and remote-control view all render these.
 *
 * Nothing here knows either app's wire. Each app writes the projection from
 * its own data (desktop's `projectRows` over the session-delta messages; web's
 * adapters over `TimelineEntry` pages and the remote-control transcript), so
 * the row views are the one place a transcript's look is decided. The
 * vocabulary is closed on purpose: a new row kind is a deliberate addition to
 * what a transcript can say, not an ad-hoc branch in a render function.
 *
 * Rows are plain data compared shallowly by the views' `memo`, so a projection
 * that hands back the previous object for an unchanged row keeps its view from
 * re-rendering.
 */

/** An image sent with a prompt: its MIME type and its bytes, base64. */
export interface TranscriptImage {
  mimeType: string;
  dataBase64: string;
}

/** One file a turn read or modified, with edit line counts (0 for reads). */
export interface TranscriptFile {
  path: string;
  kind: "read" | "edit";
  added: number;
  removed: number;
  /** For edits only: the file was created new. Undefined for reads. */
  created?: boolean;
  /** For a renamed file, the path it had before; `path` is where it went. */
  movedFrom?: string;
}

/** Something outside the conversation that cut into a turn: today, the
 *  computer sleeping mid-reply. */
export interface TranscriptInterruption {
  cause: "sleep";
  /** How long the machine was asleep. */
  sleptSecs: number;
  /** How the turn ended after it. */
  outcome: "finished" | "failed" | "stopped" | "disconnected";
  /** The agent's own error, for `failed`: kept for diagnosis, shown folded. */
  error?: string;
}

/** What sent a prompt Atlas wrote on its own. */
export type InjectedPromptSource = "pull-request-watch" | "restart";

/** How a user-role message came from Atlas rather than the user. */
export interface InjectedPrompt {
  source: InjectedPromptSource;
  /** One line for the row (`#12: checks failed`). */
  summary: string;
}

/** Where a delegated child agent is. A child the parent interrupted is
 *  neither completed nor failed. */
export type SubagentStatus = "running" | "completed" | "failed" | "interrupted";

// ── Row kinds ──────────────────────────────────────────────────────────────

export const RowKind = {
  User: 0,
  Prose: 1,
  Thinking: 2,
  Marker: 3,
  MarkerGroup: 4,
  Separator: 5,
  TurnFooter: 6,
  WorkHeader: 7,
  Subagent: 8,
  Interruption: 9,
  Injected: 10,
} as const;

/** Marker execution state — drives the leading glyph, nothing else. */
export type MarkerState = "pending" | "running" | "done" | "failed";

/** What a marker click opens in the detail panel. */
export type MarkerDetail = "diff" | "output" | "none";

interface RowBase {
  /** Stable across projections: the list keys on this. */
  id: string;
  turnId: string;
  /** True for the first row of its turn (anchor target for scroll/expand). */
  firstInTurn: boolean;
}

export interface UserRow extends RowBase {
  kind: typeof RowKind.User;
  text: string;
  /** Heavy @-mention context, collapsed behind a chip. */
  contextBlocks: number;
  /** Set once the user has expanded a clamped bubble. Expanding swaps the row
   *  for a taller one — a data change with a known new height, never a reflow. */
  expanded: boolean;
  /** The images sent with the prompt, shown as tiles above the bubble. */
  attachments: readonly TranscriptImage[];
  /** The remote-control driver who sent it, when it was not this window's
   *  composer: shown under the bubble so the thread says whose prompt it was.
   *  The name the wire carried, or "Someone else" — the room never names a
   *  user, so the row resolves `remoteAuthorId` against the roster first. */
  remoteAuthor: string | null;
  /** Their principal id, for a face and a real name (`useRcPeople`). */
  remoteAuthorId: string | null;
  timestamp: string;
  /** `timestamp` is only when Atlas replayed the message; show no clock. */
  timestampApproximate?: true;
  /** The outside paths the composer attached, the only ones a click in this
   *  bubble may open. */
  trustedPaths?: readonly string[];
}

/** The message id behind a user row. Row ids are minted as `u:<messageId>`
 *  by the projection; anything that has to address the
 *  MESSAGE (pins, jumps) goes through this rather than slicing the prefix at
 *  the call site. */
export function userRowMessageId(rowId: string): string {
  return rowId.startsWith("u:") ? rowId.slice(2) : rowId;
}

export interface ProseRow extends RowBase {
  kind: typeof RowKind.Prose;
  text: string;
  /** The live streaming tail; the only row whose content changes per frame. */
  streaming: boolean;
  /** Shown on the first prose row of an assistant turn. */
  showHeader: boolean;
  model: string | null;
  timestamp: string;
  /** `timestamp` is only when Atlas replayed the message; show no clock. */
  timestampApproximate?: true;
  /** Set on the turn's last response when the turn ends on a footer row: its
   *  hover footer (copy, branch, pin, time) moves below the changed-files card,
   *  to the end of the response, and this row reserves no gap for it. */
  footerBelow?: true;
}

export interface ThinkingRow extends RowBase {
  kind: typeof RowKind.Thinking;
  /** The full reasoning, only while the reader has the row open. Collapsed it
   *  is empty, so a streaming thought re-renders its row when the headline
   *  changes rather than on every chunk. */
  text: string;
  /** What the agent is thinking about, from `thoughtHeadline`. */
  headline: string | null;
  /** The thought as it arrives, from `liveThought`: set only while this is
   *  the turn's current step — streaming, with no tool call or answer after
   *  it yet. The row shows it open, then folds to `headline` the moment the
   *  agent moves on. */
  live: string | null;
  streaming: boolean;
  expanded: boolean;
}

/**
 * Which glyph a marker row leads with — a closed set, mapped to an icon by the
 * renderer.
 *
 * A key rather than a component: rows are plain data compared shallowly by
 * `memo`, and a freshly-minted component reference per projection would miss
 * on every row, every frame. It is also the reason this lives here and not in
 * the render layer — classification already happens once, in `markerFor`, from
 * the same signals that pick the verb.
 */
export type MarkerTool =
  | "run"
  | "read"
  | "edit"
  | "search"
  | "list"
  | "fetch"
  | "think"
  | "delete"
  | "move"
  | "file"
  | "org"
  | "memory"
  | "browser"
  | "tool";

export interface MarkerRow extends RowBase {
  kind: typeof RowKind.Marker;
  /** Verb shown in muted weight: "Ran", "Read", "Edited", "Searched". */
  verb: string;
  /** Icon key for the leading slot, paired with `verb`. */
  tool: MarkerTool;
  /** Monospace remainder — the command, path or pattern. Truncated in CSS. */
  detail: string;
  state: MarkerState;
  toolCallId: string;
  opens: MarkerDetail;
  /** Full path for edit markers — `detail` is shortened for display, and the
   *  diff viewer needs the real one. */
  path?: string;
  /** The untouched shell command, on bash rows whose verb came from parsing it.
   *  `detail` shows the file those rows read, not the command that read it, so
   *  this is what the hover title falls back to — the information the
   *  reclassification hid has to stay reachable without opening the panel. */
  cmd?: string;
  /** The MCP server the call went to, in words ("browser", "github"), for
   *  calls Atlas has no verb for. A block counts these per server: "Used
   *  browser 2 times" says more than "Used 2 tools". */
  server?: string;
  /** Only set for edit markers, so the row can show `+n −m` inline. */
  added: number;
  removed: number;
  /** Epoch ms the call was first seen (desktop: `ToolCallDisplay.startedAt`). Feeds the
   *  live elapsed figure; nothing settled reads it. */
  startedAt: number | undefined;
  /** How long the call took, once it settled — set only when both ends were
   *  stamped. An expanded block shows it in the right gutter for calls that
   *  took a second or more. Derived from the call, so a segment that holds
   *  holds this too. */
  durationMs?: number;
}

export interface MarkerGroupRow extends RowBase {
  kind: typeof RowKind.MarkerGroup;
  /** The whole block as one counted sentence: "Ran 3 commands and read 2
   *  files". See "Folded-block summary". */
  summary: string;
  /** How many tool calls the block stands for. Not rendered — the summary is
   *  the whole line — but it is what `summary` was counted from, and the thing
   *  to assert on when testing that projection. */
  count: number;
  /** The glyph for the whole block: the icon of the group `summary` names
   *  first. */
  tool: MarkerTool;
  /** Calls in this consecutive sequence, shown inside the disclosure. */
  markers: MarkerRow[];
  open: boolean;
  /** At least one call in the sequence is still active. */
  running: boolean;
  liveLabel: string | null;
  /** The active call's own glyph while `running` — the live line names that
   *  call, so it wears that call's icon rather than the block's. */
  liveTool: MarkerTool | null;
  /** Epoch ms the active call started, for the ticking figure in the live line's
   *  right gutter. The turn header above already counts the whole turn; this
   *  answers the different question a folded block otherwise hides — how long
   *  THIS command has been going, and therefore whether it is stuck. */
  liveStartedAt: number | null;
  /** Calls in this block already finished, shown beside the live line.
   *
   *  Deliberately not "3 of 6": tool calls stream in one at a time, so the
   *  total does not exist until the block ends. Counting what is DONE is the
   *  only honest progress a collapsed block can report, and it is the whole of
   *  the accumulation a one-line live state can show. */
  liveDone: number;
}

/**
 * "Working for 46s" / "Worked for 7m 37s ›" — the head of an assistant turn.
 *
 * Once the turn settles, everything before its final answer (earlier prose,
 * thinking, tool blocks) is folded behind this row and simply not projected, so
 * a finished turn costs a header, its answer and its footer however much work
 * it did. Opening it puts those rows back in the thread, in flow.
 */
export interface WorkHeaderRow extends RowBase {
  kind: typeof RowKind.WorkHeader;
  /** The turn is still running: the row ticks and nothing is folded. */
  live: boolean;
  /** Epoch ms the live clock counts from — the user's message. */
  startedAt: number | null;
  /** Settled wall time, when Rust timed the turn (desktop: `ChatMessage.workedMs`). */
  workedMs: number | null;
  /** The user stopped the turn (`ChatMessage.stopReason` is `cancelled`):
   *  the settled label reads "Stopped after" rather than "Worked for". */
  stopped: boolean;
  /** There are rows behind the header to fold; without them it is a caption. */
  foldable: boolean;
  open: boolean;
}

/**
 * A child agent the turn delegated to — the launching tool call, rendered as
 * the child rather than as the call.
 *
 * The call that spawns a subagent is a poor row: its name is the agent's word
 * for the mechanism ("Task", "spawn_agent", "Start subagent counter") and its
 * result is a transport detail. The child is the thing the reader is following,
 * so the row carries the child's name, status and work instead, and the launch
 * survives only as the identity (`toolCallId`).
 *
 * Deliberately NOT folded into a `MarkerGroup`. A folded block says "loaded
 * tools" and hides how many agents are running and whether any has come back —
 * which is the whole question a delegating turn raises.
 */
export interface SubagentRow extends RowBase {
  kind: typeof RowKind.Subagent;
  /** The launching call's id — the child's identity, and what its own calls
   *  point back to (`ToolCallDisplay.parentToolCallId`). */
  toolCallId: string;
  name: string;
  status: SubagentStatus;
  /** The child's role, when the launch named one: Claude's `subagent_type`,
   *  the engine's `agent_type`. */
  role: string | undefined;
  /** What it was asked to do, for the row's second line. */
  prompt: string | undefined;
  /** What it reported back. For a mail child (the native engine's) this is the
   *  whole of what it ever says. */
  result: string | undefined;
  /** Epoch ms the launch was first seen — the live elapsed figure counts from
   *  here, exactly as a marker's does. */
  startedAt: number;
  /** Set once it has ended, so a settled row states a duration rather than
   *  ticking forever. */
  endedAt: number | undefined;
  /** Its own tool calls, when the agent attributes them. ALWAYS EMPTY for a
   *  mail child, whose calls run on a thread this session never sees — so an
   *  empty list is "not visible", never "did nothing". */
  markers: MarkerRow[];
  /** How many calls the CHILD reports having made, which is not
   *  `markers.length`: the agent can count work whose calls it never attributed
   *  to this session. Zero means "nothing visible", so a row renders no count
   *  rather than "0" — which would be a claim about the child that is false. */
  workCount: number;
}

export interface SeparatorRow extends RowBase {
  kind: typeof RowKind.Separator;
  label: string;
}

export interface TurnFooterRow extends RowBase {
  kind: typeof RowKind.TurnFooter;
  /** The turn's frozen `turnSummary.files`, by identity: the same array every
   *  projection, so a settled turn's changed-files card never re-renders. */
  files: readonly TranscriptFile[];
  repoAtTurn: boolean;
  /** The turn's stable key (`stableTurnKey`): what the card opens and
   *  remembers its folders by, since `turnId` changes when the log reloads. */
  turnKey: string;
  /** Message id, so the footer can reach usage/suggestions/contextUsage. */
  messageId: string;
  hasSuggestions: boolean;
  contextChip: boolean;
  /** The turn's last response, whose hover footer this row draws after the
   *  card (that prose row carries `footerBelow`). Flat fields rather than one
   *  object so the shallow row comparison keeps a settled footer row stable. */
  responseRowId?: string;
  responseText?: string;
  responseTimestamp?: string;
  /** False when the response's header line already shows the time. */
  responseShowTimestamp?: boolean;
}

/** A prompt Atlas sent the agent on its own (`ChatMessage.injected`): a user
 *  turn, but not the user's words, so not drawn as their bubble. */
export interface InjectedRow extends RowBase {
  kind: typeof RowKind.Injected;
  injected: InjectedPrompt;
  /** The prompt as the agent received it, shown when the row is opened. */
  text: string;
  timestamp: string;
}

/** Something outside the conversation cut into this turn (`TurnInterruption`).
 *  Its own row, after the footer, so it reads as Atlas speaking about the turn
 *  rather than as more of the reply. */
export interface InterruptionRow extends RowBase {
  kind: typeof RowKind.Interruption;
  interruption: TranscriptInterruption;
  /** True when this is the thread's last turn — the only one whose Retry and
   *  Continue would act on the reply the row is about. */
  latest: boolean;
}

export type Row =
  | UserRow
  | InjectedRow
  | InterruptionRow
  | ProseRow
  | ThinkingRow
  | MarkerRow
  | MarkerGroupRow
  | SeparatorRow
  | TurnFooterRow
  | WorkHeaderRow
  | SubagentRow;

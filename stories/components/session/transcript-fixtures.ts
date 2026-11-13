// Transcript rows for the stories: what a projection hands the views, built
// by hand. Open state is applied by `withOpen`, so a story can toggle blocks
// the way an app does (the app owns the sets; the rows carry the flags).

import {
  liveMarkerLabel,
  RowKind,
  summarizeMarkers,
  type MarkerGroupRow,
  type MarkerRow,
  type MarkerState,
  type MarkerTool,
  type Row,
  type SubagentRow,
} from "../../../src/session.ts";

/** A fixed instant, so the stories render the same clock every run. */
const T0 = Date.parse("2026-11-13T09:00:00Z");
export const iso = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

let seq = 0;
const next = () => `${++seq}`;

export function user(turnId: string, text: string, extra: Partial<Row> = {}): Row {
  return {
    kind: RowKind.User,
    id: `u:${turnId}`,
    turnId,
    firstInTurn: true,
    text,
    contextBlocks: 0,
    expanded: false,
    attachments: [],
    remoteAuthor: null,
    remoteAuthorId: null,
    timestamp: iso(0),
    ...extra,
  } as Row;
}

export function prose(
  turnId: string,
  text: string,
  options: { header?: boolean; streaming?: boolean; footerBelow?: boolean } = {},
): Row {
  return {
    kind: RowKind.Prose,
    id: `p:${turnId}-${next()}`,
    turnId,
    firstInTurn: false,
    text,
    streaming: options.streaming ?? false,
    showHeader: options.header ?? false,
    model: "claude-sonnet-4.5",
    timestamp: iso(42),
    ...(options.footerBelow ? { footerBelow: true as const } : {}),
  };
}

export function thinking(
  turnId: string,
  text: string,
  options: { headline?: string; streaming?: boolean; live?: boolean } = {},
): Row {
  return {
    kind: RowKind.Thinking,
    id: `th:${turnId}-${next()}`,
    turnId,
    firstInTurn: false,
    text: "",
    headline: options.headline ?? null,
    live: options.live ? text : null,
    streaming: options.streaming ?? false,
    expanded: false,
    // Kept for `withOpen`: the full thought shows once the reader opens it.
    ...({ fullText: text } as object),
  } as Row;
}

export function marker(
  turnId: string,
  verb: string,
  tool: MarkerTool,
  detail: string,
  options: {
    state?: MarkerState;
    added?: number;
    removed?: number;
    durationMs?: number;
    server?: string;
  } = {},
): MarkerRow {
  const id = next();
  return {
    kind: RowKind.Marker,
    id: `mk:${id}`,
    turnId,
    firstInTurn: false,
    verb,
    tool,
    detail,
    state: options.state ?? "done",
    toolCallId: `call-${id}`,
    opens: tool === "edit" ? "diff" : tool === "run" || tool === "search" ? "output" : "none",
    added: options.added ?? 0,
    removed: options.removed ?? 0,
    startedAt: T0,
    ...(options.server ? { server: options.server } : {}),
    ...(options.durationMs !== undefined ? { durationMs: options.durationMs } : {}),
  };
}

export function group(turnId: string, markers: MarkerRow[]): MarkerGroupRow {
  const { summary, tool } = summarizeMarkers(markers);
  const live = markers.find((m) => m.state === "running" || m.state === "pending");
  return {
    kind: RowKind.MarkerGroup,
    id: `mg:${turnId}-${next()}`,
    turnId,
    firstInTurn: false,
    summary,
    count: markers.length,
    tool,
    markers,
    open: false,
    running: live !== undefined,
    liveLabel: live ? liveMarkerLabel(live) : null,
    liveTool: live?.tool ?? null,
    // A live clock in a story would never settle for a screenshot.
    liveStartedAt: null,
    liveDone: live ? markers.filter((m) => m.state === "done").length : 0,
  };
}

export function workHeader(
  turnId: string,
  options: { live?: boolean; workedMs?: number; stopped?: boolean; foldable?: boolean } = {},
): Row {
  return {
    kind: RowKind.WorkHeader,
    id: `wh:${turnId}`,
    turnId,
    firstInTurn: true,
    live: options.live ?? false,
    startedAt: null,
    workedMs: options.workedMs ?? null,
    stopped: options.stopped ?? false,
    foldable: options.foldable ?? true,
    open: false,
  };
}

export function footer(
  turnId: string,
  files: { path: string; kind: "read" | "edit"; added?: number; removed?: number }[],
  response?: { rowId: string; text: string },
): Row {
  return {
    kind: RowKind.TurnFooter,
    id: `tf:${turnId}`,
    turnId,
    firstInTurn: false,
    files: files.map((f) => ({ added: 0, removed: 0, ...f })),
    repoAtTurn: true,
    turnKey: turnId,
    messageId: turnId,
    hasSuggestions: false,
    contextChip: false,
    ...(response
      ? {
          responseRowId: response.rowId,
          responseText: response.text,
          responseTimestamp: iso(42),
          responseShowTimestamp: false,
        }
      : {}),
  };
}

export function subagent(turnId: string, name: string, status: SubagentRow["status"]): Row {
  const id = next();
  return {
    kind: RowKind.Subagent,
    id: `sa:${id}`,
    turnId,
    firstInTurn: false,
    toolCallId: `call-${id}`,
    name,
    status,
    role: "explorer",
    prompt: "Find every caller of sortSessions",
    result: undefined,
    startedAt: T0,
    endedAt: status === "running" ? T0 + 65_000 : T0 + 65_000,
    markers: [],
    workCount: 7,
  };
}

/** The rows with the reader's open state applied, as an app's projection
 *  would bake it in. */
export function withOpen(
  rows: readonly Row[],
  expanded: ReadonlySet<string>,
  openGroups: ReadonlySet<string>,
): Row[] {
  return rows.map((row) => {
    if (row.kind === RowKind.User && expanded.has(row.id)) return { ...row, expanded: true };
    if (row.kind === RowKind.Thinking && expanded.has(row.id)) {
      return { ...row, expanded: true, text: (row as unknown as { fullText: string }).fullText };
    }
    if (row.kind === RowKind.MarkerGroup && openGroups.has(row.id)) return { ...row, open: true };
    if (row.kind === RowKind.WorkHeader && openGroups.has(row.id)) return { ...row, open: true };
    return row;
  });
}

const ANSWER = [
  "Pinned sessions now sort **first**, then unread ones, then the rest by `lastActivityAt`.",
  "",
  "- The comparator moved into `sortSessions`, which the list and the jump menu both read",
  "- Snoozed sessions sink to the end until they wake",
  "",
  "```ts",
  "export function sortSessions(rows: Row[]): Row[] {",
  "  return [...rows].sort((a, b) => rank(a) - rank(b) || b.at - a.at);",
  "}",
  "```",
].join("\n");

/** One settled exchange: a prompt, the folded work, an answer, its files. */
export function settledTurn(n: number): Row[] {
  const t = `t${n}`;
  const answer = prose(t, ANSWER, { header: true, footerBelow: true });
  return [
    user(
      t,
      n % 3 === 0 ? "Why did the jump menu drift from the list?" : "Sort pinned sessions first",
    ),
    workHeader(t, { workedMs: 97_000 + n * 1000 }),
    answer,
    footer(
      t,
      [
        { path: "src/features/sidebar/sort.ts", kind: "edit", added: 24, removed: 9 },
        { path: "src/features/sidebar/session-list.tsx", kind: "edit", added: 3, removed: 11 },
      ],
      { rowId: answer.id, text: ANSWER },
    ),
  ];
}

/** A turn opened up: thinking, folded tool blocks, prose in between. */
export function workingTurn(): Row[] {
  const t = "work";
  return [
    user(t, "Find why the session list re-sorts on every keystroke, and fix it."),
    workHeader(t, { workedMs: 222_000, foldable: false }),
    thinking(t, "**Checking the selector**\n\nThe list subscribes to the whole store.", {
      headline: "Checking the selector",
    }),
    group(t, [
      marker(t, "Read", "read", "sidebar/session-list.tsx"),
      marker(t, "Read", "read", "stores/sessions-store.ts"),
      marker(t, "Searched", "search", "useSessions in src", { durationMs: 1400 }),
    ]),
    prose(t, "The list reads `useSessions()` with no selector, so every write re-renders it.", {
      header: true,
    }),
    group(t, [
      marker(t, "Edited", "edit", "sidebar/session-list.tsx", { added: 6, removed: 2 }),
      marker(t, "Ran", "run", "bun run test src/features/sidebar", { durationMs: 8200 }),
      marker(t, "Ran", "run", "bun run typecheck", { durationMs: 21_000 }),
      marker(t, "Take snapshot", "browser", "", { server: "browser" }),
    ]),
    marker(t, "Edited", "edit", "stores/sessions-store.ts", { added: 14, removed: 3 }),
    subagent(t, "Explorer", "completed"),
  ];
}

/** A turn still running: a live thought, a block with a call in flight. */
export function liveTurn(): Row[] {
  const t = "live";
  return [
    user(t, "Run the whole test suite and fix whatever fails."),
    {
      ...workHeader(t, { foldable: false }),
      live: true,
    } as Row,
    thinking(
      t,
      "The sandbox suite needs Linux, so I will run the rest natively first and leave that job to the container.",
      { headline: "Planning the run", streaming: true, live: true },
    ),
    group(t, [
      marker(t, "Read", "read", "package.json"),
      marker(t, "Ran", "run", "bun run lint", { durationMs: 4100 }),
      marker(t, "Ran", "run", "bun run test", { state: "running" }),
    ]),
    subagent(t, "Fixer", "running"),
  ];
}

/** Tool calls that failed, a stopped turn and a sleep. */
export function errorTurn(): Row[] {
  const t = "err";
  return [
    user(t, "Deploy the preview."),
    workHeader(t, { workedMs: 41_000, stopped: true, foldable: false }),
    group(t, [
      marker(t, "Ran", "run", "bun run build:app", { state: "failed", durationMs: 31_000 }),
      marker(t, "Fetched", "fetch", "https://example.com/status", { state: "failed" }),
    ]),
    marker(t, "Deleted", "delete", "dist/app.js", { state: "failed" }),
    subagent(t, "Deployer", "failed"),
    prose(t, "The build failed before the deploy step: `vite` could not resolve `pdfjs-dist`.", {
      header: true,
    }),
    {
      kind: RowKind.Interruption,
      id: `int:${t}`,
      turnId: t,
      firstInTurn: false,
      interruption: {
        cause: "sleep",
        sleptSecs: 1274,
        outcome: "failed",
        error: "error decoding response body",
      },
      latest: true,
    },
  ];
}

/** A long session: many settled turns, with a separator for a long gap. */
export function longSession(turns = 40): Row[] {
  const rows: Row[] = [];
  for (let n = 1; n <= turns; n++) {
    if (n === Math.floor(turns / 2)) {
      rows.push({
        kind: RowKind.Separator,
        id: `sep:${n}`,
        turnId: `t${n}`,
        firstInTurn: false,
        label: "3h later",
      });
    }
    rows.push(...settledTurn(n));
  }
  return rows;
}

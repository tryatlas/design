/**
 * The words a transcript's tool lines are made of: a path cut to one line, the
 * icon a call leads with, the counted sentence a folded block reads as and the
 * live line it shows while a call runs.
 *
 * Shared so every projection names work the same way. Desktop's projection
 * calls these as it builds its marker rows, and web's adapters call the same
 * ones, so "Ran 3 commands and read 2 files" is one sentence on both.
 */

import type { MarkerRow, MarkerTool } from "./model.ts";
import { commandProgramName } from "./parse-shell-command.ts";

/** Trim a path to something that reads in one line without the eye scanning. */
export function shortPath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  if (parts.length <= 2) return parts.join("/");
  return parts.slice(-2).join("/");
}

/** ACP's semantic class, which every agent that sets `kind` at all gets right. */
const TOOL_ICON_BY_KIND: Record<string, MarkerTool> = {
  execute: "run",
  read: "read",
  edit: "edit",
  delete: "delete",
  move: "move",
  search: "search",
  fetch: "fetch",
  think: "think",
};

/**
 * How a marker names a call no verb branch recognised. Atlas's own tool
 * servers read as their tool, in words: `mcp__atlas_code__find_symbol`
 * (Claude Code's name for it) and `atlas_code.find_symbol` (Atlas Agent's)
 * both become "Find symbol". Any other tool keeps its own name.
 */
export function toolDisplayName(toolName: string): string {
  const tool = /^(?:mcp__atlas_[a-z]+__|atlas_[a-z]+\.)([a-z_]+)$/.exec(toolName)?.[1];
  if (!tool) return toolName;
  const words = tool.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * The icon key for a call the verb branches did not already classify.
 *
 * `kind` first — it is the protocol's own answer. The name sniff below only
 * catches MCP servers, which are free to send no kind at all; it is
 * deliberately narrow, because a wrong icon is worse than the generic wrench.
 * Substrings that appear inside unrelated words ("rm" in "confirm", "web" in
 * "webhook") are not in it for that reason.
 */
export function toolIconFor(kind: string | null | undefined, toolName: string): MarkerTool {
  const byKind = TOOL_ICON_BY_KIND[kind ?? ""];
  if (byKind) return byKind;
  const name = toolName.toLowerCase();
  if (name.includes("search") || name.includes("grep") || name.includes("glob")) return "search";
  if (name.includes("fetch") || name.includes("http") || name.includes("url")) return "fetch";
  if (name.includes("delete") || name.includes("remove")) return "delete";
  if (name.includes("rename") || name.includes("move")) return "move";
  return "tool";
}

/**
 * A call to a third-party MCP server, by Claude Code's name for it
 * (`mcp__<server>__<tool>`): the server in words, and the tool as a phrase.
 * Atlas's own servers are not here — memory, organisation and code calls
 * already read as what they did.
 */
export function mcpToolOf(toolName: string): { server: string; tool: string } | null {
  const match = /^mcp__(.+?)__(.+)$/.exec(toolName);
  if (!match || match[1].startsWith("atlas_")) return null;
  const [, server, tool] = match;
  // Every browser-driving server is one thing to the reader. The server
  // decides it; a tool name only by a `browser_` prefix, so
  // `vercel__get_preview_deployment` stays vercel's.
  const label =
    /browser|playwright|puppeteer|chrome|preview/i.test(server) || /^browser[_-]/i.test(tool)
      ? "browser"
      : server.replace(/[_-]+/g, " ").toLowerCase();
  const words = tool.replace(/[_-]+/g, " ").trim();
  return { server: label, tool: words.charAt(0).toUpperCase() + words.slice(1) };
}

// ── Folded-block summary ───────────────────────────────────────────────────
//
// "Ran 3 commands and read 2 files": a block of tool calls as one counted
// sentence. Calls are grouped by what they did. The two most telling groups
// are named, in the order they first happened, and anything left over is
// counted as "performed N other actions". Changing the project (commands,
// edits) outranks looking at it (reads, searches, lookups), which outranks a
// generic tool, so a block that ran a build is never summarised by the file
// it read on the way.

type SummaryAction =
  | "run"
  | "edit"
  | "read"
  | "search"
  | "fetch"
  | "org"
  | "memory"
  | "server"
  | "tool";

/** Which group each row glyph counts toward. */
const SUMMARY_ACTION: Record<MarkerTool, SummaryAction> = {
  run: "run",
  edit: "edit",
  delete: "edit",
  move: "edit",
  read: "read",
  list: "read",
  file: "read",
  search: "search",
  fetch: "fetch",
  org: "org",
  memory: "memory",
  browser: "server",
  tool: "tool",
  think: "tool",
};

/** Lower is named first. */
const SUMMARY_PRIORITY: Record<SummaryAction, number> = {
  run: 0,
  edit: 0,
  read: 1,
  search: 1,
  fetch: 1,
  org: 1,
  memory: 1,
  server: 1,
  tool: 2,
};

function counted(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function actionLabel(action: SummaryAction, n: number, server: string | undefined): string {
  switch (action) {
    case "run":
      return `Ran ${counted(n, "command", "commands")}`;
    case "edit":
      return `Changed ${counted(n, "file", "files")}`;
    case "read":
      return `Read ${counted(n, "file", "files")}`;
    case "search":
      return n === 1 ? "Searched code once" : `Searched code ${n} times`;
    case "fetch":
      return n === 1 ? "Fetched a page" : `Fetched ${n} pages`;
    case "org":
      return n === 1 ? "Checked your organization" : `Checked your organization ${n} times`;
    case "memory":
      return n === 1 ? "Used Atlas memory" : `Used Atlas memory ${n} times`;
    case "server":
      return n === 1 ? `Used ${server}` : `Used ${server} ${n} times`;
    case "tool":
      return n === 1 ? "Used a tool" : `Used ${n} tools`;
  }
}

/** One block → the sentence on its header, and the glyph of the group that
 *  leads it. */
export function summarizeMarkers(markers: MarkerRow[]): { summary: string; tool: MarkerTool } {
  // Keyed by action, and an MCP server's calls by server: two servers are two
  // groups, each named for itself.
  const groups = new Map<string, MarkerRow[]>();
  for (const m of markers) {
    const key = m.server ? `server:${m.server}` : SUMMARY_ACTION[m.tool];
    const group = groups.get(key);
    if (group) group.push(m);
    else groups.set(key, [m]);
  }
  if (groups.size === 0) return { summary: "Used tools", tool: "tool" };

  const all = [...groups.values()].map((calls, index) => {
    const action: SummaryAction = calls[0].server ? "server" : SUMMARY_ACTION[calls[0].tool];
    return {
      action,
      server: calls[0].server,
      glyph: calls[0].tool,
      index,
      calls: calls.length,
      // Edits count files, not calls: three edits to one file changed one file.
      n:
        action === "edit"
          ? new Set(calls.map((c) => c.path ?? (c.detail || c.toolCallId))).size
          : calls.length,
    };
  });
  const named = [...all]
    .sort((a, b) => SUMMARY_PRIORITY[a.action] - SUMMARY_PRIORITY[b.action] || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index);
  const labels = named.map((g) => actionLabel(g.action, g.n, g.server));
  const rest = markers.length - named.reduce((sum, g) => sum + g.calls, 0);
  if (rest > 0) labels.push(`Performed ${counted(rest, "other action", "other actions")}`);

  const parts = labels.map((l, i) => (i === 0 ? l : l.charAt(0).toLowerCase() + l.slice(1)));
  const summary =
    parts.length < 3
      ? parts.join(" and ")
      : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
  return { summary, tool: named[0].action === "server" ? named[0].glyph : named[0].action };
}

/**
 * A live disclosure names the current action, then returns to its aggregate
 * sentence when that action finishes. Keep the phrase short enough to occupy
 * the same quiet, single-line slot as the collapsed summary.
 *
 * The rule is "name the target, fall back to the generic phrase" — the generic
 * phrases exist for calls whose target Atlas could not read, NOT as the normal
 * case. `run` is why: "Running command" made `bun run build:app` and `ls`
 * render as the same line, and the command is the entire content of a run.
 *
 * Which part of the target gets named differs by tool, and it is not a style
 * choice. A path's basename identifies it ("Reading turn-rows.ts") while its
 * parent directories are noise at this size; a command, a pattern or a URL has
 * no such tail, and slicing one on "/" would cut it mid-token. So paths take
 * the last segment and everything else is used whole — CSS truncates the line.
 */
export function liveMarkerLabel(marker: MarkerRow): string {
  const target = marker.detail;
  const basename = target.split("/").pop() ?? target;
  switch (marker.tool) {
    case "read":
      return target ? `Reading ${basename}` : "Reading files";
    case "edit":
      return target ? `Editing ${basename}` : "Editing files";
    case "delete":
      return target ? `Deleting ${basename}` : "Deleting files";
    case "move":
      return target ? `Moving ${basename}` : "Moving files";
    case "list":
      return target ? `Listing ${basename}` : "Listing files";
    case "file":
      return target ? `Opening ${basename}` : "Opening a file";
    // `search`'s detail is already a phrase ("pattern in dir"), so it reads as
    // the object of "searching for" rather than as a name.
    case "search":
      return target ? `Searching for ${target}` : "Searching files";
    // The program, not the whole command line: "Running sed" holds the one
    // line at any width, and the command is a click away in the block.
    case "run": {
      const program = target ? commandProgramName(target) : null;
      return program ? `Running ${program}` : target ? `Running ${target}` : "Running command";
    }
    case "fetch":
      return target ? `Fetching ${target}` : "Fetching content";
    case "think":
      return "Thinking…";
    // An organisation call's line is already a phrase ("Looked up Grace").
    case "org":
      return target ? `${marker.verb} ${target}` : marker.verb;
    default:
      // An MCP call's verb is already the tool, in words ("Take snapshot").
      if (marker.server) return target ? `${marker.verb} ${target}` : marker.verb;
      return target ? `Running ${marker.verb} ${target}` : "Using a tool";
  }
}

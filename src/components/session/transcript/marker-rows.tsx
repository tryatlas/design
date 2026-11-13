"use client";

import { memo, useCallback, useMemo } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "../../../lib/utils.ts";
import { useGroupDiscussed, useRowDiscussed, useTranscript } from "./context.tsx";
import type { MarkerGroupRow, MarkerRow, SubagentRow } from "./model.ts";
import {
  AgentOrb,
  Column,
  formatCalls,
  LiveElapsed,
  settledFigure,
  SUBAGENT_STATE,
} from "./parts.tsx";
import { FILE_DETAIL, ICON_PX, ICON_STROKE, ToolGlyph } from "./tool-glyph.tsx";
import { useVisibleAnimation } from "./visible-animation.ts";

// ── Marker ─────────────────────────────────────────────────────────────────

/**
 * One tool call: a single muted line, and nothing else.
 *
 * The group expands, while each action stays one line. Clicking an action with
 * output or a diff opens its detail view. There is no trailing chevron, as in
 * Codex: a file target reads as a link (dotted underline) and every clickable
 * row brightens on hover.
 *
 * What a click opens is the app's (`onOpenMarker`); a call it can open nothing
 * for (`opens: "none"`) is not a button anyone can press.
 */
export const MarkerRowView = memo(function MarkerRowView({
  row,
  embedded = false,
}: {
  row: MarkerRow;
  embedded?: boolean;
}) {
  const { CommentPill, onOpenMarker } = useTranscript();
  const onClick = useCallback(() => onOpenMarker?.(row), [onOpenMarker, row]);
  const discussed = useRowDiscussed(row.toolCallId) && CommentPill !== undefined;
  const clickable = row.opens !== "none" && onOpenMarker !== undefined;
  const fileLink = clickable && FILE_DETAIL.has(row.tool);
  const shimmer = useVisibleAnimation<HTMLElement>();

  const line = (
    <button
      ref={row.state === "running" ? shimmer : undefined}
      type="button"
      disabled={!clickable}
      onClick={clickable ? onClick : undefined}
      className={cn(
        "atlas-marker group/marker min-w-0 text-left text-base text-[var(--muted-foreground)]",
        discussed ? "flex-1" : "w-full",
        clickable && "cursor-pointer hover:text-[var(--secondary-foreground)]",
        row.state === "running" && "atlas-marker-running",
      )}
      title={
        clickable ? `${row.cmd ?? `${row.verb} ${row.detail}`} — open in side panel` : undefined
      }
    >
      <span className="flex w-4 shrink-0 justify-center">
        <ToolGlyph tool={row.tool} failed={row.state === "failed"} />
      </span>
      {/* One run of text, so verb and target are a sentence ("Read flow.tsx")
          with a plain space between them, and a long command truncates as a
          line rather than as a separate column. */}
      <span className="min-w-0 truncate">
        {row.verb}
        {row.detail && (
          <>
            {" "}
            <span
              className={cn(
                fileLink &&
                  "text-disabled underline decoration-dotted underline-offset-[3px] group-hover/marker:text-[var(--secondary-foreground)]",
              )}
            >
              {row.detail}
            </span>
          </>
        )}
      </span>
      {(row.added > 0 || row.removed > 0) && (
        <span className="ml-auto shrink-0 font-mono text-2xs tabular-nums">
          {row.added > 0 && <span className="text-[var(--diff-added-text)]">+{row.added}</span>}
          {row.removed > 0 && <span className="ml-1 text-error">−{row.removed}</span>}
        </span>
      )}
      {/* The step's own time, in the same gutter and style as a block's live
          elapsed figure. Only from a second up — see `settledFigure`. */}
      {row.durationMs !== undefined && row.durationMs >= 1000 && (
        <span
          className={cn(
            "shrink-0 font-mono text-2xs text-disabled tabular-nums",
            row.added === 0 && row.removed === 0 && "ml-auto",
          )}
        >
          {settledFigure(row.durationMs)}
        </span>
      )}
    </button>
  );
  // A discussed call wears its pill beside the line; the wrapper exists only
  // then, so every other marker row's DOM is exactly what it was.
  const body =
    discussed && CommentPill ? (
      <div className="flex items-center gap-2">
        {line}
        <CommentPill anchorId={row.toolCallId} />
      </div>
    ) : (
      line
    );
  // `py-1` at top level: the same box as a block's header, so a lone call
  // reads at the rhythm of the blocks around it.
  return embedded ? body : <Column className="py-1">{body}</Column>;
});

/**
 * A folded sequence of consecutive tool calls, kept between the prose around it.
 *
 * One counted sentence you click — "Ran 3 commands and read 2 files" — led
 * by the icon of the group it names first. While a call
 * is running the line names that call instead ("Running bun run typecheck")
 * and wears its icon, then returns to the sentence when it finishes.
 *
 * The block does NOT open itself while live. The one line carries the live
 * state instead, and earns it by saying three things the settled sentence
 * cannot: what is running right now, how many actions are already behind it,
 * and how long the current one has been going. Auto-expanding was the
 * alternative and was rejected — it makes the transcript reflow under the
 * reader mid-turn, for detail that is one click away and that the folded
 * summary reports a second later anyway.
 *
 * The numeric gutter is the same right-hand slot `MarkerRowView` puts `+n −m`
 * in, for the same reason: the left of a marker line is a sentence, the right
 * is a column of figures, and they should not interleave.
 *
 * The chevron appears on hover and stays visible when open.
 */
export const MarkerGroupRowView = memo(function MarkerGroupRowView({
  row,
}: {
  row: MarkerGroupRow;
}) {
  const { GroupCommentPill, onToggleGroup: onExpandTurn } = useTranscript();
  // The ids of the calls behind this line, which is what a comment on any of
  // them is keyed by. Derived here rather than carried on the row: it is a map
  // over a list the row already holds, and the projection would have to redo
  // it on every marker state change.
  const callIds = useMemo(() => row.markers.map((marker) => marker.toolCallId), [row.markers]);
  const discussed = useGroupDiscussed(callIds) && GroupCommentPill !== undefined;
  // Derived rather than carried on the row: the projection would have to
  // recompute it on every marker state change anyway, and it is a scan of a
  // list the row already holds.
  const failed = row.markers.some((marker) => marker.state === "failed");
  const shimmer = useVisibleAnimation<HTMLElement>();
  const summary = (
    <button
      ref={row.running ? shimmer : undefined}
      type="button"
      aria-expanded={row.open}
      aria-controls={`${row.id}:actions`}
      onClick={() => onExpandTurn(row.id)}
      className={cn(
        "atlas-marker group/tool-summary cursor-pointer text-left text-base text-[var(--muted-foreground)] hover:text-[var(--secondary-foreground)]",
        // Discussed, the line shares its row with the pill and has to fill
        // the space so the pill lands at the end of it.
        discussed ? "min-w-0 flex-1" : "max-w-full",
      )}
    >
      <span className="flex w-4 shrink-0 justify-center">
        <ToolGlyph tool={row.running && row.liveTool ? row.liveTool : row.tool} failed={failed} />
      </span>
      <span className={cn("min-w-0 truncate", row.running && "atlas-thinking-shimmer")}>
        {row.running ? row.liveLabel : row.summary}
      </span>
      {row.running && (row.liveDone > 0 || row.liveStartedAt !== null) && (
        // Gap rather than a "·" between the two figures: the elapsed one is
        // written straight to the DOM and is blank for its first second, so
        // any separator React rendered beside it would dangle on its own
        // until the first tick.
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-2xs text-disabled tabular-nums">
          {row.liveDone > 0 && <span>{row.liveDone} done</span>}
          {row.liveStartedAt !== null && <LiveElapsed startedAt={row.liveStartedAt} minMs={1000} />}
        </span>
      )}
      <ChevronRight
        size={ICON_PX}
        strokeWidth={ICON_STROKE}
        className={cn(
          "shrink-0",
          row.open
            ? "rotate-90 opacity-100"
            : "opacity-0 group-hover/tool-summary:opacity-100 group-focus-visible/tool-summary:opacity-100",
        )}
      />
    </button>
  );
  return (
    <Column className="py-1">
      {/* A discussed sequence wears the fold's aggregate beside its summary —
          faces and a count over the calls inside, opening the fold so the call
          that was discussed can show its own pill. The wrapper exists only
          then, so every other group's DOM is exactly what it was. */}
      {discussed && GroupCommentPill ? (
        <div className="flex items-center gap-2">
          {summary}
          <GroupCommentPill
            anchorIds={callIds}
            onOpen={() => {
              if (!row.open) onExpandTurn(row.id);
            }}
          />
        </div>
      ) : (
        summary
      )}
      {row.open && (
        // Laid out in the thread, not in a 240px scroller. A nested scroll area
        // inside a scrolling transcript is two scrollbars fighting over the
        // same wheel gesture, and it hides the end of the list behind an
        // interaction the reader has to discover. Opening a sequence is a
        // deliberate act on one turn at a time, so its rows are just rows.
        <div id={`${row.id}:actions`}>
          {row.markers.map((marker) => (
            <MarkerRowView key={marker.id} row={marker} embedded />
          ))}
        </div>
      )}
    </Column>
  );
});

/**
 * A delegated child — one line, the same line a tool call gets.
 *
 * Minimal on purpose: a subagent is not a card, it is one more thing the turn
 * did, and the transcript's whole bargain is that work reads as a quiet column
 * you scan. What sets it apart is the glyph — a filled orb rather than a tool
 * icon, which is how both Codex and Claude Desktop mark an agent among tool
 * calls — and nothing else.
 *
 * Clicking opens the child in the side panel rather than expanding in place:
 * its prompt, its calls and its answer are a body, and a row that grows into
 * one is exactly the unpredictable height a transcript should not absorb.
 */
export const SubagentRowView = memo(function SubagentRowView({ row }: { row: SubagentRow }) {
  const { onOpenSubagent } = useTranscript();
  const onOpen = useCallback(() => onOpenSubagent?.(row), [onOpenSubagent, row]);
  const running = row.status === "running";
  const failed = row.status === "failed";
  const shimmer = useVisibleAnimation<HTMLElement>();
  return (
    <Column>
      <button
        ref={running ? shimmer : undefined}
        type="button"
        onClick={onOpen}
        title={`${row.name} — open in side panel`}
        className={cn(
          "atlas-marker w-full min-w-0 cursor-pointer text-left text-base",
          failed ? "text-error" : "text-[var(--muted-foreground)]",
          "hover:text-[var(--secondary-foreground)]",
        )}
      >
        <span className="flex w-4 shrink-0 justify-center">
          <AgentOrb running={running} failed={failed} />
        </span>
        <span className={cn("min-w-0 truncate", running && "atlas-marker-running")}>
          {row.name}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-2xs text-disabled tabular-nums">
          {/* Only when the child reported work: a mail child's count is 0
              however much it did, and "0 calls" would say it did nothing. */}
          {row.workCount > 0 && <span>{formatCalls(row.workCount)}</span>}
          {SUBAGENT_STATE[row.status]}
          {row.endedAt === undefined ? (
            <LiveElapsed startedAt={row.startedAt} minMs={1000} />
          ) : (
            settledFigure(row.endedAt - row.startedAt)
          )}
        </span>
      </button>
    </Column>
  );
});

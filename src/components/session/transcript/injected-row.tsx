"use client";

import { memo, useState } from "react";
import { ChevronRight, GitPullRequest, RotateCcw } from "lucide-react";

import { cn } from "../../../lib/utils.ts";
import type { InjectedRow } from "./model.ts";
import { TRANSCRIPT_COLUMN } from "./parts.tsx";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.tsx";

/**
 * A prompt Atlas sent the agent on its own — a watched pull request changed,
 * and Atlas woke the agent about it, or Atlas came back from a quit, crash or
 * update and continued the turn it cut short.
 *
 * It opens a turn the way a user message does, but it is not the user's words,
 * so it is not their bubble: one quiet line in the interruption row's
 * register, saying who spoke and why. The full text the agent received folds
 * behind Details, for when the user wants to see exactly what it was told.
 *
 * No entrance animation, for the reason `InterruptionRowView` gives: rows
 * remount as they scroll back into view.
 */
export const InjectedRowView = memo(function InjectedRowView({ row }: { row: InjectedRow }) {
  const [open, setOpen] = useState(false);
  const restart = row.injected.source === "restart";
  const headline = restart ? row.injected.summary : `Pull request watch · ${row.injected.summary}`;
  const Icon = restart ? RotateCcw : GitPullRequest;

  return (
    <div data-testid="injected-row" className={cn(TRANSCRIPT_COLUMN, "pt-2 pb-3")}>
      <div className="flex min-h-[26px] items-center gap-2 text-base text-[var(--muted-foreground)]">
        <span className="flex w-4 shrink-0 justify-center text-info">
          <Icon size={ICON_PX} strokeWidth={ICON_STROKE} />
        </span>
        <span className="min-w-0 truncate" title={headline}>
          {headline}
        </span>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 flex shrink-0 cursor-pointer items-center gap-0.5 text-xs transition-colors hover:text-[var(--secondary-foreground)]"
        >
          Details
          <ChevronRight
            size={ICON_PX}
            strokeWidth={ICON_STROKE}
            className={cn("shrink-0 transition-transform", open && "rotate-90")}
          />
        </button>
      </div>
      {open && (
        <p className="mt-1 ml-6 text-sm break-words whitespace-pre-wrap text-[var(--muted-foreground)]">
          {row.text}
        </p>
      )}
    </div>
  );
});

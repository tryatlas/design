"use client";

import { memo, useState } from "react";
import { ChevronRight, CornerDownRight, MoonStar, RotateCcw } from "lucide-react";

import { cn } from "../../../lib/utils.ts";
import { Button } from "../../../ui/button.tsx";
import { useTranscript } from "./context.tsx";
import type { InterruptionRow, TranscriptInterruption } from "./model.ts";
import { TRANSCRIPT_COLUMN } from "./parts.tsx";
import { ICON_PX, ICON_STROKE } from "./tool-glyph.tsx";

/** "45s", "21m", "1h", "1h 3m": a sleep is told in the unit a person would
 *  use; "21m 14s" reads as a stopwatch. */
export function formatSlept(secs: number): string {
  const s = Math.max(0, Math.round(secs));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 === 0 ? `${h}h` : `${h}h ${m % 60}m`;
}

/** The interruption row's one line: what happened, and what it means for the
 *  reply, in that order. The agent's own error is a detail, never the
 *  headline. */
export function interruptionHeadline(x: TranscriptInterruption): string {
  const slept = `Your computer slept for ${formatSlept(x.sleptSecs)}`;
  switch (x.outcome) {
    case "finished":
      return `${slept} during this reply — it may be incomplete.`;
    case "stopped":
      return `${slept} during this reply before it was stopped.`;
    case "failed":
      return `${slept} and the reply was cut off.`;
    case "disconnected":
      return `${slept} and the agent exited before finishing.`;
  }
}

/**
 * A turn something outside the conversation cut into — today, the computer
 * sleeping mid-reply (`TurnInterruption`).
 *
 * One quiet line in the footer's register, under the turn: the reply stays the
 * loudest thing on screen, and this says only what happened to it. The moon is
 * the one coloured mark, in the warning token — it is a caution about the
 * reply, not an error the user caused. The agent's own error, when there is
 * one, is folded behind Details: it is for diagnosis, not the headline.
 *
 * No entrance animation. Rows remount as they scroll in and out, so a fade
 * here would replay every time the turn came back into view.
 *
 * Retry and Continue appear on the latest turn only, since both act on the
 * thread's last reply, and only where the app wires them (`onRetry`,
 * `onContinue`).
 */
export const InterruptionRowView = memo(function InterruptionRowView({
  row,
  canRetry,
  canContinue,
}: {
  row: InterruptionRow;
  canRetry: boolean;
  canContinue: boolean;
}) {
  const { onRetry, onContinue } = useTranscript();
  const [open, setOpen] = useState(false);
  const { interruption } = row;
  const headline = interruptionHeadline(interruption);
  const showRetry = row.latest && canRetry && onRetry !== undefined;
  const showContinue = row.latest && canContinue && onContinue !== undefined;

  return (
    <div data-testid="interruption-row" className={cn(TRANSCRIPT_COLUMN, "pt-1 pb-4")}>
      <div className="flex min-h-[26px] items-center gap-2 text-base text-[var(--muted-foreground)]">
        <span className="flex w-4 shrink-0 justify-center text-warning">
          <MoonStar size={ICON_PX} strokeWidth={ICON_STROKE} />
        </span>
        {/* Not `flex-1`: the actions follow the sentence they answer rather
            than sitting a column's width away from it. */}
        <span className="min-w-0 truncate" title={headline}>
          {headline}
        </span>
        {interruption.error && (
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
        )}
        {(showRetry || showContinue) && (
          <span className="flex shrink-0 items-center gap-1">
            {showContinue && (
              <Button variant="ghost" size="xs" onClick={onContinue}>
                <CornerDownRight size={ICON_PX} strokeWidth={ICON_STROKE} />
                Continue
              </Button>
            )}
            {showRetry && (
              <Button variant="ghost" size="xs" onClick={onRetry}>
                <RotateCcw size={ICON_PX} strokeWidth={ICON_STROKE} />
                Retry
              </Button>
            )}
          </span>
        )}
      </div>
      {open && interruption.error && (
        <p className="mt-1 ml-6 font-mono text-2xs break-words whitespace-pre-wrap text-[var(--muted-foreground)]">
          {interruption.error}
        </p>
      )}
    </div>
  );
});

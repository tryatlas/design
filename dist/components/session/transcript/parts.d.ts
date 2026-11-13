import { type ReactNode } from "react";
import type { SubagentStatus } from "./model.ts";
/**
 * The conversation's content frame: centred, `--transcript-column` at most
 * (760px unless the app widens it), padded the same on both sides. Exported so
 * an app can line its composer up with the transcript text at every width.
 */
export declare const TRANSCRIPT_COLUMN = "mx-auto w-full max-w-(--transcript-column) px-6";
/** Shared by every row: the centred content column. */
export declare function Column({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/**
 * A settled child's duration, or nothing when there is none to state.
 *
 * Under a second is what a child reads when nothing measured it — a reopened
 * session's async child, whose launch returned at once and whose own report
 * never reaches this session — and "0s" would be a claim, not a figure. The
 * live counter blanks below a second for the same reason.
 */
export declare function settledFigure(ms: number): import("react").JSX.Element | null;
/** "1 call", "12 calls" — a child's work as the gutter counts it. */
export declare function formatCalls(n: number): string;
/** What the gutter says after the name. Terminal states are words, not icons:
 *  "stopped" and "failed" are different facts and no glyph tells them apart at
 *  this size. */
export declare const SUBAGENT_STATE: Record<SubagentStatus, string>;
/**
 * The thinking orb that stands in for a tool glyph on a subagent's row.
 *
 * A filled disc rather than a line icon, so it reads as a presence among the
 * outlined tool glyphs instead of as another tool. Live, it breathes on the
 * shared marker shimmer — OPACITY ONLY, like every other animation in the
 * transcript: no transform and no layout, so a row's predicted height holds
 * and the scroll loop has nothing to re-measure.
 */
export declare function AgentOrb({ running, failed }: {
    running: boolean;
    failed: boolean;
}): import("react").JSX.Element;
/** "17s", "1m 29s", "7m 37s", "1h 3m" — compact elapsed-time format. */
export declare function formatWorked(ms: number): string;
/**
 * The live "Working for 46s" figure, written straight to the DOM once a second
 * — the same bargain as the loader's timer in `loading-state.tsx`: the one element
 * that changes every second never goes through React, and a hidden window
 * stops painting it (the next visible paint is exact, being derived from
 * `startedAt`).
 */
export declare function LiveElapsed({ startedAt, minMs }: {
    startedAt: number;
    minMs?: number;
}): import("react").JSX.Element;
//# sourceMappingURL=parts.d.ts.map
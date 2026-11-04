import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { CommentAnchor, DiffData, ToolCallView, ToolKind } from "./session-view.ts";
/**
 * One tool call: a one-line header you click, and what was recorded behind it.
 *
 * Desktop's session call row. The line is a sentence (glyph, the call's title,
 * its target) with the figures in a right-hand gutter (`+n −m`, the duration),
 * so a column of calls scans as text on the left and numbers on the right.
 * Opened, it shows the paths, the input and the output (or the terminal run),
 * then each diff. It never fetches: a truncated payload offers
 * `onLoadPayload`, and the app fills it in.
 *
 * Rows have no border of their own: a run of calls sits in one bordered box,
 * divided by hairlines (`TurnRow` draws it), as desktop's call table does.
 *
 * Huge payloads stay cheap. At most 400 lines of each render, the head for
 * input and diffs and the tail for terminal output (the end is where a command
 * says what happened), and "Show more" adds 2,000 at a time.
 */
/** One glyph per kind, desktop's tool vocabulary. Shapes only; the one tint is red on failure. */
export declare const TOOL_KIND_ICON: Record<ToolKind, LucideIcon>;
export interface ToolCallCardProps {
    call: ToolCallView;
    /** Open on first render. Uncontrolled after that. */
    defaultOpen?: boolean;
    /** A truncated payload's "Load full …" asks the app for the rest. */
    onLoadPayload?: (part: "input" | "output") => void;
    /** Draws each of `call.diffs`. Defaults to `DefaultDiff`. */
    renderDiff?: (diff: DiffData) => ReactNode;
    /** Beside the header, outside the disclosure: the app's comment control. */
    commentSlot?: (anchor: CommentAnchor) => ReactNode;
    className?: string;
}
export declare function ToolCallCard({ call, defaultOpen, onLoadPayload, renderDiff, commentSlot, className, }: ToolCallCardProps): import("react").JSX.Element;
export interface DefaultDiffProps {
    diff: DiffData;
}
/**
 * A diff as the patch's lines, tinted by sign, or the old text above the new
 * when there is no patch. The fallback for `ToolCallCard`'s `renderDiff`.
 */
export declare function DefaultDiff({ diff }: DefaultDiffProps): import("react").JSX.Element;
//# sourceMappingURL=tool-call-card.d.ts.map
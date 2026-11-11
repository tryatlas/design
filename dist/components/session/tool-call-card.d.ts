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
/** Every string the card draws beyond the call's own data. */
export interface ToolCallCardLabels {
    copy: string;
    copied: string;
    /** The button that shows the next `n` lines. */
    showMore: (n: number) => string;
    /** A truncated payload's load button; `size` is formatted ("94.1 KB") when known. */
    loadFull: (part: "input" | "output", size?: string) => string;
    /** The load button after the app's fetch failed (`Payload.load` `failed`); clicking retries. */
    loadFailed?: (part: "input" | "output") => string;
    /** A truncated payload with nothing to load it. */
    truncated: (part: "input" | "output") => string;
    /** A binary payload; `size` is formatted when known. */
    binary: (part: "input" | "output", size?: string) => string;
    /** An opened call that recorded nothing. */
    empty: string;
}
export declare const DEFAULT_TOOL_CALL_CARD_LABELS: ToolCallCardLabels;
/** What a payload's Copy asks the app to put on the clipboard. */
type CopyPayload = (part: "input" | "output", text: string) => Promise<boolean> | boolean;
export interface ToolCallCardProps {
    call: ToolCallView;
    /** Open on first render. Uncontrolled after that. */
    defaultOpen?: boolean;
    /** Controlled open state; leave undefined for an uncontrolled card. */
    open?: boolean;
    /** Called with the next open state when the header is clicked. */
    onOpenChange?: (open: boolean) => void;
    /** Adds Copy to each whole text payload; resolve `true` once the text is on the clipboard. */
    onCopy?: CopyPayload;
    /** Overrides for the card's strings. */
    labels?: Partial<ToolCallCardLabels>;
    /** A truncated payload's "Load full …" asks the app for the rest. */
    onLoadPayload?: (part: "input" | "output") => void;
    /** Draws each of `call.diffs`. Defaults to `DefaultDiff`. */
    renderDiff?: (diff: DiffData) => ReactNode;
    /** Beside the header, outside the disclosure: the app's comment control. */
    commentSlot?: (anchor: CommentAnchor) => ReactNode;
    className?: string;
}
export declare function ToolCallCard({ call, defaultOpen, open: openProp, onOpenChange, onCopy, labels: labelOverrides, onLoadPayload, renderDiff, commentSlot, className, }: ToolCallCardProps): import("react").JSX.Element;
export interface DefaultDiffProps {
    diff: DiffData;
    /** The "Show more" label; `ToolCallCard` passes its own. */
    labels?: Partial<Pick<ToolCallCardLabels, "showMore">>;
}
/**
 * A diff as the patch's lines, tinted by sign, or the old text above the new
 * when there is no patch. The fallback for `ToolCallCard`'s `renderDiff`.
 */
export declare function DefaultDiff({ diff, labels }: DefaultDiffProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=tool-call-card.d.ts.map
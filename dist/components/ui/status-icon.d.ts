/**
 * The session status glyph.
 *
 * Circles, because a status dot is a circle everywhere else a person has
 * seen one — and one thing that is not a circle: a running session is a
 * ThinkingOrb, a dotted sphere in constant motion. "Running" is the only
 * state where something is actually happening, so it is the only one that
 * moves; everything at rest is a still dot.
 *
 *   queued   a hollow ring in muted ink — nothing has happened yet
 *   live     the `composing` ThinkingOrb — work in progress
 *   done     a solid dot in muted ink — history, and it should recede
 *   failed   a solid dot in the error ink
 *
 * The orb is monochrome and follows `data-theme` on its own; it renders a
 * still frame under `prefers-reduced-motion`. It is drawn at its 20px inline
 * preset and fitted to the glyph box, so it sits on the same 14px footprint
 * as the dots (or whatever `size-*` the caller passes).
 */
export type SessionStatusKind = "queued" | "live" | "done" | "failed";
declare function StatusIcon({ status, className }: {
    status: SessionStatusKind;
    className?: string;
}): import("react").JSX.Element;
/**
 * Priority, as four stepped bars.
 *
 * Bars, because they solve a real problem: priority needs to be
 * comparable down a column at a glance, and a coloured chip per level turns
 * the list into a traffic light that competes with status. Bars encode
 * magnitude in height, which the eye reads without decoding a colour key.
 */
export type Priority = "none" | "low" | "medium" | "high" | "urgent";
declare function PriorityIcon({ priority, className, ...props }: Omit<React.ComponentProps<"svg">, "ref"> & {
    priority: Priority;
}): import("react").JSX.Element;
export { PriorityIcon, StatusIcon };
//# sourceMappingURL=status-icon.d.ts.map
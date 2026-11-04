/**
 * A chevron that says "this opens something". When its trigger is hovered
 * the chevron shifts forward and its two arms spread apart about the apex,
 * opening into an arrow; it eases back on leave, on the motion scale
 * (`duration-base`, `ease-out-strong`).
 *
 * The trigger is whichever ancestor carries `group/go` — a row, a card, a
 * link — so the whole target acknowledges the hover, not just the glyph.
 * Hover-only: focus and touch show the resting chevron, so nothing is
 * communicated by the motion alone. Reduced motion drops the transition.
 */
declare function GoChevron({ className }: {
    className?: string;
}): import("react").JSX.Element;
export { GoChevron };
//# sourceMappingURL=go-chevron.d.ts.map
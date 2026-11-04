/**
 * Dashed vertical rails, positioned by `clamp()` so they sit inside
 * the gutter at every width — or at a fixed `offset` from the parent's edges
 * when they should frame a column rather than a viewport. Dashed, never solid: they are drafting marks,
 * not walls. The optional mask lets them fade before they hit the next
 * section.
 */
declare function DashedRails({ fade, offset, className, }: {
    fade?: boolean;
    /** Distance of each rail from the parent's left and right edges. */
    offset?: string;
    className?: string;
}): import("react").JSX.Element;
export { DashedRails };
//# sourceMappingURL=dashed-rails.d.ts.map
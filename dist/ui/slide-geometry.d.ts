export interface SlideGeometry {
    /** Strip offset, in px, that centres the active label on its control. */
    tx: number;
    /** Percentages hiding everything either side of the active label. */
    left: number;
    right: number;
}
/**
 * `widths` are the strip's label widths in strip order, `stripLeft` is where
 * the untranslated strip starts. Returns null when nothing is laid out yet.
 */
export declare function slideGeometry({ index, widths, controlCentre, stripLeft, viewportWidth, margin, }: {
    index: number;
    widths: number[];
    controlCentre: number;
    stripLeft: number;
    viewportWidth: number;
    margin: number;
}): SlideGeometry | null;
//# sourceMappingURL=slide-geometry.d.ts.map
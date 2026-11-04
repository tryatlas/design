type DitherFieldProps = {
    mode?: "dots" | "glyphs";
    /**
     * `[start, span]` of the radial hollow as fractions of the half-diagonal:
     * nothing prints inside `start`, full density from `start + span` out.
     */
    hollow?: [number, number];
    /** Multiplier on the ink alpha. `1` is the landing page's own value. */
    ink?: number;
    /** The ink is the canvas's text colour: `text-muted-foreground` recolours it. */
    className?: string;
    /**
     * Shown until the first frame paints, and for good without a 2D canvas.
     * Defaults to a static dot grid in the field's own ink (`className` recolours both). It fills the same
     * `relative` parent the canvas does.
     */
    fallback?: React.ReactNode;
};
declare function DitherField({ mode, hollow, ink, className, fallback }: DitherFieldProps): import("react").JSX.Element;
export { DitherField };
//# sourceMappingURL=dither-field.d.ts.map
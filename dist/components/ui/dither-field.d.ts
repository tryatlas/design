type DitherFieldProps = {
    mode?: "dots" | "glyphs";
    /**
     * `[start, span]` of the radial hollow as fractions of the half-diagonal:
     * nothing prints inside `start`, full density from `start + span` out.
     */
    hollow?: [number, number];
    /** Multiplier on the ink alpha. `1` is the landing page's own value. */
    ink?: number;
    className?: string;
};
declare function DitherField({ mode, hollow, ink, className }: DitherFieldProps): import("react").JSX.Element;
export { DitherField };
//# sourceMappingURL=dither-field.d.ts.map
export type BlurEdge = "top" | "bottom";
export interface GradualBlurProps {
    /** Which edge of the (positioned) parent to sit on. */
    position: BlurEdge;
    /** Band height, any CSS length. */
    height?: string;
    /** Peak blur radius in rem at the strongest layer. */
    strength?: number;
    /** How many masked layers to stack. 0 disables the effect entirely. */
    layers?: number;
    /**
     * Ramp shape across the band. `bezier` (smoothstep) eases in and out and is
     * the most natural for a reading edge; `linear` ramps evenly.
     */
    curve?: "linear" | "bezier" | "ease-in" | "ease-out";
    /** Bias the ramp so most of the blur happens near the edge. */
    exponential?: boolean;
    /**
     * Optional colour wash composited under the blur, so content also dims toward
     * the edge instead of staying legible-but-fuzzy. Pass a CSS colour.
     */
    tint?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const GradualBlur: import("react").MemoExoticComponent<({ position, height, strength, layers, curve, exponential, tint, className, style, }: GradualBlurProps) => import("react").JSX.Element | null>;
//# sourceMappingURL=gradual-blur.d.ts.map
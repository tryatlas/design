/**
 * The size of an element, kept current through a ResizeObserver.
 *
 * Returns a callback ref rather than taking one, so it can be attached to a
 * `motion.div` or anything else without a forwarded ref dance. Replaces
 * `react-use-measure` for the one component that needed it.
 */
export declare function useMeasure<T extends HTMLElement = HTMLElement>(): readonly [(node: T | null) => void, {
    width: number;
    height: number;
}];
//# sourceMappingURL=use-measure.d.ts.map
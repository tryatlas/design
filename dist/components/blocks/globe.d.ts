/**
 * A dotted WebGL globe that turns slowly and can be dragged. The login aside
 * uses it as an interactive backdrop, parked off the top-right corner so only
 * the upper hemisphere shows.
 *
 * cobe draws the sphere; the markers are DOM. cobe v2 publishes a CSS anchor
 * (`--cobe-<id>`) for every marker with an id, plus `--cobe-visible-<id>`
 * while that point faces the camera, so the pulse rings and status tags are
 * plain elements positioned with anchor positioning and faded out on the far
 * side. Where anchor positioning is unsupported they simply do not show; the
 * globe is unaffected.
 *
 * A marker with a `status` carries a LIVE tag above it: what is happening
 * there right now, with a count that drifts a few percent either side of its
 * base so the globe reads as realtime rather than as a map. Live is the
 * `success` ink, as on the sidebar's live badge — in this system red means failed,
 * so a red LIVE would announce an outage. The count is `tabular-nums` so the
 * tag does not change width as the number ticks.
 *
 * WebGL takes numbers, not custom properties, so the dot, marker and glow
 * colours are resolved from the token layer on mount. `useTheme()` is a
 * dependency so switching appearance rebuilds the globe in the new ink.
 * Under `prefers-reduced-motion` it stops turning on its own but can still
 * be dragged.
 */
export type GlobeMarker = {
    id: string;
    location: [number, number];
    /** Seconds before this marker's first pulse, so they do not beat in sync. */
    delay: number;
    /** A LIVE tag: a count that drifts around `count`, then what it counts. */
    status?: {
        count: number;
        unit: string;
    };
};
declare function Globe({ markers, speed, className, }: {
    markers?: Array<GlobeMarker>;
    /** Radians of spin per frame. */
    speed?: number;
    className?: string;
}): import("react").JSX.Element;
export { Globe };
//# sourceMappingURL=globe.d.ts.map
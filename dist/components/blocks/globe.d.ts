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
 * be dragged. Its turn redraws at most `--infinite-animation-fps` times a
 * second when that is set (see `INFINITE_ANIMATIONS`), covering the same
 * angle per second either way.
 *
 * cobe is not in the import graph: it is fetched with a dynamic `import()`
 * once the globe comes within 200px of the viewport and the main thread is
 * idle, so a page that never scrolls to it never downloads it. Until the
 * globe's first frame — on the server, before the download, and for good
 * where WebGL is unavailable — a token-coloured disc (or the `fallback` prop)
 * holds the same square box, so nothing shifts and nothing is blank. Without
 * WebGL the root carries `data-fallback`.
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
declare function Globe({ markers, speed, fallback, className, }: {
    markers?: Array<GlobeMarker>;
    /** Radians of spin per frame. */
    speed?: number;
    /**
     * Shown in the globe's box until its first frame, and for good without
     * WebGL. Defaults to a soft disc in the muted ink. Pass an optimised image
     * only for a hero that must look finished at first byte.
     */
    fallback?: React.ReactNode;
    className?: string;
}): import("react").JSX.Element;
export { Globe };
//# sourceMappingURL=globe.d.ts.map
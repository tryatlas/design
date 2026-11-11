type SkeletonRadius = "sm" | "md" | "lg" | "full";
/**
 * A loading placeholder.
 *
 * Animates opacity only (Tailwind's `animate-pulse`). A shimmer that moves a
 * gradient repaints the whole list on every frame, which on a 200-row board
 * costs more than the request it is standing in for.
 *
 * `animated={false}` holds it still: for a placeholder that stands in for a
 * whole panel while its code loads (desktop's `PanelSkeleton`), where a block
 * of pulsing rows is louder than the wait. `radius` takes the radius scale's
 * steps, so a row can match what it stands in for without a `rounded-*`
 * override at the call site.
 *
 * Filled with `muted`, the same grey as a progress track: the translucent
 * `element-*` fills are hover and selection washes, and over a black ground
 * they all but vanish.
 */
declare function Skeleton({ className, animated, radius, ...props }: React.ComponentProps<"div"> & {
    animated?: boolean;
    radius?: SkeletonRadius;
}): import("react").JSX.Element;
export { Skeleton };
export type { SkeletonRadius };
//# sourceMappingURL=skeleton.d.ts.map
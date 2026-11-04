/**
 * A loading placeholder.
 *
 * Animates opacity only (Tailwind's `animate-pulse`). A shimmer that moves a
 * gradient repaints the whole list on every frame, which on a 200-row board
 * costs more than the request it is standing in for.
 *
 * Filled with `muted`, the same grey as a progress track: the translucent
 * `element-*` fills are hover and selection washes, and over a black ground
 * they all but vanish.
 */
declare function Skeleton({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { Skeleton };
//# sourceMappingURL=skeleton.d.ts.map
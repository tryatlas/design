/**
 * A loading placeholder.
 *
 * Animates opacity only (Tailwind's `animate-pulse`). A shimmer that moves a
 * gradient repaints the whole list on every frame, which on a 200-row board
 * costs more than the request it is standing in for.
 */
declare function Skeleton({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { Skeleton };
//# sourceMappingURL=skeleton.d.ts.map
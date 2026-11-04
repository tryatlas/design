/**
 * A seamless marquee.
 *
 * Children render twice and the track translates by exactly half its
 * measured width, so the second copy lands where the first began. Width is
 * measured, not assumed, so it survives font loading and scale changes.
 *
 * `speedOnHover` does not jump speeds: it animates the REMAINING distance at
 * the new speed, then re-keys the loop. A marquee that lurches when you
 * hover it is one you cannot read.
 */
export type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    speed?: number;
    speedOnHover?: number;
    direction?: "horizontal" | "vertical";
    reverse?: boolean;
    className?: string;
};
declare function InfiniteSlider({ children, gap, speed, speedOnHover, direction, reverse, className, }: InfiniteSliderProps): import("react").JSX.Element;
export { InfiniteSlider };
//# sourceMappingURL=infinite-slider.d.ts.map
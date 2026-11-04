/**
 * A social-proof logo cloud: an `InfiniteSlider` whose ends fade out on a
 * plain linear mask, so marks slide in and out of transparency rather than
 * being sliced at the edge. A mask rather than a gradient overlay, so it
 * works on any surface without knowing its colour.
 *
 * The marks are the caller's. Customer logos are a marketing page's assets,
 * not the design system's, so the package ships none: pass each as a node —
 * an inline SVG, or an `<img>` from the app's own public folder. A mark whose
 * dark-theme file is white-only wants a light twin; the app swaps the two on
 * `[data-appearance]`, or draws the mark in `currentColor` and lets it
 * follow the ink.
 */
export type Logo = {
    /** The company, as the accessible name of its slot. */
    name: string;
    mark: React.ReactNode;
};
declare function LogoMarquee({ logos, label, className, trackClassName, }: {
    logos: Array<Logo>;
    label?: string;
    className?: string;
    /**
     * On the moving strip only, so it can bleed past its container's padding
     * (`-mx-*`) and fade into the edge of the surface while the label stays
     * on the text column.
     */
    trackClassName?: string;
}): import("react").JSX.Element;
export { LogoMarquee };
//# sourceMappingURL=logo-marquee.d.ts.map
/**
 * The frame every labelled brand mark draws in (`brand-marks.tsx`,
 * `provider-marks.tsx`). Not exported from the package: it is the marks'
 * shared accessibility rule, not a component of its own.
 *
 * A mark names itself. `title` defaults to the brand's name (the caller
 * passes it in as `defaultTitle`); a non-empty title becomes the svg's first
 * child and the svg gets `role="img"`, so a screen reader reads "Codex" for
 * a lone glyph. A mark sitting next to its name as text is decoration, and
 * `title=""` says so: no `<title>`, `aria-hidden="true"`.
 *
 * 24×24 at 16px by default, like the Lucide glyphs it sits beside. Props
 * spread last, so a caller's `viewBox`, `width` or `aria-*` wins.
 */
type BrandMarkProps = Omit<React.ComponentProps<"svg">, "title"> & {
    /** The accessible name. Defaults to the brand's name; `""` marks it decorative. */
    title?: string;
};
declare function BrandMarkSvg({ title, defaultTitle, className, children, ...props }: BrandMarkProps & {
    defaultTitle: string;
}): import("react").JSX.Element;
export { BrandMarkSvg };
export type { BrandMarkProps };
//# sourceMappingURL=brand-mark-svg.d.ts.map
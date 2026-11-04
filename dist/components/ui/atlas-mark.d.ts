/**
 * The Atlas mark: three rising strokes.
 *
 * `currentColor`, so it takes the ink of whatever it sits in — a rail item,
 * a login header, a workspace switcher trigger. Our own mark, unlike the
 * third-party ones in `brand-marks.tsx`, has no fixed colour.
 */
declare function AtlasMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/** The mark in its rounded container, as it appears above an auth form. */
declare function AtlasBadge({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
/** Mark plus name, for a footer or a nav. */
declare function AtlasWordmark({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { AtlasBadge, AtlasMark, AtlasWordmark };
//# sourceMappingURL=atlas-mark.d.ts.map
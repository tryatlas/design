/**
 * The Atlas mark: three rising strokes.
 *
 * `currentColor`, so it takes the ink of whatever it sits in — a rail item,
 * a login header, a workspace switcher trigger. Our own mark, unlike the
 * third-party ones in `brand-marks.tsx`, has no fixed colour.
 */
declare function AtlasMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/**
 * The mark in its rounded container, as it appears above an auth form.
 *
 * `tone="theme"` (the default) inks the tile with the theme: dark on a light
 * theme, light on a dark one. `tone="app-icon"` is the app icon's tile, black
 * with a white mark in every theme, as desktop drew it from 32px up (the
 * `atlas-icon.svg` tile): where the badge stands for the app itself (a
 * welcome screen, an about box), it should look like the icon in the Dock.
 */
type AtlasBadgeTone = "theme" | "app-icon";
declare function AtlasBadge({ className, tone, ...props }: React.ComponentProps<"div"> & {
    tone?: AtlasBadgeTone;
}): import("react").JSX.Element;
/** Mark plus name, for a footer or a nav. */
declare function AtlasWordmark({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { AtlasBadge, AtlasMark, AtlasWordmark };
export type { AtlasBadgeTone };
//# sourceMappingURL=atlas-mark.d.ts.map
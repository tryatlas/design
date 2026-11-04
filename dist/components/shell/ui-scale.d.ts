/**
 * The interface-scale control: a stepper, the named presets with a preview
 * glyph, and Reset. Desktop's `UiScalePanel`, made props-only.
 *
 * It owns no state and applies nothing. HOW a scale is applied is the app's:
 * desktop sets the native WebView zoom, and a browser app wants CSS `zoom` on
 * the root (or the browser's own zoom). Scaling the root font size does not
 * work — the type scale, control heights and radii are px, so only the
 * rem-based spacing would grow.
 */
export declare const UI_SCALE_MIN = 0.5;
export declare const UI_SCALE_MAX = 2;
export declare const UI_SCALE_STEP = 0.1;
export declare const UI_SCALE_DEFAULT = 1;
/** The named steps. The stepper still moves on the `UI_SCALE_STEP` grid; a
 *  preset is just a shortcut to a size worth naming. */
export declare const UI_SCALE_PRESETS: readonly [{
    readonly value: 0.9;
    readonly label: "Compact";
}, {
    readonly value: 1;
    readonly label: "Default";
}, {
    readonly value: 1.15;
    readonly label: "Large";
}, {
    readonly value: 1.3;
    readonly label: "Larger";
}];
/** Round to a clean grid and clamp, so repeated steps do not drift. */
export declare function clampUiScale(scale: number): number;
/** The keys that step the scale, shown dimmed in the stepper's hints. */
export type UiScaleShortcuts = {
    /** e.g. "⌘-" */
    decrease?: React.ReactNode;
    /** e.g. "⌘+" */
    increase?: React.ReactNode;
};
type UiScaleProps = {
    scale: number;
    /** Called with a value already clamped to the range and the grid. */
    onScaleChange: (next: number) => void;
    /**
     * Give the stepper's buttons hints — "Smaller ⌘-", "Larger ⌘+" — for an app
     * whose shortcuts also zoom. The keys are the app's (it owns the bindings),
     * and either may be left out for a bare "Smaller". Without it the buttons
     * have no hint, only their accessible names.
     */
    shortcuts?: UiScaleShortcuts;
};
/** The panel itself, for a menu's submenu or a popover. */
declare function UiScalePanel({ scale, onScaleChange, shortcuts }: UiScaleProps): import("react").JSX.Element;
/** The panel behind a trigger, for a toolbar or a rail footer. */
declare function UiScaleControl({ scale, onScaleChange, className, iconOnly, shortcuts, }: UiScaleProps & {
    className?: string;
    /** Just the glyph, for a tight toolbar; the percentage stays in the label. */
    iconOnly?: boolean;
}): import("react").JSX.Element;
export { UiScaleControl, UiScalePanel };
//# sourceMappingURL=ui-scale.d.ts.map
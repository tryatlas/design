/**
 * A tray with an arrow that springs up out of it — "share" / "send out".
 *
 * Animates on hover by itself, or through a ref (`startAnimation` /
 * `stopAnimation`) so a whole button can drive it. `currentColor`, at the
 * system's icon stroke so it sits beside Lucide glyphs.
 */
export type UploadIconHandle = {
    startAnimation: () => void;
    stopAnimation: () => void;
};
declare const UploadIcon: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    size?: number;
    strokeWidth?: number;
    /** When true, hover on the icon itself does nothing; the parent drives it. */
    controlled?: boolean;
} & import("react").RefAttributes<UploadIconHandle>>;
export { UploadIcon };
//# sourceMappingURL=upload-icon.d.ts.map
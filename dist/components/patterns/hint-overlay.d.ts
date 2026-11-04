interface HintOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Where to look for targets; the whole document by default. */
    root?: ParentNode | null;
    /** The label letters, easiest first. */
    alphabet?: string;
    /** True lets the key through untouched (the host's own trigger). */
    ignoreKey?: (e: KeyboardEvent) => boolean;
    /** After a target was activated: clicked, or (⌥ held, or a field) focused. */
    onActivate?: (el: HTMLElement, mode: "click" | "focus") => void;
    /** The focus modifier's glyph in the legend; "Alt" off macOS. */
    focusKeyLabel?: string;
}
declare function HintOverlay({ open, onOpenChange, root, alphabet, ignoreKey, onActivate, focusKeyLabel, }: HintOverlayProps): import("react").ReactPortal | null;
export { HintOverlay };
export type { HintOverlayProps };
//# sourceMappingURL=hint-overlay.d.ts.map
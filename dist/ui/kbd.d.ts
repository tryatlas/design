import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { kbdVariants } from "./kbd-variants.ts";
/**
 * A keycap (decision 32).
 *
 * shadcn's base-style `Kbd` in shape, moved onto the Foundations scales: the
 * cap is `--control-xs` tall rather than a hand-written 18px, its corner is
 * `rounded` (the control radius) rather than a literal 4px, and its text is
 * `text-2xs`.
 *
 * `KbdKeys` and `KbdCombo` are the two ways the app actually uses it — from a
 * `displayKeys` array, or from a glyph string like "⌘⇧F".
 */
export interface KbdProps extends React.ComponentProps<"kbd">, VariantProps<typeof kbdVariants> {
}
declare function Kbd({ className, variant, size, ...props }: KbdProps): React.JSX.Element;
declare function KbdGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
/** Render a list of keycaps (["⌘", "⇧", "B"]) — the form `displayKeys` produces. */
declare function KbdKeys({ keys, className }: {
    keys: readonly string[];
    className?: string;
}): React.JSX.Element;
/** Convenience: render a glyph string ("⌘⇧F", "⌥Space") as a KbdGroup. Every
 *  modifier glyph is its own cap; the remainder ("F", "Space") is one cap. */
declare function KbdCombo({ combo, className }: {
    combo: string;
    className?: string;
}): React.JSX.Element;
export { Kbd, KbdGroup, KbdKeys, KbdCombo, kbdVariants };
//# sourceMappingURL=kbd.d.ts.map
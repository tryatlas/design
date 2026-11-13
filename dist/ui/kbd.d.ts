import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import type { KeyPlatform } from "../lib/combo.ts";
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
 *
 * All three draw for the host's keyboard: on Windows and Linux a modifier
 * glyph becomes its word (⌘ → Ctrl, ⌥ → Alt; `platformKeys`). `platform`
 * overrides the detection, for a screenshot or a settings page that shows
 * another platform's keys.
 */
export interface KbdProps extends React.ComponentProps<"kbd">, VariantProps<typeof kbdVariants> {
    /** Unset, detected from the user agent (a server render draws `"mac"`). */
    platform?: KeyPlatform;
}
declare function Kbd({ className, variant, size, platform, children, ...props }: KbdProps): React.JSX.Element;
declare function KbdGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
interface KbdKeysProps extends VariantProps<typeof kbdVariants> {
    keys: readonly string[];
    className?: string;
    /** Unset, detected from the user agent. */
    platform?: KeyPlatform;
}
/** Render a list of keycaps (["⌘", "⇧", "B"]) — the form `displayKeys` produces. */
declare function KbdKeys({ keys, className, platform, variant, size }: KbdKeysProps): React.JSX.Element;
/** Convenience: render a glyph string ("⌘⇧F", "⌥Space") as a KbdGroup. Every
 *  modifier glyph is its own cap; the remainder ("F", "Space") is one cap. */
declare function KbdCombo({ combo, ...props }: Omit<KbdKeysProps, "keys"> & {
    combo: string;
}): React.JSX.Element;
export { Kbd, KbdGroup, KbdKeys, KbdCombo, kbdVariants };
export type { KbdKeysProps };
//# sourceMappingURL=kbd.d.ts.map
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.js";
import { splitGlyphCombo } from "../lib/combo.js";
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
const kbdVariants = cva([
    "pointer-events-none inline-flex w-fit items-center justify-center gap-1 select-none",
    "rounded border border-border bg-card text-muted-foreground",
    "px-1.5 font-sans leading-none",
    "[&_svg:not([class*='size-'])]:size-3",
], {
    variants: {
        // `inverse` is a cap sitting on a primary-filled control (the ↵ on a
        // dialog's default action): the background colour, at low alpha for the
        // fill and edge, so it reads on whatever the primary token is.
        variant: {
            default: "",
            inverse: "border-background/20 bg-background/10 text-background",
            // `soft` is a borderless filled cap in the foreground colour, for a
            // legend of keys beside their labels (the command palette's footer:
            // "↑ ↓ Navigate · Enter Select · Esc Close").
            soft: "border-transparent bg-element-active text-foreground",
        },
        size: {
            xs: "h-control-xs min-w-(--control-xs) text-2xs",
            sm: "h-control-sm min-w-(--control-sm) text-xs",
        },
    },
    defaultVariants: { variant: "default", size: "xs" },
});
function Kbd({ className, variant, size, ...props }) {
    return (_jsx("kbd", { "data-slot": "kbd", className: cn(kbdVariants({ variant, size }), className), ...props }));
}
function KbdGroup({ className, ...props }) {
    return (_jsx("div", { "data-slot": "kbd-group", className: cn("inline-flex items-center gap-1", className), ...props }));
}
/** Render a list of keycaps (["⌘", "⇧", "B"]) — the form `displayKeys` produces. */
function KbdKeys({ keys, className }) {
    return (_jsx(KbdGroup, { className: className, children: keys.map((k, i) => (_jsx(Kbd, { children: k }, `${k}-${i}`))) }));
}
/** Convenience: render a glyph string ("⌘⇧F", "⌥Space") as a KbdGroup. Every
 *  modifier glyph is its own cap; the remainder ("F", "Space") is one cap. */
function KbdCombo({ combo, className }) {
    return _jsx(KbdKeys, { keys: splitGlyphCombo(combo), className: className });
}
export { Kbd, KbdGroup, KbdKeys, KbdCombo, kbdVariants };
//# sourceMappingURL=kbd.js.map
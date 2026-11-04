"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { splitGlyphCombo } from "../lib/combo.js";
import { kbdVariants } from "./kbd-variants.js";
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
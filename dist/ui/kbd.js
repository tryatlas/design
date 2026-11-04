"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { platformKey, platformKeys, splitGlyphCombo, detectKeyPlatform } from "../lib/combo.js";
import { kbdVariants } from "./kbd-variants.js";
const subscribeNever = () => () => { };
const serverPlatform = () => "mac";
/** `platform`, else the host's. Server and first client render agree on
 *  `"mac"`, then the client settles on its own without a hydration error. */
function useKeyPlatform(platform) {
    const detected = React.useSyncExternalStore(subscribeNever, detectKeyPlatform, serverPlatform);
    return platform ?? detected;
}
function Kbd({ className, variant, size, platform, children, ...props }) {
    const resolved = useKeyPlatform(platform);
    return (_jsx("kbd", { "data-slot": "kbd", className: cn(kbdVariants({ variant, size }), className), ...props, children: typeof children === "string" ? platformKey(children, resolved) : children }));
}
function KbdGroup({ className, ...props }) {
    return (_jsx("div", { "data-slot": "kbd-group", className: cn("inline-flex items-center gap-1", className), ...props }));
}
/** Render a list of keycaps (["⌘", "⇧", "B"]) — the form `displayKeys` produces. */
function KbdKeys({ keys, className, platform, variant, size }) {
    const resolved = useKeyPlatform(platform);
    return (_jsx(KbdGroup, { className: className, children: platformKeys(keys, resolved).map((k, i) => (_jsx(Kbd, { platform: resolved, variant: variant, size: size, children: k }, `${k}-${i}`))) }));
}
/** Convenience: render a glyph string ("⌘⇧F", "⌥Space") as a KbdGroup. Every
 *  modifier glyph is its own cap; the remainder ("F", "Space") is one cap. */
function KbdCombo({ combo, ...props }) {
    return _jsx(KbdKeys, { keys: splitGlyphCombo(combo), ...props });
}
export { Kbd, KbdGroup, KbdKeys, KbdCombo, kbdVariants };
//# sourceMappingURL=kbd.js.map
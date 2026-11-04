/** Split a legacy glyph string ("⌘⇧F", "⌥Space") into keycaps: every modifier
 *  glyph is its own cap, the remainder is one cap. Copied from desktop's
 *  `features/keybindings/lib/combo.ts`, the one pure piece `Kbd` needs. */
export function splitGlyphCombo(combo) {
    const keys = [];
    let rest = combo;
    while (rest.length > 0 && "⌃⌥⇧⌘".includes(rest[0])) {
        keys.push(rest[0]);
        rest = rest.slice(1);
    }
    if (rest)
        keys.push(rest);
    return keys;
}
/** The host's keyboard, from the user agent. Without a `navigator` (a server
 *  render) it answers `"mac"`, the platform glyph strings are written for. */
export function detectKeyPlatform() {
    if (typeof navigator === "undefined")
        return "mac";
    const nav = navigator;
    const name = nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
    return /mac|iphone|ipad|ipod/i.test(name) ? "mac" : "other";
}
/** One modifier glyph as Windows and Linux spell it. */
const OTHER_MODIFIER = {
    "⌃": "Ctrl",
    "⌘": "Ctrl",
    "⌥": "Alt",
    "⇧": "Shift",
};
/** A single keycap for `platform`: on a Mac as written, elsewhere a modifier
 *  glyph becomes its word (⌘ and ⌃ → Ctrl, ⌥ → Alt, ⇧ → Shift). */
export function platformKey(key, platform) {
    return platform === "mac" || !Object.hasOwn(OTHER_MODIFIER, key) ? key : OTHER_MODIFIER[key];
}
/**
 * Keycaps for `platform`. On a Mac, unchanged. Elsewhere the modifier glyphs
 * become words in the Windows order, Ctrl, Alt, Shift, then the key, as
 * desktop's `displayKeys` draws them: ⌘ reads as Ctrl because that is the key
 * a ⌘ shortcut answers to there, and ⌃⌘ together read as Ctrl Win.
 * Anything already a word ("Ctrl", "Enter") passes through.
 */
export function platformKeys(keys, platform) {
    if (platform === "mac")
        return [...keys];
    const has = (glyph) => keys.includes(glyph);
    const rest = keys.filter((k) => !Object.hasOwn(OTHER_MODIFIER, k));
    const mods = [];
    if (has("⌃"))
        mods.push("Ctrl");
    if (has("⌘"))
        mods.push(has("⌃") ? "Win" : "Ctrl");
    if (has("⌥"))
        mods.push("Alt");
    if (has("⇧"))
        mods.push("Shift");
    return [...mods, ...rest];
}
//# sourceMappingURL=combo.js.map
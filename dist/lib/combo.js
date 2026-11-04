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
//# sourceMappingURL=combo.js.map
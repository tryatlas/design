/** Split a legacy glyph string ("⌘⇧F", "⌥Space") into keycaps: every modifier
 *  glyph is its own cap, the remainder is one cap. Copied from desktop's
 *  `features/keybindings/lib/combo.ts`, the one pure piece `Kbd` needs. */
export declare function splitGlyphCombo(combo: string): string[];
/** Which keyboard a keycap is drawn for: a Mac's glyphs, or everyone else's words. */
export type KeyPlatform = "mac" | "other";
/** The host's keyboard, from the user agent. Without a `navigator` (a server
 *  render) it answers `"mac"`, the platform glyph strings are written for. */
export declare function detectKeyPlatform(): KeyPlatform;
/** A single keycap for `platform`: on a Mac as written, elsewhere a modifier
 *  glyph becomes its word (⌘ and ⌃ → Ctrl, ⌥ → Alt, ⇧ → Shift). */
export declare function platformKey(key: string, platform: KeyPlatform): string;
/**
 * Keycaps for `platform`. On a Mac, unchanged. Elsewhere the modifier glyphs
 * become words in the Windows order, Ctrl, Alt, Shift, then the key, as
 * desktop's `displayKeys` draws them: ⌘ reads as Ctrl because that is the key
 * a ⌘ shortcut answers to there, and ⌃⌘ together read as Ctrl Win.
 * Anything already a word ("Ctrl", "Enter") passes through.
 */
export declare function platformKeys(keys: readonly string[], platform: KeyPlatform): string[];
//# sourceMappingURL=combo.d.ts.map
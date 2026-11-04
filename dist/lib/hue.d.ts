import type { LabelTone } from "./types.ts";
/**
 * The identity hues: the theme's eight-hue palette, plus `grey` for an
 * identity with no hue.
 *
 * A hue is an IDENTITY, not a status: `purple` means "the Design label", not
 * "informational". Each reads through a `--color-hue-*` utility
 * (`utilities.css`), which points at its own theme key, `hue.<name>`, derived
 * from the theme's palette hue of that name — so a tone keeps its meaning
 * across themes even though its numbers change, and a theme can still set
 * the key when its chips want something other than its palette.
 */
export declare const HUES: ReadonlyArray<LabelTone>;
/** Full class strings per hue, so Tailwind sees every one of them. */
export declare const HUE_BG: Record<LabelTone, string>;
/** A tinted chip: the hue at 12% under the hue's own ink, the same recipe
 *  a status `Badge` uses (its fill is its foreground at 12%). */
export declare const HUE_CHIP: Record<LabelTone, string>;
/**
 * A stable hue for an arbitrary key, so the same entity keeps its colour
 * forever — a project is always the same hue on every screen, in every
 * session, without anyone assigning it. `grey` is left out: it is the
 * absence of an identity, not one of them.
 */
export declare function hueFor(key: string): LabelTone;
//# sourceMappingURL=hue.d.ts.map
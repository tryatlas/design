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
export const HUES = [
    "grey",
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
];
/** Full class strings per hue, so Tailwind sees every one of them. */
export const HUE_BG = {
    grey: "bg-hue-grey",
    red: "bg-hue-red",
    orange: "bg-hue-orange",
    yellow: "bg-hue-yellow",
    green: "bg-hue-green",
    cyan: "bg-hue-cyan",
    blue: "bg-hue-blue",
    purple: "bg-hue-purple",
    pink: "bg-hue-pink",
};
/** A tinted chip: the hue at 12% under the hue's own ink, the same recipe
 *  a status `Badge` uses (its fill is its foreground at 12%). */
export const HUE_CHIP = {
    grey: "bg-hue-grey/12 text-hue-grey",
    red: "bg-hue-red/12 text-hue-red",
    orange: "bg-hue-orange/12 text-hue-orange",
    yellow: "bg-hue-yellow/12 text-hue-yellow",
    green: "bg-hue-green/12 text-hue-green",
    cyan: "bg-hue-cyan/12 text-hue-cyan",
    blue: "bg-hue-blue/12 text-hue-blue",
    purple: "bg-hue-purple/12 text-hue-purple",
    pink: "bg-hue-pink/12 text-hue-pink",
};
/**
 * A stable hue for an arbitrary key, so the same entity keeps its colour
 * forever — a project is always the same hue on every screen, in every
 * session, without anyone assigning it. `grey` is left out: it is the
 * absence of an identity, not one of them.
 */
export function hueFor(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return HUES[1 + (hash % (HUES.length - 1))];
}
//# sourceMappingURL=hue.js.map
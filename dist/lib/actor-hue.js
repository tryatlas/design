import { HUES, hueFor } from "./hue.js";
/**
 * A collaborator's identity hue on a canvas.
 *
 * Every Spaces client publishes a colour from one fixed list of eight hex
 * values (desktop's `ACTOR_COLOURS`, web's awareness module), derived from
 * the actor's id so two clients agree without a round trip. Painting that hex
 * would put raw palette ink on the page, so the hex is only a lookup key into
 * the theme's identity hues: the same person reads in the same hue on every
 * client, and the hue follows the theme.
 *
 * The map is the web client's, verbatim, so web and desktop agree on every
 * actor today; that includes the pink wire colour reading as `red`.
 */
// Each key carries its own marker: the ratchet's exit is per line. These are
// the wire colours every Spaces client publishes; lookup keys, never painted.
export const ACTOR_COLOUR_HUE = {
    "#e11d48": "red", // ratchet-allow: wire colour, a lookup key only
    "#ea580c": "orange", // ratchet-allow: wire colour, a lookup key only
    "#ca8a04": "yellow", // ratchet-allow: wire colour, a lookup key only
    "#16a34a": "green", // ratchet-allow: wire colour, a lookup key only
    "#0891b2": "cyan", // ratchet-allow: wire colour, a lookup key only
    "#2563eb": "blue", // ratchet-allow: wire colour, a lookup key only
    "#7c3aed": "purple", // ratchet-allow: wire colour, a lookup key only
    "#db2777": "red", // ratchet-allow: wire colour, a lookup key only
};
/**
 * The hue for an actor: their published colour when it is one of the eight,
 * else a stable hue from their id. Never `grey`, which on a cursor reads as
 * "disabled".
 */
export function actorHue(actor) {
    const mapped = actor.colour ? ACTOR_COLOUR_HUE[actor.colour.toLowerCase()] : undefined;
    if (mapped)
        return mapped;
    const hue = hueFor(actor.id);
    return hue === "grey" ? HUES[1] : hue;
}
/**
 * A peer's ink per hue, spelled out so Tailwind sees every class: `text` for
 * the cursor arrow, `bg` for its name label, `ring` for their face in the
 * presence pill, `outline` for a node they have selected.
 */
export const PEER_INK = {
    grey: {
        text: "text-hue-grey",
        bg: "bg-hue-grey",
        ring: "ring-hue-grey",
        outline: "outline-hue-grey",
    },
    red: { text: "text-hue-red", bg: "bg-hue-red", ring: "ring-hue-red", outline: "outline-hue-red" },
    orange: {
        text: "text-hue-orange",
        bg: "bg-hue-orange",
        ring: "ring-hue-orange",
        outline: "outline-hue-orange",
    },
    yellow: {
        text: "text-hue-yellow",
        bg: "bg-hue-yellow",
        ring: "ring-hue-yellow",
        outline: "outline-hue-yellow",
    },
    green: {
        text: "text-hue-green",
        bg: "bg-hue-green",
        ring: "ring-hue-green",
        outline: "outline-hue-green",
    },
    cyan: {
        text: "text-hue-cyan",
        bg: "bg-hue-cyan",
        ring: "ring-hue-cyan",
        outline: "outline-hue-cyan",
    },
    blue: {
        text: "text-hue-blue",
        bg: "bg-hue-blue",
        ring: "ring-hue-blue",
        outline: "outline-hue-blue",
    },
    purple: {
        text: "text-hue-purple",
        bg: "bg-hue-purple",
        ring: "ring-hue-purple",
        outline: "outline-hue-purple",
    },
    pink: {
        text: "text-hue-pink",
        bg: "bg-hue-pink",
        ring: "ring-hue-pink",
        outline: "outline-hue-pink",
    },
};
//# sourceMappingURL=actor-hue.js.map
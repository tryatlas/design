import type { LabelTone } from "./types.ts";
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
export declare const ACTOR_COLOUR_HUE: Readonly<Record<string, LabelTone>>;
/**
 * The hue for an actor: their published colour when it is one of the eight,
 * else a stable hue from their id. Never `grey`, which on a cursor reads as
 * "disabled".
 */
export declare function actorHue(actor: {
    id: string;
    colour?: string | null;
}): LabelTone;
/**
 * A peer's ink per hue, spelled out so Tailwind sees every class: `text` for
 * the cursor arrow, `bg` for its name label, `ring` for their face in the
 * presence pill, `outline` for a node they have selected.
 */
export declare const PEER_INK: Record<LabelTone, {
    text: string;
    bg: string;
    ring: string;
    outline: string;
}>;
//# sourceMappingURL=actor-hue.d.ts.map
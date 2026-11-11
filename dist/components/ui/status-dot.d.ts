/**
 * A status or presence dot: the small circle that leads a pill, a row or a
 * legend entry, sits on an avatar's corner, or marks an icon as unread.
 *
 * Desktop and web each drew their own (the capture dot, the room state, the
 * web's presence dot) with the same few tones and sizes; this is that one
 * mark. It takes its colour from `tone`, as ink: the dot is `bg-current`, or
 * a ring in `border-current` when `hollow`, so a tone is one `text-*` token
 * and the dot can never be a colour a theme does not set.
 *
 *   neutral     muted ink: done, idle, a legend's "other"
 *   subtle      the strong border: offline, absent, "not on"
 *   success     live, online, capturing, merged
 *   warning     away, degraded, needs a look
 *   error       failed, stopped
 *   info        informational, in review
 *   primary     unread, new, wants attention
 *   foreground  a plain mark on an icon ("this filter is set")
 *
 * Presence reads `success` online, `warning` away and `subtle` offline.
 *
 * `hollow` is a ring rather than a disc, so the state reads without colour:
 * a solid dot is on (or faulted), a ring is off. `cutout` rings the dot in
 * the surface it sits on, so on an avatar's corner it reads as cut out of the
 * photo rather than stuck on top of it; name that surface.
 *
 * Sizes, by what the dot sits beside: `xs` 4px (a dense legend), `sm` 6px
 * (text and small avatars, the default), `md` 8px (a row's lead), `lg` 10px
 * (a medium or large avatar).
 *
 * A dot is decorative unless it is the only place the state is written:
 * give it a `label` ("Online") and it becomes `role="img"` with that name.
 * Without one it is `aria-hidden`, and the text beside it carries the state.
 */
export type StatusDotTone = "neutral" | "subtle" | "success" | "warning" | "error" | "info" | "primary" | "foreground";
export type StatusDotSize = "xs" | "sm" | "md" | "lg";
/** The surfaces a `cutout` ring can match. */
export type StatusDotCutout = "background" | "card" | "popover" | "sidebar" | "panel";
export type StatusDotProps = React.ComponentProps<"span"> & {
    tone?: StatusDotTone;
    size?: StatusDotSize;
    /** A ring instead of a disc: the "off" shape. */
    hollow?: boolean;
    /** The surface under the dot, drawn as a 2px ring around it. */
    cutout?: StatusDotCutout;
    /** The state in words, when nothing beside the dot says it. */
    label?: string;
};
declare function StatusDot({ className, tone, size, hollow, cutout, label, ...props }: StatusDotProps): import("react").JSX.Element;
export { StatusDot };
//# sourceMappingURL=status-dot.d.ts.map
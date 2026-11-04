import { type IconSize } from "./icon.tsx";
/**
 * Icon glyphs that animate on a state change (decision 33).
 *
 * `Icon` (decision 30) renders a Lucide glyph and nothing else, which is right
 * for the ~900 static call sites. A handful of controls want the glyph itself to
 * carry the state change — the copy button that confirms, the trash whose lid
 * tips, the send arrow that leaves. Those need per-path control, so they are
 * hand-written SVG here rather than Lucide components.
 *
 * Atlas has no JS animation runtime and does not want one: every animation
 * below is CSS, so it runs on the compositor thread rather than competing with
 * React and the IPC channel on the main thread. Three decisions follow:
 *
 *  - **`scaleX`, not `width`.** Animating the width of the sidebar
 *    rail and the menu bars would Width is a layout property — it reflows the
 *    subtree on every frame. `scaleX` against a `transform-origin` is
 *    composited, and these are bare bars with no content to squash; the only
 *    thing it distorts is a cap or corner radius under a pixel wide.
 *  - **No `AnimatePresence`.** The copy→check swap keeps both glyphs mounted and
 *    crossfades them. Two 14px SVGs cost less than an exit-animation runtime,
 *    and it removes the unmount race you would get if you click twice fast.
 *  - **`pathLength="1"`.** A path-length animation is done with
 *    `stroke-dasharray`/`stroke-dashoffset` in normalised units, so the keyframe
 *    never has to know the real path length.
 *
 * Everything hover-driven is a plain `transition-*` at `duration-fast`. Only the
 * three one-shot, click-driven animations need a keyframe; those live in
 * `globals.css` next to the rest of the motion scale, with their reduced-motion
 * handling. Durations and easings come from decision 29 — there are four and
 * three of them, and these add none.
 *
 * All glyphs are **controlled**: they take the state, they don't own it. The
 * caller already has it (`copied`, `expanded`, `open`), and a glyph that kept
 * its own copy would drift from the button it sits in.
 *
 * Nothing here is positioned in CSS pixels. Overlaying a `<span>` on the SVG
 * for the rail, the menu bars and the mute slash would fix their geometry in px
 * while the glyph around them scales with `size` — they would line up at
 * exactly one size and be wrong at the other four. Every moving part is
 * drawn in viewBox units instead.
 */
interface GlyphProps {
    size?: IconSize;
    className?: string;
}
/**
 * Copy → check. The check draws itself on rather than appearing, which is the
 * only part of the gesture that confirms the clipboard actually took it.
 *
 * Both glyphs stay mounted; `copied` crossfades between them. The check's draw
 * is keyed off the same flag, so re-copying replays it.
 *
 * The transition list names `scale`, not `transform`. Tailwind v4 compiles
 * `scale-75` to the standalone `scale` property rather than into `transform`,
 * and an arbitrary `transition-[…]` is passed through verbatim — so
 * `transition-[opacity,transform]` reads as correct, type-checks, lints, and
 * silently drops the scale half of the crossfade. (The bare `transition-transform`
 * utility is safe: v4 expands it to `transform, translate, scale, rotate`.)
 */
export declare function CopyGlyph({ copied, size, className }: GlyphProps & {
    copied: boolean;
}): import("react").JSX.Element;
/**
 * Trash whose lid tips off to the right. `armed` is for a destructive control
 * that confirms in place — the lid opening is the "are you sure" beat. On a
 * plain delete button, drive it from hover instead and the lid lifts as the
 * pointer arrives.
 *
 * The lid rotates about its right edge so it hinges rather than spinning.
 */
export declare function TrashGlyph({ armed, size, className }: GlyphProps & {
    armed: boolean;
}): import("react").JSX.Element;
/**
 * Send arrow that leaves and is replaced by the next one. `sending` is a pulse,
 * not a state: set it true on submit and false when the keyframe ends, which is
 * what `onAnimationEnd` is for. The caller owning that flag is deliberate —
 * the animation should track the actual send, not a timer that guesses at it.
 */
export declare function SendGlyph({ sending, size, className, onAnimationEnd, }: GlyphProps & {
    sending: boolean;
    onAnimationEnd?: () => void;
}): import("react").JSX.Element;
/**
 * Sidebar rail that thickens — the panel-toggle glyph. `open` thickens the rail
 * to read as "the panel is showing".
 *
 * `scaleX` from the left edge, so no reflow. The rail is a plain rounded bar,
 * and at these widths the radius distortion from scaling is sub-pixel.
 *
 * The rail is drawn **inside the viewBox**, not as a positioned `<span>` over
 * it. An overlaid span has to be placed in CSS pixels, but the box it sits in
 * is placed in viewBox units that scale with `size` — the two only agree at one
 * size, and at `xs` a 9px bar is taller than the 7.5px box. In viewBox units
 * both scale together, so the glyph is correct at all five.
 *
 * It is a filled `<rect>` rather than a stroked line because `scaleX` scales a
 * stroke's caps with it; a fill has no caps to distort.
 */
export declare function RailGlyph({ open, size, className }: GlyphProps & {
    open: boolean;
}): import("react").JSX.Element;
/**
 * Three bars that shuffle their widths — the "more" / overflow glyph. The
 * original toggles this on click; hover is the better trigger for a menu
 * affordance, so `active` is left to the caller and `group-hover` works too.
 *
 * Bars are viewBox paths for the same reason `RailGlyph`'s rail is: the flex
 * version fixed the bar height and gap in CSS pixels while taking its width
 * from `size`, so the glyph went from square at `xs` to squat at `xl`. All
 * three are right-aligned to x=21 at full, half and three-quarter width.
 */
export declare function MenuGlyph({ active, size, className }: GlyphProps & {
    active: boolean;
}): import("react").JSX.Element;
/**
 * Plus ↔ minus, rotating through each other.
 *
 * Two bars, not two Lucide glyphs: one horizontal bar stays put and a second
 * rotates 90° down onto it, so the plus *becomes* the minus. An earlier version
 * crossfaded Lucide's `Plus` and `Minus` and rotated the plus 90° — but a plus
 * has four-fold symmetry, so that rotation is a visual no-op and the effect
 * degraded to a plain crossfade. Rotating one arm is the gesture that
 * reads correctly.
 *
 * `transform-origin` is left at the default `view-box` here, unlike the other
 * glyphs. It resolves `origin-center` to (12, 12), which is already the bar's
 * own midpoint — the bar spans x:5–19 at y=12. There is nothing to override, so
 * the `fill-box` the rail and the menu bars need would only add noise.
 *
 * Atlas's 13 chevron expand/collapse sites already rotate a single `ChevronDown`
 * and need nothing from this file. Use this where the control adds rather than
 * reveals — a "new item" button that becomes "cancel".
 */
export declare function PlusMinusGlyph({ open, size, className }: GlyphProps & {
    open: boolean;
}): import("react").JSX.Element;
/**
 * Bell that rings once, and carries a mute slash. `ringing` is a pulse like
 * `SendGlyph`'s `sending` — raise it when a notification actually arrives, not
 * on a timer.
 *
 * The slash wipes across the bell rather than fading in, which is what
 * distinguishes "muted" from "the icon is just dim". It is a `stroke-dashoffset`
 * transition on a `pathLength="1"` path — the same normalised trick as the copy
 * check, and paint-bound for the same reason and at the same negligible cost.
 *
 * It sits in its own `<svg>` so the ring does not swing it: a slash welded to
 * the bell would rock with it and read as part of the drawing. Drawing it in
 * viewBox units rather than as an overlaid `<span>` keeps it on the bell's own
 * stroke width at every `size`.
 */
export declare function BellGlyph({ ringing, muted, size, className, onAnimationEnd, }: GlyphProps & {
    ringing?: boolean;
    muted?: boolean;
    onAnimationEnd?: () => void;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=animated-icon.d.ts.map
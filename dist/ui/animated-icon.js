"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
import { ICON_SIZES, ICON_STROKE_WIDTH } from "./icon.js";
/** Shared SVG attributes so every glyph matches `Icon`'s weight and hinting. */
function svgProps(size) {
    return {
        width: ICON_SIZES[size],
        height: ICON_SIZES[size],
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: ICON_STROKE_WIDTH,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };
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
export function CopyGlyph({ copied, size = "md", className }) {
    return (_jsxs("span", { className: cn("relative inline-grid shrink-0 place-items-center", className), style: { width: ICON_SIZES[size], height: ICON_SIZES[size] }, children: [_jsxs("svg", { ...svgProps(size), className: cn("absolute transition-[opacity,scale] duration-fast ease-out-strong", copied ? "scale-75 opacity-0" : "scale-100 opacity-100"), children: [_jsx("rect", { x: "8", y: "8", width: "14", height: "14", rx: "2", ry: "2" }), _jsx("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })] }), _jsx("svg", { ...svgProps(size), className: cn("absolute transition-[opacity,scale] duration-fast ease-out-strong", copied ? "scale-100 opacity-100" : "scale-75 opacity-0"), children: _jsx("path", { d: "M20 6 9 17l-5-5", pathLength: 1, strokeDasharray: 1, className: copied ? "animate-icon-check-draw" : "[stroke-dashoffset:1]" }) })] }));
}
/**
 * A check that draws itself on as it mounts: a completion the user waited
 * for ("You're in", a device paired), where a glyph that simply appears
 * says less than one that is written. The draw is 220ms; under reduced
 * motion it still draws, since the draw is the state change, not an
 * embellishment. Remount it (a `key`) to draw it again.
 */
export function CheckGlyph({ size = "md", className }) {
    return (_jsx("svg", { ...svgProps(size), className: cn("shrink-0", className), children: _jsx("path", { d: "M20 6 9 17l-5-5", pathLength: 1, strokeDasharray: 1, className: "animate-icon-check-draw" }) }));
}
/**
 * Trash whose lid tips off to the right. `armed` is for a destructive control
 * that confirms in place — the lid opening is the "are you sure" beat. On a
 * plain delete button, drive it from hover instead and the lid lifts as the
 * pointer arrives.
 *
 * The lid rotates about its right edge so it hinges rather than spinning.
 */
export function TrashGlyph({ armed, size = "md", className }) {
    return (_jsxs("svg", { ...svgProps(size), overflow: "visible", className: cn("shrink-0", className), children: [_jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }), _jsxs("g", { className: cn("origin-right [transform-box:fill-box] transition-transform duration-base ease-in-out-strong", armed && "rotate-[22deg]"), children: [_jsx("path", { d: "M3 6h18" }), _jsx("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] })] }));
}
/**
 * Send arrow that leaves and is replaced by the next one. `sending` is a pulse,
 * not a state: set it true on submit and false when the keyframe ends, which is
 * what `onAnimationEnd` is for. The caller owning that flag is deliberate —
 * the animation should track the actual send, not a timer that guesses at it.
 */
export function SendGlyph({ sending, size = "md", className, onAnimationEnd, }) {
    return (_jsx("span", { className: cn("inline-grid shrink-0 place-items-center overflow-hidden", className), children: _jsxs("svg", { ...svgProps(size), className: cn("shrink-0", sending && "animate-icon-send"), onAnimationEnd: onAnimationEnd, children: [_jsx("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), _jsx("path", { d: "M6 12h16" })] }) }));
}
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
export function RailGlyph({ open, size = "md", className }) {
    return (_jsxs("svg", { ...svgProps(size), className: cn("shrink-0", className), children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "18", rx: "2" }), _jsx("rect", { x: "5", y: "5.5", width: "2", height: "13", rx: "1", fill: "currentColor", stroke: "none", className: cn("origin-left [transform-box:fill-box] transition-transform duration-fast ease-out-strong", open ? "scale-x-[3]" : "scale-x-100") })] }));
}
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
export function MenuGlyph({ active, size = "md", className }) {
    const bar = "origin-right [transform-box:fill-box] transition-transform duration-fast ease-out-strong";
    return (_jsxs("svg", { ...svgProps(size), className: cn("shrink-0", className), children: [_jsx("path", { d: "M3 6h18", className: cn(bar, active ? "scale-x-50" : "scale-x-100") }), _jsx("path", { d: "M12 12h9", className: cn(bar, active ? "scale-x-[2]" : "scale-x-100") }), _jsx("path", { d: "M7.5 18h13.5", className: cn(bar, active ? "scale-x-[0.667]" : "scale-x-100") })] }));
}
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
export function PlusMinusGlyph({ open, size = "md", className }) {
    return (_jsxs("svg", { ...svgProps(size), className: cn("shrink-0", className), children: [_jsx("path", { d: "M5 12h14" }), _jsx("path", { d: "M5 12h14", className: cn("origin-center transition-transform duration-base ease-in-out-strong", open ? "rotate-0" : "rotate-90") })] }));
}
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
export function BellGlyph({ ringing = false, muted = false, size = "md", className, onAnimationEnd, }) {
    return (_jsxs("span", { className: cn("relative inline-grid shrink-0 place-items-center", className), style: { width: ICON_SIZES[size], height: ICON_SIZES[size] }, children: [_jsxs("svg", { ...svgProps(size), className: cn("absolute origin-top", ringing && "animate-icon-bell-ring"), onAnimationEnd: onAnimationEnd, children: [_jsx("path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }), _jsx("path", { d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" })] }), _jsx("svg", { ...svgProps(size), className: "absolute", children: _jsx("path", { d: "m3 3 18 18", pathLength: 1, strokeDasharray: 1, className: cn("transition-[stroke-dashoffset] duration-fast ease-out-strong", muted ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]") }) })] }));
}
//# sourceMappingURL=animated-icon.js.map
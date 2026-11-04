"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { infiniteAnimationFps } from "../../lib/infinite-animations.js";
import { cn } from "../../lib/utils.js";
import { resolveColor, rgbString } from "../../lib/resolved-color.js";
/**
 * A retro ordered-dither noise field that drifts like slow cloud cover.
 *
 * Ported from the Atlas desktop app's `src/ui/dither-field.tsx`, which the
 * landing site's hero backdrop was in turn ported from — so the login pane,
 * the marketing hero and the app's own empty states all print the same
 * field. The constants below are the landing page's, kept to the value:
 * alpha 0.3 for glyphs and 0.16 for dots, a 12px cell, ~12fps.
 *
 * Two modes over one field. `glyphs` prints a character per 12px cell whose
 * weight tracks the intensity — the ASCII variant the hero uses. `dots`
 * prints 1.5px dots on a 4px grid.
 *
 * Canvas, not DOM: the field is tens of thousands of cells, and that many
 * elements would cost more to lay out than the page they decorate.
 *
 * Stepped at ~12fps on purpose. Ordered dither reads as retro precisely
 * because it snaps; tweened at 60fps it is just noise, and a backdrop does
 * not get a 60fps budget. The loop parks while the tab is hidden, while the
 * element is off screen, and entirely under `prefers-reduced-motion` — which
 * still paints one frame, because the texture is the point and only the
 * drift is the accessibility problem.
 *
 * A 4×4 Bayer matrix turns intensity into density, and a radial hollow keeps
 * the middle calm so copy can sit on the quiet part.
 *
 * The ink is the canvas's own CSS `color` — `text-foreground` unless the
 * `className` says otherwise — read from computed style, because a canvas
 * cannot resolve a custom property. Reading the element rather than <html>
 * means a surface themed differently from the page (an inverted panel) gets
 * its own ink.
 *
 * It needs no `ThemeProvider`. Whatever applies the theme — the provider,
 * desktop's own engine, a Storybook toolbar — changes an attribute on <html>
 * (`data-theme`, `data-appearance`, `class`, `style`), so a MutationObserver
 * there re-reads the ink and repaints, as does the OS switching its colour
 * scheme. Without that a theme flip would leave white glyphs on a white page.
 */
/** The attributes on <html> a theme switch writes, in every app that has one. */
const THEME_ATTRIBUTES = [
    "class",
    "style",
    "data-theme",
    "data-appearance",
    "data-theme-appearance",
];
const GLYPHS = " .·:-=+*#";
const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
];
/** ~12fps. See the note above about why this is not 60. A lower
 *  `--infinite-animation-fps` (see `INFINITE_ANIMATIONS`) lowers it further. */
const FRAME_MS = 80;
/**
 * `ctx.fillStyle` takes a colour STRING and cannot read a custom property,
 * so the ink is the canvas's computed `color`, resolved through the canvas
 * probe in lib/resolved-color — which understands oklch(), unlike a regex.
 */
function inkOf(canvas, alpha) {
    const rgb = resolveColor(getComputedStyle(canvas).color);
    return rgb ? rgbString(rgb, alpha) : `rgb(255 255 255 / ${alpha})`; // ratchet-allow: fallback when the computed colour cannot be resolved, e.g. no 2D context
}
function DitherField({ mode = "glyphs", hollow, ink = 1, className }) {
    const ref = useRef(null);
    const hollowStart = hollow?.[0];
    const hollowSpan = hollow?.[1];
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const CELL = mode === "glyphs" ? 12 : 4;
        const [h0, h1] = hollowStart != null && hollowSpan != null
            ? [hollowStart, hollowSpan]
            : mode === "glyphs"
                ? [0.34, 0.5]
                : [0.22, 0.55];
        let raf = 0;
        let last = 0;
        const fps = infiniteAnimationFps(canvas);
        const frameMs = Math.max(FRAME_MS, fps ? 1000 / fps : 0);
        let visible = document.visibilityState === "visible";
        let onScreen = true;
        const alpha = Math.min(1, (mode === "glyphs" ? 0.3 : 0.16) * ink);
        // Read once per theme, not per frame: a computed-style read and a probe
        // paint are cheap, but not free at 12fps for the life of the page.
        let fill = inkOf(canvas, alpha);
        // Two octaves of value noise plus a slow third, so shapes morph rather
        // than only translate.
        const noiseAt = (x, y, phase) => {
            const a = Math.sin(x * 0.012 + Math.sin(y * 0.009 + phase) * 2.1);
            const b = Math.sin(y * 0.011 - Math.cos(x * 0.007 - phase) * 1.7);
            const c = Math.sin((x + y) * 0.004 + 1.3 + phase * 2);
            return (a + b + c) / 3; // -1..1
        };
        const draw = (t) => {
            const parent = canvas.parentElement;
            if (!parent)
                return;
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            if (!w || !h)
                return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const bw = Math.ceil(w * dpr);
            const bh = Math.ceil(h * dpr);
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw;
                canvas.height = bh;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            // Wind: mostly sideways, a little lift, plus a slow phase evolution.
            const wx = t * 0.012;
            const wy = t * 0.003;
            const phase = t * 0.0004;
            const cx = w / 2;
            const cy = h / 2;
            const maxR = Math.hypot(cx, cy);
            ctx.fillStyle = fill;
            if (mode === "glyphs") {
                ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
                ctx.textBaseline = "top";
            }
            for (let gy = 0; gy < h / CELL; gy++) {
                for (let gx = 0; gx < w / CELL; gx++) {
                    const x = gx * CELL;
                    const y = gy * CELL;
                    let v = (noiseAt(x + wx, y + wy, phase) + 1) / 2;
                    const r = Math.hypot(x - cx, y - cy) / maxR;
                    v *= Math.min(1, Math.max(0, (r - h0) / h1));
                    if (mode === "glyphs") {
                        const i = Math.min(GLYPHS.length - 1, Math.floor(v * v * GLYPHS.length));
                        if (i > 0 && v * 16 > BAYER[gy % 4][gx % 4] * 0.6) {
                            ctx.fillText(GLYPHS[i], x, y);
                        }
                    }
                    else if (v * 16 > BAYER[gy % 4][gx % 4]) {
                        ctx.fillRect(x, y, 1.5, 1.5);
                    }
                }
            }
        };
        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            // Step gate: repaint only once a frame's worth of drift has accrued.
            if (now - last < frameMs)
                return;
            last = now;
            draw(now);
        };
        const start = () => {
            if (!raf && visible && onScreen && !reduced)
                raf = requestAnimationFrame(tick);
        };
        const stop = () => {
            if (raf)
                cancelAnimationFrame(raf);
            raf = 0;
        };
        const onVisibility = () => {
            visible = document.visibilityState === "visible";
            if (visible)
                start();
            else
                stop();
        };
        // One frame always paints, including under reduced motion: the texture is
        // the design, only the drift is the accessibility problem.
        draw(0);
        document.addEventListener("visibilitychange", onVisibility);
        const io = new IntersectionObserver((entries) => {
            onScreen = entries.some((e) => e.isIntersecting);
            if (onScreen)
                start();
            else
                stop();
        }, { rootMargin: "80px" });
        io.observe(canvas);
        const parent = canvas.parentElement;
        const ro = new ResizeObserver(() => draw(last));
        if (parent)
            ro.observe(parent);
        // A theme switch, from whatever applies themes. The record arrives as a
        // microtask after the switch's own synchronous work, so a theme written
        // to a <style> in the same call is already in computed style.
        const repaint = () => {
            fill = inkOf(canvas, alpha);
            draw(last);
        };
        const mo = new MutationObserver(repaint);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: THEME_ATTRIBUTES });
        const scheme = window.matchMedia("(prefers-color-scheme: light)");
        scheme.addEventListener("change", repaint);
        start();
        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
            io.disconnect();
            ro.disconnect();
            mo.disconnect();
            scheme.removeEventListener("change", repaint);
        };
    }, [mode, hollowStart, hollowSpan, ink, className]);
    return (_jsx("canvas", { "data-slot": "dither-field", ref: ref, "aria-hidden": "true", className: cn("pointer-events-none absolute inset-0 h-full w-full text-foreground", className) }));
}
export { DitherField };
//# sourceMappingURL=dither-field.js.map
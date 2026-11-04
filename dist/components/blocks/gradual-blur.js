"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Progressive ("gradual") blur for a scroll edge. Desktop's `GradualBlur`,
// ported as it is.
//
// A plain gradient fade hides content by painting the background colour over it.
// This instead blurs it, ramping from nothing to full over the band, so text
// dissolves rather than being curtained off. The technique (after
// reactbits.dev/animations/gradual-blur): stack N layers, each with a stronger
// `backdrop-filter`, and mask each one to a narrow horizontal band. Where the
// bands overlap the blurs composite, and the result reads as continuous.
//
// ── Cost, and why the defaults are conservative ────────────────────────────
//
// Every layer is a live `backdrop-filter`, which means the compositor re-samples
// what is behind it on every frame the content moves. Over a scrolling
// transcript that is per-frame work on the one surface we care most about.
// WKWebView is also where desktop has been burned by blur before.
//
// So: `layers` defaults to 5 and should not casually grow — the visual return
// past ~6 is nil and the cost is linear. A `contain` on the container keeps each
// layer's work scoped. If scrolling regresses, this component is the first thing
// to turn off, and `layers={0}` does exactly that.
import { memo, useMemo } from "react";
const CURVES = {
    linear: (p) => p,
    bezier: (p) => p * p * (3 - 2 * p),
    "ease-in": (p) => p * p,
    "ease-out": (p) => 1 - Math.pow(1 - p, 2),
};
export const GradualBlur = memo(function GradualBlur({ position, height = "5rem", strength = 2, layers = 5, curve = "bezier", exponential = true, tint, className, style, }) {
    // The mask runs FROM the edge we sit on, so band 1 (least blurred) is the one
    // furthest into the content and band N (most blurred) hugs the edge.
    const direction = position === "top" ? "to top" : "to bottom";
    const blurLayers = useMemo(() => {
        if (layers <= 0)
            return [];
        const step = 100 / layers;
        const curveFn = CURVES[curve] ?? CURVES.linear;
        const out = [];
        for (let i = 1; i <= layers; i++) {
            const progress = curveFn(i / layers);
            const blur = exponential
                ? Math.pow(2, progress * 4) * 0.0625 * strength
                : 0.0625 * (progress * layers + 1) * strength;
            // Four stops per band: ramp up, hold, ramp down. Neighbouring bands
            // overlap by one step, which is what keeps the seams invisible.
            const p1 = Math.round((step * i - step) * 10) / 10;
            const p2 = Math.round(step * i * 10) / 10;
            const p3 = Math.round((step * i + step) * 10) / 10;
            const p4 = Math.round((step * i + step * 2) * 10) / 10;
            let stops = `transparent ${p1}%, black ${p2}%`;
            if (p3 <= 100)
                stops += `, black ${p3}%`;
            if (p4 <= 100)
                stops += `, transparent ${p4}%`;
            const mask = `linear-gradient(${direction}, ${stops})`;
            const filter = `blur(${blur.toFixed(3)}rem)`;
            out.push({
                position: "absolute",
                inset: 0,
                maskImage: mask,
                WebkitMaskImage: mask,
                backdropFilter: filter,
                WebkitBackdropFilter: filter,
            });
        }
        return out;
    }, [layers, curve, exponential, strength, direction]);
    if (layers <= 0 && !tint)
        return null;
    return (_jsxs("div", { "aria-hidden": true, className: className, style: {
            position: "absolute",
            left: 0,
            right: 0,
            [position]: 0,
            height,
            pointerEvents: "none",
            // Scope layout/paint so the stack can't invalidate the transcript, and
            // `isolate` so the layers composite among themselves.
            isolation: "isolate",
            contain: "layout paint",
            ...style,
        }, children: [blurLayers.map((s, i) => (_jsx("div", { style: s }, i))), tint && (_jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(${direction}, transparent 0%, ${tint} 65%, ${tint} 100%)`,
                } }))] }));
});
//# sourceMappingURL=gradual-blur.js.map
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "../../lib/utils.js";
import { infiniteAnimationFps } from "../../lib/infinite-animations.js";
import { resolveToken } from "../../lib/resolved-color.js";
import { useTheme } from "../../lib/theme.js";
const DEFAULT_MARKERS = [
    {
        id: "san-francisco",
        location: [37.77, -122.42],
        delay: 1.25,
        status: { count: 1284, unit: "agents running" },
    },
    {
        id: "new-york",
        location: [40.71, -74.01],
        delay: 0.5,
        status: { count: 862, unit: "sessions syncing" },
    },
    {
        id: "london",
        location: [51.51, -0.13],
        delay: 0,
        status: { count: 614, unit: "agents running" },
    },
    {
        id: "tokyo",
        location: [35.68, 139.65],
        delay: 1,
        status: { count: 438, unit: "changes streaming" },
    },
    {
        id: "sao-paulo",
        location: [-23.55, -46.63],
        delay: 0.75,
        status: { count: 347, unit: "agents running" },
    },
    {
        id: "bengaluru",
        location: [12.97, 77.59],
        delay: 1.5,
        status: { count: 529, unit: "changes streaming" },
    },
    {
        id: "dhaka",
        location: [23.81, 90.41],
        delay: 1.75,
        status: { count: 211, unit: "sessions syncing" },
    },
];
/** How far a live count may wander from its base, as a fraction. */
const DRIFT = 0.06;
const TICK_MS = 1200;
/**
 * Base tilt, in radians. The login aside shows only the upper-left of the
 * disc, so this leans the pole toward the reader far enough that the 25–50°N
 * band — where most markers live — sits in the visible face, not the cropped
 * rim.
 */
const THETA = 0.55;
function tokenRgb(name, fallback) {
    const rgb = resolveToken(name);
    return rgb ? [rgb.r / 255, rgb.g / 255, rgb.b / 255] : fallback;
}
function Globe({ markers = DEFAULT_MARKERS, speed = 0.003, className, }) {
    const { appearance } = useTheme();
    const canvasRef = useRef(null);
    const drag = useRef(null);
    const dragDelta = useRef({ phi: 0, theta: 0 });
    const offset = useRef({ phi: 0, theta: 0 });
    const [counts, setCounts] = useState(() => markers.map((m) => m.status?.count ?? 0));
    // A bounded random walk around each base count. Parked under reduced
    // motion: a number that never stops changing is motion too.
    useEffect(() => {
        setCounts(markers.map((m) => m.status?.count ?? 0));
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const id = window.setInterval(() => {
            setCounts((prev) => markers.map((m, i) => {
                const base = m.status?.count ?? 0;
                if (!base)
                    return 0;
                const step = Math.round(base * 0.01 * (Math.random() * 2 - 1)) || 1;
                const lo = Math.round(base * (1 - DRIFT));
                const hi = Math.round(base * (1 + DRIFT));
                return Math.min(hi, Math.max(lo, (prev[i] ?? base) + step));
            }));
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, [markers]);
    // Drag is tracked on the window so releasing outside the canvas still ends
    // it; the delta commits into `offset` on release.
    useEffect(() => {
        function move(e) {
            if (!drag.current)
                return;
            dragDelta.current = {
                phi: (e.clientX - drag.current.x) / 300,
                theta: (e.clientY - drag.current.y) / 1000,
            };
        }
        function up() {
            if (!drag.current)
                return;
            offset.current.phi += dragDelta.current.phi;
            offset.current.theta += dragDelta.current.theta;
            dragDelta.current = { phi: 0, theta: 0 };
            drag.current = null;
            canvasRef.current?.removeAttribute("data-dragging");
        }
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerup", up, { passive: true });
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
    }, []);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const dark = appearance === "dark";
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let globe = null;
        let frame = 0;
        let phi = 0;
        // Under a cap, skip frames and turn by the time that passed instead.
        const fps = infiniteAnimationFps(canvas);
        const minFrameMs = fps ? 1000 / fps : 0;
        let last = 0;
        function init(width) {
            if (!canvas || globe)
                return;
            globe = createGlobe(canvas, {
                devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
                width,
                height: width,
                phi: 0,
                theta: THETA,
                dark: dark ? 1 : 0,
                diffuse: dark ? 1.5 : 1.2,
                mapSamples: 16000,
                mapBrightness: dark ? 8 : 4,
                baseColor: dark
                    ? tokenRgb("--muted-foreground", [0.5, 0.5, 0.5])
                    : tokenRgb("--card", [1, 1, 1]),
                markerColor: tokenRgb("--success", [0.3, 0.8, 0.5]),
                glowColor: tokenRgb("--surface", [0.05, 0.05, 0.05]),
                markerElevation: 0,
                markers: markers.map((m) => ({
                    id: m.id,
                    location: m.location,
                    size: 0.025,
                })),
                opacity: dark ? 0.75 : 0.9,
            });
            const tick = (now = performance.now()) => {
                const elapsed = last ? now - last : 1000 / 60;
                if (minFrameMs && last && elapsed < minFrameMs && !drag.current) {
                    frame = requestAnimationFrame(tick);
                    return;
                }
                last = now;
                // `speed` is per 60 Hz frame; scaled by the time that passed.
                if (!drag.current && !still)
                    phi += speed * (minFrameMs ? elapsed / (1000 / 60) : 1);
                globe?.update({
                    phi: phi + offset.current.phi + dragDelta.current.phi,
                    theta: THETA + offset.current.theta + dragDelta.current.theta,
                });
                frame = requestAnimationFrame(tick);
            };
            tick();
            canvas.dataset.ready = "";
        }
        // Created at the canvas's first real size, then resized in place.
        const ro = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            if (width === 0)
                return;
            if (globe)
                globe.update({ width, height: width });
            else
                init(width);
        });
        ro.observe(canvas);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(frame);
            globe?.destroy();
            delete canvas.dataset.ready;
        };
    }, [appearance, markers, speed]);
    return (_jsxs("div", { "data-slot": "globe", className: cn("relative aspect-square select-none", className), children: [_jsx("canvas", { ref: canvasRef, onPointerDown: (e) => {
                    drag.current = { x: e.clientX, y: e.clientY };
                    e.currentTarget.dataset.dragging = "";
                }, className: cn("size-full cursor-grab touch-none rounded-full opacity-0", "transition-opacity duration-1000 ease-out-strong", "data-dragging:cursor-grabbing data-ready:opacity-100") }), markers.map((m) => (_jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute flex size-10 items-center justify-center transition-[opacity,filter] duration-slow", style: {
                    positionAnchor: `--cobe-${m.id}`,
                    bottom: "anchor(center)",
                    left: "anchor(center)",
                    translate: "-50% 50%",
                    opacity: `var(--cobe-visible-${m.id}, 0)`,
                    filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
                }, children: [[0, 0.5].map((lag) => (_jsx("span", { "data-slot": "globe-ping", className: "absolute inset-0 rounded-full motion-safe:animate-ping border-2 border-success/60", style: { animationDelay: `${m.delay + lag}s` } }, lag))), _jsx("span", { className: "size-2 rounded-full bg-success ring-2 ring-success/30 ring-offset-2 ring-offset-panel" })] }, m.id))), markers.map((m, i) => m.status && (_jsxs("div", { "data-slot": "globe-status", className: "pointer-events-none absolute mb-3 flex items-center gap-1.5 rounded-md border border-border bg-popover py-1 pr-2 pl-1.5 whitespace-nowrap transition-[opacity,filter] duration-slow", style: {
                    positionAnchor: `--cobe-${m.id}`,
                    bottom: "anchor(top)",
                    left: "anchor(center)",
                    translate: "-50% 0",
                    opacity: `var(--cobe-visible-${m.id}, 0)`,
                    filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
                }, children: [_jsx("span", { "aria-hidden": "true", "data-slot": "globe-live-dot", className: "size-1.5 rounded-full bg-success motion-safe:animate-pulse" }), _jsx("span", { className: "font-mono text-3xs font-medium tracking-widest text-success uppercase", children: "Live" }), _jsx("span", { "aria-hidden": "true", className: "h-3 w-px bg-border" }), _jsxs("span", { className: "text-3xs text-secondary-foreground tabular-nums", children: [counts[i].toLocaleString("en-US"), " ", m.status.unit] })] }, `${m.id}-status`)))] }));
}
export { Globe };
//# sourceMappingURL=globe.js.map
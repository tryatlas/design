"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { infiniteAnimationFps } from "../../lib/infinite-animations.js";
import { resolveToken } from "../../lib/resolved-color.js";
import { useTheme } from "../../lib/theme.js";
import { whenIdle } from "../../lib/when-idle.js";
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
/** A released drag's speed is capped at this many radians per 60 Hz frame. */
const MAX_SPIN = 0.08;
/** What a coasting spin keeps of its speed each 60 Hz frame. */
const SPIN_DECAY = 0.95;
/** Pixels of horizontal drag per radian of turn (the drag's own ratio). */
const PX_PER_RADIAN = 300;
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
/**
 * Whether this browser can create a WebGL context at all. Probed on a
 * throwaway canvas: asking the real one would claim its context, and cobe
 * needs to be the first to ask. The probe's context is released at once.
 */
function webglAvailable() {
    try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
        if (!gl)
            return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
    }
    catch {
        return false;
    }
}
function tokenRgb(name, fallback) {
    const rgb = resolveToken(name);
    return rgb ? [rgb.r / 255, rgb.g / 255, rgb.b / 255] : fallback;
}
function Globe({ markers = DEFAULT_MARKERS, speed = 0.003, fallback, className, }) {
    const { appearance } = useTheme();
    const canvasRef = useRef(null);
    const drag = useRef(null);
    const dragDelta = useRef({ phi: 0, theta: 0 });
    const offset = useRef({ phi: 0, theta: 0 });
    /** The drag's last three moves, for the speed it hands on. */
    const samples = useRef([]);
    /** The coasting speed after a release, radians per 60 Hz frame. */
    const spin = useRef(0);
    /** Starts the draw loop if it has stopped (the still globe, on a drag). */
    const wake = useRef(() => { });
    const [ready, setReady] = useState(false);
    const [unsupported, setUnsupported] = useState(false);
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
                phi: (e.clientX - drag.current.x) / PX_PER_RADIAN,
                theta: (e.clientY - drag.current.y) / 1000,
            };
            samples.current = [...samples.current.slice(-2), { x: e.clientX, t: e.timeStamp }];
        }
        function up(e) {
            if (!drag.current)
                return;
            offset.current.phi += dragDelta.current.phi;
            offset.current.theta += dragDelta.current.theta;
            dragDelta.current = { phi: 0, theta: 0 };
            drag.current = null;
            canvasRef.current?.removeAttribute("data-dragging");
            // The speed the pointer left at, in radians per 60 Hz frame.
            const first = samples.current[0];
            const last = samples.current.at(-1);
            samples.current = [];
            // A pointer that stopped before it let go hands on nothing.
            if (first && last && last.t > first.t && e.timeStamp - last.t < 100) {
                const pxPerMs = (last.x - first.x) / (last.t - first.t);
                spin.current = Math.min(MAX_SPIN, Math.max(-MAX_SPIN, (pxPerMs / PX_PER_RADIAN) * (1000 / 60)));
            }
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
        let cancelled = false;
        let cancelIdle = null;
        let ro = null;
        let frame = 0;
        let phi = 0;
        // Under a cap, skip frames and turn by the time that passed instead.
        const fps = infiniteAnimationFps(canvas);
        const minFrameMs = fps ? 1000 / fps : 0;
        let last = 0;
        function init(create, width) {
            if (!canvas || globe)
                return;
            try {
                globe = create(canvas, {
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
            }
            catch {
                // No context after all (a blocklisted GPU, a lost context): keep the
                // fallback rather than a blank box.
                globe = null;
                ro?.disconnect(); // a resize would only throw again
                setUnsupported(true);
                return;
            }
            const tick = (now = performance.now()) => {
                const elapsed = last ? now - last : 1000 / 60;
                if (minFrameMs && last && elapsed < minFrameMs && !drag.current) {
                    frame = requestAnimationFrame(tick);
                    return;
                }
                last = now;
                // `speed` and `spin` are per 60 Hz frame; scaled by the time that passed.
                const frames = minFrameMs ? elapsed / (1000 / 60) : 1;
                if (!drag.current && !still) {
                    if (Math.abs(spin.current) > speed) {
                        // Coasting from a release, until it is down to the auto-spin.
                        phi += spin.current * frames;
                        spin.current *= SPIN_DECAY ** frames;
                    }
                    else {
                        spin.current = 0;
                        phi += speed * frames;
                    }
                }
                globe?.update({
                    phi: phi + offset.current.phi + dragDelta.current.phi,
                    theta: THETA + offset.current.theta + dragDelta.current.theta,
                });
                // Still: this frame was the last, unless a drag is under way.
                if (still && !drag.current) {
                    frame = 0;
                    return;
                }
                frame = requestAnimationFrame(tick);
            };
            wake.current = () => {
                if (!frame && globe)
                    frame = requestAnimationFrame(tick);
            };
            tick();
            canvas.dataset.ready = "";
            setReady(true);
        }
        async function load() {
            if (!webglAvailable()) {
                setUnsupported(true);
                return;
            }
            let create;
            try {
                ({ default: create } = await import("cobe"));
            }
            catch {
                return; // offline, or the chunk failed: the fallback stays
            }
            // Unmounted (or re-themed) while the module was on its way.
            if (cancelled || !canvas)
                return;
            // Created at the canvas's first real size, then resized in place.
            ro = new ResizeObserver(([entry]) => {
                const width = entry.contentRect.width;
                if (width === 0)
                    return;
                if (globe)
                    globe.update({ width, height: width });
                else
                    init(create, width);
            });
            ro.observe(canvas);
        }
        // Nothing is fetched until the globe is about to be seen.
        const io = new IntersectionObserver((entries) => {
            if (!entries.some((e) => e.isIntersecting))
                return;
            io.disconnect();
            cancelIdle = whenIdle(() => void load(), 1000);
        }, { rootMargin: "200px" });
        io.observe(canvas);
        return () => {
            cancelled = true;
            wake.current = () => { };
            io.disconnect();
            cancelIdle?.();
            ro?.disconnect();
            cancelAnimationFrame(frame);
            globe?.destroy();
            delete canvas.dataset.ready;
            setReady(false);
        };
    }, [appearance, markers, speed]);
    return (_jsxs("div", { "data-slot": "globe", "data-fallback": unsupported ? "" : undefined, className: cn("relative aspect-square select-none", className), children: [_jsx("div", { "aria-hidden": "true", className: cn("pointer-events-none absolute inset-0 transition-opacity duration-slow ease-out-strong", ready && "opacity-0"), children: fallback ?? (_jsx("div", { "data-slot": "globe-fallback", className: "size-full rounded-full bg-radial from-muted-foreground/15 via-muted-foreground/5 to-transparent" })) }), _jsx("canvas", { ref: canvasRef, onPointerDown: (e) => {
                    drag.current = { x: e.clientX, y: e.clientY };
                    samples.current = [{ x: e.clientX, t: e.timeStamp }];
                    spin.current = 0;
                    e.currentTarget.dataset.dragging = "";
                    wake.current();
                }, className: cn("relative size-full cursor-grab touch-none rounded-full opacity-0", "transition-opacity duration-1000 ease-out-strong", "data-dragging:cursor-grabbing data-ready:opacity-100") }), markers.map((m) => (_jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute flex size-10 items-center justify-center transition-[opacity,filter] duration-slow", style: {
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
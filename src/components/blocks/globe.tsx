"use client";

import { useEffect, useRef, useState } from "react";
import type createGlobe from "cobe";
import { cn } from "../../lib/utils.ts";

import { infiniteAnimationFps } from "../../lib/infinite-animations.ts";
import { resolveToken } from "../../lib/resolved-color.ts";
import { useTheme } from "../../lib/theme.tsx";
import { whenIdle } from "../../lib/when-idle.ts";

/**
 * A dotted WebGL globe that turns slowly and can be dragged. The login aside
 * uses it as an interactive backdrop, parked off the top-right corner so only
 * the upper hemisphere shows.
 *
 * cobe draws the sphere; the markers are DOM. cobe v2 publishes a CSS anchor
 * (`--cobe-<id>`) for every marker with an id, plus `--cobe-visible-<id>`
 * while that point faces the camera, so the pulse rings and status tags are
 * plain elements positioned with anchor positioning and faded out on the far
 * side. Where anchor positioning is unsupported they simply do not show; the
 * globe is unaffected.
 *
 * A marker with a `status` carries a LIVE tag above it: what is happening
 * there right now, with a count that drifts a few percent either side of its
 * base so the globe reads as realtime rather than as a map. Live is the
 * `success` ink, as on the sidebar's live badge — in this system red means failed,
 * so a red LIVE would announce an outage. The count is `tabular-nums` so the
 * tag does not change width as the number ticks.
 *
 * WebGL takes numbers, not custom properties, so the dot, marker and glow
 * colours are resolved from the token layer on mount. `useTheme()` is a
 * dependency so switching appearance rebuilds the globe in the new ink.
 * Its turn redraws at most `--infinite-animation-fps` times a second when
 * that is set (see `INFINITE_ANIMATIONS`), covering the same angle per
 * second either way.
 *
 * A drag hands its speed on: released mid-flick, the globe keeps turning at
 * the pointer's last speed (from its last three moves, capped) and slows by
 * 5% a frame until it is back to the auto-spin, which then carries on.
 *
 * Under `prefers-reduced-motion` it does not turn on its own and does not
 * coast. It draws once, and redraws only while it is being dragged: a still
 * image costs one frame, not sixty a second.
 *
 * cobe is not in the import graph: it is fetched with a dynamic `import()`
 * once the globe comes within 200px of the viewport and the main thread is
 * idle, so a page that never scrolls to it never downloads it. Until the
 * globe's first frame — on the server, before the download, and for good
 * where WebGL is unavailable — a token-coloured disc (or the `fallback` prop)
 * holds the same square box, so nothing shifts and nothing is blank. Without
 * WebGL the root carries `data-fallback`.
 */

export type GlobeMarker = {
  id: string;
  location: [number, number];
  /** Seconds before this marker's first pulse, so they do not beat in sync. */
  delay: number;
  /** A LIVE tag: a count that drifts around `count`, then what it counts. */
  status?: { count: number; unit: string };
};

const DEFAULT_MARKERS: Array<GlobeMarker> = [
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

type Rgb = [number, number, number];

/**
 * Whether this browser can create a WebGL context at all. Probed on a
 * throwaway canvas: asking the real one would claim its context, and cobe
 * needs to be the first to ask. The probe's context is released at once.
 */
function webglAvailable(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function tokenRgb(name: string, fallback: Rgb): Rgb {
  const rgb = resolveToken(name);
  return rgb ? [rgb.r / 255, rgb.g / 255, rgb.b / 255] : fallback;
}

function Globe({
  markers = DEFAULT_MARKERS,
  speed = 0.003,
  fallback,
  className,
}: {
  markers?: Array<GlobeMarker>;
  /** Radians of spin per frame. */
  speed?: number;
  /**
   * Shown in the globe's box until its first frame, and for good without
   * WebGL. Defaults to a soft disc in the muted ink. Pass an optimised image
   * only for a hero that must look finished at first byte.
   */
  fallback?: React.ReactNode;
  className?: string;
}) {
  const { appearance } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const dragDelta = useRef({ phi: 0, theta: 0 });
  const offset = useRef({ phi: 0, theta: 0 });
  /** The drag's last three moves, for the speed it hands on. */
  const samples = useRef<Array<{ x: number; t: number }>>([]);
  /** The coasting speed after a release, radians per 60 Hz frame. */
  const spin = useRef(0);
  /** Starts the draw loop if it has stopped (the still globe, on a drag). */
  const wake = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [counts, setCounts] = useState(() => markers.map((m) => m.status?.count ?? 0));

  // A bounded random walk around each base count. Parked under reduced
  // motion: a number that never stops changing is motion too.
  useEffect(() => {
    setCounts(markers.map((m) => m.status?.count ?? 0));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setCounts((prev) =>
        markers.map((m, i) => {
          const base = m.status?.count ?? 0;
          if (!base) return 0;
          const step = Math.round(base * 0.01 * (Math.random() * 2 - 1)) || 1;
          const lo = Math.round(base * (1 - DRIFT));
          const hi = Math.round(base * (1 + DRIFT));
          return Math.min(hi, Math.max(lo, (prev[i] ?? base) + step));
        }),
      );
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [markers]);

  // Drag is tracked on the window so releasing outside the canvas still ends
  // it; the delta commits into `offset` on release.
  useEffect(() => {
    function move(e: PointerEvent) {
      if (!drag.current) return;
      dragDelta.current = {
        phi: (e.clientX - drag.current.x) / PX_PER_RADIAN,
        theta: (e.clientY - drag.current.y) / 1000,
      };
      samples.current = [...samples.current.slice(-2), { x: e.clientX, t: e.timeStamp }];
    }
    function up(e: PointerEvent) {
      if (!drag.current) return;
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
        spin.current = Math.min(
          MAX_SPIN,
          Math.max(-MAX_SPIN, (pxPerMs / PX_PER_RADIAN) * (1000 / 60)),
        );
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
    if (!canvas) return;

    const dark = appearance === "dark";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let cancelled = false;
    let cancelIdle: (() => void) | null = null;
    let ro: ResizeObserver | null = null;
    let frame = 0;
    let phi = 0;
    // Under a cap, skip frames and turn by the time that passed instead.
    const fps = infiniteAnimationFps(canvas);
    const minFrameMs = fps ? 1000 / fps : 0;
    let last = 0;

    function init(create: typeof createGlobe, width: number) {
      if (!canvas || globe) return;
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
      } catch {
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
          } else {
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
        if (!frame && globe) frame = requestAnimationFrame(tick);
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
      let create: typeof createGlobe;
      try {
        ({ default: create } = await import("cobe"));
      } catch {
        return; // offline, or the chunk failed: the fallback stays
      }
      // Unmounted (or re-themed) while the module was on its way.
      if (cancelled || !canvas) return;
      // Created at the canvas's first real size, then resized in place.
      ro = new ResizeObserver(([entry]) => {
        const width = entry.contentRect.width;
        if (width === 0) return;
        if (globe) globe.update({ width, height: width });
        else init(create, width);
      });
      ro.observe(canvas);
    }

    // Nothing is fetched until the globe is about to be seen.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        cancelIdle = whenIdle(() => void load(), 1000);
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      wake.current = () => {};
      io.disconnect();
      cancelIdle?.();
      ro?.disconnect();
      cancelAnimationFrame(frame);
      globe?.destroy();
      delete canvas.dataset.ready;
      setReady(false);
    };
  }, [appearance, markers, speed]);

  return (
    <div
      data-slot="globe"
      data-fallback={unsupported ? "" : undefined}
      className={cn("relative aspect-square select-none", className)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-slow ease-out-strong",
          ready && "opacity-0",
        )}
      >
        {fallback ?? (
          <div
            data-slot="globe-fallback"
            className="size-full rounded-full bg-radial from-muted-foreground/15 via-muted-foreground/5 to-transparent"
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          samples.current = [{ x: e.clientX, t: e.timeStamp }];
          spin.current = 0;
          e.currentTarget.dataset.dragging = "";
          wake.current();
        }}
        className={cn(
          "relative size-full cursor-grab touch-none rounded-full opacity-0",
          "transition-opacity duration-1000 ease-out-strong",
          "data-dragging:cursor-grabbing data-ready:opacity-100",
        )}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          aria-hidden="true"
          className="pointer-events-none absolute flex size-10 items-center justify-center transition-[opacity,filter] duration-slow"
          style={{
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
          }}
        >
          {[0, 0.5].map((lag) => (
            <span
              key={lag}
              data-slot="globe-ping"
              className="absolute inset-0 rounded-full motion-safe:animate-ping border-2 border-success/60"
              style={{ animationDelay: `${m.delay + lag}s` }}
            />
          ))}
          <span className="size-2 rounded-full bg-success ring-2 ring-success/30 ring-offset-2 ring-offset-panel" />
        </div>
      ))}
      {markers.map(
        (m, i) =>
          m.status && (
            <div
              key={`${m.id}-status`}
              data-slot="globe-status"
              className="pointer-events-none absolute mb-3 flex items-center gap-1.5 rounded-md border border-border bg-popover py-1 pr-2 pl-1.5 whitespace-nowrap transition-[opacity,filter] duration-slow"
              style={{
                positionAnchor: `--cobe-${m.id}`,
                bottom: "anchor(top)",
                left: "anchor(center)",
                translate: "-50% 0",
                opacity: `var(--cobe-visible-${m.id}, 0)`,
                filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
              }}
            >
              <span
                aria-hidden="true"
                data-slot="globe-live-dot"
                className="size-1.5 rounded-full bg-success motion-safe:animate-pulse"
              />
              <span className="font-mono text-3xs font-medium tracking-widest text-success uppercase">
                Live
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-border" />
              <span className="text-3xs text-secondary-foreground tabular-nums">
                {counts[i].toLocaleString("en-US")} {m.status.unit}
              </span>
            </div>
          ),
      )}
    </div>
  );
}

export { Globe };

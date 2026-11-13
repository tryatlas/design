/**
 * Every animation in the package that never ends, as data, so a consumer can
 * hold each one to a frame-rate cap from its own test.
 *
 * Why a consumer cares: WebKitGTK (Linux desktop) presents a full-window frame
 * for every tick of a running animation, so a 14 px spinner that never stops
 * costs a measurable share of a core. Desktop caps each endless animation
 * under `html.platform-linux`; a package animation it cannot see is one it
 * cannot cap. A test in this package fails when a new endless animation is
 * added to `src/` without an entry here.
 *
 * Two kinds, capped two ways:
 *
 *  - `css`: a CSS animation on the elements `selector` matches. Cap it with
 *    `animation-timing-function: steps(<steps>)` on that selector; `steps` is
 *    the count that lands near 12 fps for one `duration`.
 *  - `js`: a requestAnimationFrame or motion loop, which no stylesheet can
 *    reach. It reads `--infinite-animation-fps` from the cascade when it
 *    starts and, when that is a positive number, redraws at most that often.
 *    Unset, it runs every frame. One declaration caps them all:
 *
 *      html.platform-linux { --infinite-animation-fps: 12; }
 *
 * A `css` row whose `source` is a stylesheet is a utility, not a component:
 * any element that carries the class runs it, so `components` is empty and
 * the selector is the class itself.
 */

export const INFINITE_ANIMATION_FPS_VAR = "--infinite-animation-fps";

export type InfiniteAnimation =
  | {
      id: string;
      /** The exported components that run it. */
      components: readonly string[];
      /** The package file it lives in, relative to the package root. */
      source: string;
      driver: "css";
      /** Matches exactly the elements that run it; an override's selector. */
      selector: string;
      /** One cycle, in seconds. */
      duration: number;
      /** `steps()` count for about 12 fps over one cycle. */
      steps: number;
    }
  | {
      id: string;
      components: readonly string[];
      source: string;
      driver: "js";
    };

export const INFINITE_ANIMATIONS: readonly InfiniteAnimation[] = [
  {
    id: "spinner",
    components: ["Spinner"],
    source: "src/components/ui/spinner.tsx",
    driver: "css",
    selector: ".animate-spin",
    duration: 1,
    steps: 12,
  },
  {
    id: "toast-loading",
    components: ["Toast"],
    source: "src/components/ui/toast.tsx",
    driver: "css",
    selector: ".animate-spin",
    duration: 1,
    steps: 12,
  },
  {
    id: "icon-button-loading",
    components: ["IconButton"],
    source: "src/ui/icon-button.tsx",
    driver: "css",
    selector: '.animate-spin[data-slot="icon-button-spin"]',
    duration: 1,
    steps: 12,
  },
  {
    id: "skeleton",
    components: ["Skeleton"],
    source: "src/components/ui/skeleton.tsx",
    driver: "css",
    selector: ".animate-pulse",
    duration: 2,
    steps: 24,
  },
  {
    // A 3 s turn: the plain `.animate-spin` cap of 12 steps would be 4 fps.
    id: "session-pipeline-running",
    components: ["SessionPipeline"],
    source: "src/components/session/session-pipeline.tsx",
    driver: "css",
    selector: '.animate-spin[data-slot="session-pipeline-running"]',
    duration: 3,
    steps: 36,
  },
  {
    // The session sidebar's working ring: a 3 s turn, like the pipeline's.
    id: "session-working-ring",
    components: ["WorkingRing", "SessionTopStatusIcon", "SessionRowCard"],
    source: "src/components/session-sidebar/session-row-parts.tsx",
    driver: "css",
    selector: '.animate-spin[data-slot="session-working-ring"]',
    duration: 3,
    steps: 36,
  },
  {
    // `motion-safe:animate-ping`, which a `.animate-ping` rule does not match.
    id: "globe-ping",
    components: ["Globe"],
    source: "src/components/blocks/globe.tsx",
    driver: "css",
    selector: '[data-slot="globe-ping"]',
    duration: 1,
    steps: 12,
  },
  {
    // A live session's leading edge. `motion-safe:animate-pulse`, which a
    // `.animate-pulse` rule does not match.
    id: "checkpoint-trace-live-edge",
    components: ["CheckpointTrace"],
    source: "src/components/blocks/checkpoint-trace.tsx",
    driver: "css",
    selector: '[data-slot="checkpoint-trace-live-edge"]',
    duration: 2,
    steps: 24,
  },
  {
    // `motion-safe:animate-pulse`, which a `.animate-pulse` rule does not match.
    id: "globe-live-dot",
    components: ["Globe"],
    source: "src/components/blocks/globe.tsx",
    driver: "css",
    selector: '[data-slot="globe-live-dot"]',
    duration: 2,
    steps: 24,
  },
  {
    // Also the `stream-caret` utility, wherever an app puts it.
    id: "stream-caret",
    components: ["StreamingMarkdown"],
    source: "src/components/session/streaming-markdown.tsx",
    driver: "css",
    selector: ".stream-caret",
    duration: 1,
    steps: 12,
  },
  {
    // Already stepped at 30 a sweep (about 14 fps); the cap lowers it to 12.
    id: "thinking-shimmer",
    components: [],
    source: "src/styles/utilities.css",
    driver: "css",
    selector: ".thinking-shimmer",
    duration: 2.2,
    steps: 26,
  },
  {
    id: "pulse-ring",
    components: [],
    source: "src/styles/utilities.css",
    driver: "css",
    selector: '[class*="animate-pulse-ring"]',
    duration: 2,
    steps: 24,
  },
  {
    id: "globe-turn",
    components: ["Globe"],
    source: "src/components/blocks/globe.tsx",
    driver: "js",
  },
  {
    id: "marquee",
    components: ["InfiniteSlider", "LogoMarquee"],
    source: "src/components/blocks/infinite-slider.tsx",
    driver: "js",
  },
  {
    // Already gated at 12.5 fps; the variable can only lower it.
    id: "dither-field",
    components: ["DitherField"],
    source: "src/components/blocks/dither-field.tsx",
    driver: "js",
  },
];

/**
 * The cap a `js` animation runs at: `--infinite-animation-fps` as `element`
 * inherits it, or `undefined` (every frame) when it is unset or not a
 * positive number. Read once when the loop starts.
 */
export function infiniteAnimationFps(element: Element): number | undefined {
  const raw = getComputedStyle(element).getPropertyValue(INFINITE_ANIMATION_FPS_VAR).trim();
  const fps = Number(raw);
  return raw !== "" && Number.isFinite(fps) && fps > 0 ? fps : undefined;
}

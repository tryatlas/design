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
 */
export declare const INFINITE_ANIMATION_FPS_VAR = "--infinite-animation-fps";
export type InfiniteAnimation = {
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
} | {
    id: string;
    components: readonly string[];
    source: string;
    driver: "js";
};
export declare const INFINITE_ANIMATIONS: readonly InfiniteAnimation[];
/**
 * The cap a `js` animation runs at: `--infinite-animation-fps` as `element`
 * inherits it, or `undefined` (every frame) when it is unset or not a
 * positive number. Read once when the loop starts.
 */
export declare function infiniteAnimationFps(element: Element): number | undefined;
//# sourceMappingURL=infinite-animations.d.ts.map
/**
 * The motion vocabulary, as constants `motion` can take directly.
 *
 * These numbers are what make the chrome feel like one object rather than a
 * set of components that each picked their own curve. They began as the
 * Standards design system's values; the springs have since been critically
 * damped (below).
 *
 *   SPRING_RAIL       a rail changing width
 *   SPRING_DOCK       the dock sliding in beside the page
 *   SPRING_INDICATOR  a segmented pill or underline sliding between options
 *   SPRING_PILL       an active row sliding between destinations
 *   EASE_PANEL        a panel entering; close to, but not the same as, `--ease-out-strong`
 *
 * Springs, layout and presence belong to `motion`. Hover and state colour
 * transitions, Base UI `data-open` keyframes and ScrollFade stay in CSS —
 * the same split Standards uses.
 *
 * Reduced motion: the CSS side swaps travel for a fade on its own
 * (`utilities.css`). Motion's JS animations do not see that rule, so an app
 * wraps its tree once in `<MotionConfig reducedMotion="user">` from
 * `motion/react`: under `prefers-reduced-motion` Motion then drops transform
 * and layout animation and keeps opacity. A loop started with `animate()` on a
 * motion value ignores `MotionConfig`; gate it on `useReducedMotion()`.
 */
export declare const EASE_OUT_STRONG: readonly [0.23, 1, 0.32, 1];
export declare const EASE_IN_OUT_STRONG: readonly [0.77, 0, 0.175, 1];
export declare const EASE_DRAWER: readonly [0.32, 0.72, 0, 1];
export declare const DURATION: {
    readonly instant: 0.08;
    readonly fast: 0.12;
    readonly base: 0.18;
    readonly slow: 0.26;
};
export declare const SPRING_RAIL: {
    readonly type: "spring";
    readonly stiffness: 420;
    readonly damping: 41;
};
export declare const SPRING_DOCK: {
    readonly type: "spring";
    readonly stiffness: 380;
    readonly damping: 40;
};
export declare const SPRING_INDICATOR: {
    readonly type: "spring";
    readonly stiffness: 520;
    readonly damping: 46;
};
export declare const SPRING_PILL: {
    readonly type: "spring";
    readonly stiffness: 560;
    readonly damping: 48;
};
/**
 * The panel ease. Close to `--ease-out-strong` (`cubic-bezier(0.23, 1, 0.32, 1)`
 * in `utilities.css`) but not the same curve; the two are separate values.
 */
export declare const EASE_PANEL: readonly [0.22, 1, 0.36, 1];
/** Panels stagger down a page at these delays. Index by position. */
export declare const PANEL_STAGGER: readonly [0, 0.05, 0.1, 0.15, 0.2, 0.25];
export declare const PANEL_ENTER: {
    readonly initial: {
        readonly opacity: 0;
        readonly y: 8;
    };
    readonly animate: {
        readonly opacity: 1;
        readonly y: 0;
    };
};
//# sourceMappingURL=motion.d.ts.map
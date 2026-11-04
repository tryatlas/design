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
 */
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
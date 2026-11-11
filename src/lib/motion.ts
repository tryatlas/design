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

/*
 * The CSS tokens, for `motion` (`tokens.css` and the `@theme` block in
 * `utilities.css`). Four durations, in seconds, and three curves; JS never
 * types a fifth number or a fourth curve. `EASE_PANEL` below is a separate,
 * documented value.
 */
export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT_STRONG = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const DURATION = { instant: 0.08, fast: 0.12, base: 0.18, slow: 0.26 } as const;

/*
 * Every spring is critically damped: it arrives and stops, with no overshoot,
 * because none of them follows a throw. At mass 1 that is
 * damping = 2·√stiffness (damping ratio ζ = 1), rounded up so ζ never drops
 * below 1. Bounce is for something the user flung, and nothing here is.
 *
 *   SPRING_RAIL       420 → 2·√420 = 40.99 → 41   ζ 1.00
 *   SPRING_DOCK       380 → 2·√380 = 38.99 → 40   ζ 1.03 (unchanged)
 *   SPRING_INDICATOR  520 → 2·√520 = 45.61 → 46   ζ 1.01 (was 38, ζ 0.83)
 *   SPRING_PILL       560 → 2·√560 = 47.33 → 48   ζ 1.01 (was 42, ζ 0.89)
 */
export const SPRING_RAIL = { type: "spring", stiffness: 420, damping: 41 } as const;
export const SPRING_DOCK = { type: "spring", stiffness: 380, damping: 40 } as const;
export const SPRING_INDICATOR = { type: "spring", stiffness: 520, damping: 46 } as const;
export const SPRING_PILL = { type: "spring", stiffness: 560, damping: 48 } as const;

/**
 * The panel ease. Close to `--ease-out-strong` (`cubic-bezier(0.23, 1, 0.32, 1)`
 * in `utilities.css`) but not the same curve; the two are separate values.
 */
export const EASE_PANEL = [0.22, 1, 0.36, 1] as const;

/** Panels stagger down a page at these delays. Index by position. */
export const PANEL_STAGGER = [0, 0.05, 0.1, 0.15, 0.2, 0.25] as const;

export const PANEL_ENTER = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
} as const;

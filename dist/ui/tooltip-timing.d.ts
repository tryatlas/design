export declare const TOOLTIP_OPEN_DELAY = 300;
export declare const TOOLTIP_WARM_WINDOW = 300;
/** Strong ease-out: starts moving at once, settles without overshoot. */
export declare const TOOLTIP_EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
export declare const TOOLTIP_SLIDE_MS = 180;
export declare const TOOLTIP_FADE_IN_MS = 125;
export declare const TOOLTIP_FADE_OUT_MS = 80;
/** Call when a tooltip becomes visible. */
export declare function markTooltipOpen(): void;
/** Call when a tooltip that was visible hides. */
export declare function markTooltipClosed(): void;
/** True while a tooltip is open or one closed within the warm window. */
export declare function isTooltipWarm(): boolean;
export declare function prefersReducedMotion(): boolean;
/** The sliding strip's transition: opacity always, travel only when asked. */
export declare function slideTransition({ visible, travel }: {
    visible: boolean;
    travel: boolean;
}): string;
/** Test hook: forget any open/warm state between tests. */
export declare function resetTooltipTiming(): void;
//# sourceMappingURL=tooltip-timing.d.ts.map
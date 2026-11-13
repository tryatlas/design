/** Mirror page visibility onto `<html>`. Call it once, at the app's root. */
export declare function initAnimationVisibility(): () => void;
/**
 * A ref callback that pauses the animations inside an element while it is
 * scrolled out of view. Attach it to the row that holds them, so its glyph,
 * label and loader cells pause together.
 */
export declare function useVisibleAnimation<T extends Element>(): (el: T | null) => void;
//# sourceMappingURL=visible-animation.d.ts.map
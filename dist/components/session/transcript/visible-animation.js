/**
 * Pause looping "working" animations nobody can see.
 *
 * A running turn keeps shimmers looping (`.atlas-thinking-shimmer`,
 * `.atlas-marker-running` in `transcript.css`) for as long as the agent works,
 * often minutes. Three places they used to keep ticking unseen:
 *
 * - The window is hidden: minimised, occluded, on another Space. This module
 *   mirrors `document.visibilityState` onto `<html data-atlas-hidden>`.
 * - The session is in a background tab. Hidden session tabs stay laid out
 *   (`visibility:hidden`), and CSS animations keep running under
 *   `visibility:hidden`, unlike `display:none`. The app marks the wrapper
 *   `data-atlas-offstage`.
 * - The row is scrolled out of view while the reader is up in the history.
 *   `useVisibleAnimation` marks the element `data-offscreen` from one shared
 *   IntersectionObserver.
 *
 * All three are attributes, not inherited custom properties, so flipping one
 * restyles only the elements the selectors in `transcript.css` match.
 */
import { useCallback, useRef } from "react";
/** Mirror page visibility onto `<html>`. Call it once, at the app's root. */
export function initAnimationVisibility() {
    const root = document.documentElement;
    const sync = () => root.toggleAttribute("data-atlas-hidden", document.visibilityState === "hidden");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
        document.removeEventListener("visibilitychange", sync);
        root.removeAttribute("data-atlas-hidden");
    };
}
let observer = null;
function sharedObserver() {
    if (observer)
        return observer;
    if (typeof IntersectionObserver === "undefined")
        return null;
    observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
        }
    });
    return observer;
}
/**
 * A ref callback that pauses the animations inside an element while it is
 * scrolled out of view. Attach it to the row that holds them, so its glyph,
 * label and loader cells pause together.
 */
export function useVisibleAnimation() {
    const current = useRef(null);
    return useCallback((el) => {
        const io = sharedObserver();
        if (current.current && io) {
            io.unobserve(current.current);
            current.current.removeAttribute("data-offscreen");
        }
        current.current = el;
        if (el && io)
            io.observe(el);
    }, []);
}
//# sourceMappingURL=visible-animation.js.map
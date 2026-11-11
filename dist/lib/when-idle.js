/**
 * Run `callback` once the main thread is idle, or after `timeout` ms at the
 * latest. Returns a cancel function.
 *
 * The blocks use it to keep their first canvas paint (and the globe's cobe
 * download) out of the page's critical path: a hero's headline should paint
 * before a decorative canvas does. Safari has no `requestIdleCallback`, so
 * there it falls back to a macrotask, which still yields to the first paint.
 */
export function whenIdle(callback, timeout) {
    if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(callback, 1);
    return () => window.clearTimeout(id);
}
//# sourceMappingURL=when-idle.js.map
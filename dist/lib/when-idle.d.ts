/**
 * Run `callback` once the main thread is idle, or after `timeout` ms at the
 * latest. Returns a cancel function.
 *
 * The blocks use it to keep their first canvas paint (and the globe's cobe
 * download) out of the page's critical path: a hero's headline should paint
 * before a decorative canvas does. Safari has no `requestIdleCallback`, so
 * there it falls back to a macrotask, which still yields to the first paint.
 */
export declare function whenIdle(callback: () => void, timeout: number): () => void;
//# sourceMappingURL=when-idle.d.ts.map
/**
 * The exit every anchored popup plays (popover, menus, select, combobox,
 * tooltip): the house `scale-in` played backwards, toward the same
 * `--transform-origin`, so a menu leaves into the trigger it grew out of.
 *
 * `data-ending-style` is Base UI's exit attribute: it is set only while the
 * popup is leaving, and Base UI waits for the running animation to finish
 * before it unmounts the popup. Without this class the popup has no
 * animation to wait for, so it vanishes on the frame it closes.
 *
 * The exit is faster than the entrance (120ms against 150ms): the user has
 * already moved on. Under reduced motion it drops the scale and keeps the
 * fade.
 */
export const POPUP_EXIT = "data-ending-style:animate-scale-out motion-reduce:data-ending-style:animate-fade-out";
//# sourceMappingURL=popup-motion.js.map
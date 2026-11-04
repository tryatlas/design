/**
 * Keyboard hints (Vimium-style): find what can be clicked, label it, and
 * activate it. Copied from desktop's `features/hint-nav/lib` (ADR-0027).
 *
 * The DOM contract: a target is anything matching `HINT_SELECTOR`, or
 * carrying `[data-hint]` to opt in (a clickable `div`, or a wrapper that
 * should be hinted as a whole). It is skipped while hidden, `aria-hidden`,
 * `inert`, disabled, transparent, `pointer-events: none`, smaller than 4px,
 * off-screen, or inside the overlay itself (`[data-hint-overlay]`). So a
 * `HintGroup` strip — `aria-hidden` and `pointer-events-none` — is never one.
 *
 * Everything here runs only when hint mode opens: no observers, and the
 * layout is read in one batched pass.
 */
export interface HintTarget {
    el: HTMLElement;
    rect: DOMRect;
}
/** Set on the overlay's root, so its badges are never hinted. */
export declare const HINT_OVERLAY_ATTR = "data-hint-overlay";
/** Home row and easy reaches first, so the nearest targets get the easiest
 *  keys. */
export declare const HINT_ALPHABET = "fjdkslaghrueiwovncm";
/** What counts as a target. `[data-hint]` is the opt-in for anything else. */
export declare const HINT_SELECTOR: string;
/**
 * `count` prefix-free labels (no label is the start of another, so typing is
 * never ambiguous) from `alphabet`. Single characters while they last, then
 * the smallest fixed length that covers `count` — every label the same
 * length is what makes them prefix-free. With the default 19-character
 * alphabet: one character up to 19 targets, two up to 361.
 */
export declare function generateHintLabels(count: number, alphabet?: string): string[];
/**
 * The visible, on-screen targets under `root`, nearest the viewport's centre
 * first (so the easiest labels land where attention is, and the cap keeps
 * the most relevant ones).
 */
export declare function scanHintTargets(root?: ParentNode): HintTarget[];
/**
 * Bring `el` into view, then focus it — with the caret at the end of a text
 * field, so typing can start at once — or focus and click it. A field is
 * only ever focused; `focusOnly` focuses anything.
 */
export declare function activateHintTarget(el: HTMLElement, opts?: {
    focusOnly?: boolean;
}): void;
//# sourceMappingURL=hint-targets.d.ts.map
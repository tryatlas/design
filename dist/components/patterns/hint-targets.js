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
/** Set on the overlay's root, so its badges are never hinted. */
export const HINT_OVERLAY_ATTR = "data-hint-overlay";
/** Home row and easy reaches first, so the nearest targets get the easiest
 *  keys. */
export const HINT_ALPHABET = "fjdkslaghrueiwovncm";
/** What counts as a target. `[data-hint]` is the opt-in for anything else. */
export const HINT_SELECTOR = [
    "button",
    "a[href]",
    '[role="button"]',
    '[role="menuitem"]',
    '[role="menuitemradio"]',
    '[role="menuitemcheckbox"]',
    '[role="tab"]',
    '[role="link"]',
    '[role="option"]',
    '[role="switch"]',
    '[role="checkbox"]',
    'input:not([type="hidden"])',
    "textarea",
    "select",
    "summary",
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
    "[data-hint]",
].join(",");
/** Cap so a pathological page can't blow up label length or render cost. */
const MAX_TARGETS = 250;
/**
 * `count` prefix-free labels (no label is the start of another, so typing is
 * never ambiguous) from `alphabet`. Single characters while they last, then
 * the smallest fixed length that covers `count` — every label the same
 * length is what makes them prefix-free. With the default 19-character
 * alphabet: one character up to 19 targets, two up to 361.
 */
export function generateHintLabels(count, alphabet = HINT_ALPHABET) {
    const chars = alphabet.split("");
    const n = chars.length;
    if (count <= 0 || n === 0)
        return [];
    if (count <= n)
        return chars.slice(0, count);
    let length = 1;
    let capacity = n;
    while (capacity < count) {
        length += 1;
        capacity *= n;
    }
    // Odometer order, the last character turning fastest.
    const labels = [];
    const idx = Array.from({ length }, () => 0);
    for (let k = 0; k < count; k++) {
        let label = "";
        for (let p = 0; p < length; p++)
            label += chars[idx[p]];
        labels.push(label);
        for (let p = length - 1; p >= 0; p--) {
            idx[p] += 1;
            if (idx[p] < n)
                break;
            idx[p] = 0;
        }
    }
    return labels;
}
function isHidden(el, style) {
    if (style.visibility === "hidden" || style.display === "none")
        return true;
    if (style.opacity === "0" || style.pointerEvents === "none")
        return true;
    if (el.closest("[inert]"))
        return true;
    if (el.closest('[aria-hidden="true"]'))
        return true;
    if (el.disabled)
        return true;
    return false;
}
/**
 * The visible, on-screen targets under `root`, nearest the viewport's centre
 * first (so the easiest labels land where attention is, and the cap keeps
 * the most relevant ones).
 */
export function scanHintTargets(root = document) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nodes = Array.from(root.querySelectorAll(HINT_SELECTOR));
    const visible = [];
    for (const el of nodes) {
        if (el.closest(`[${HINT_OVERLAY_ATTR}]`))
            continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4)
            continue;
        if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= vh || rect.left >= vw)
            continue;
        if (isHidden(el, getComputedStyle(el)))
            continue;
        visible.push({ el, rect });
    }
    // A target that holds another is the wrapper: keep the inner control and
    // drop the wrapper, unless the wrapper opted in with `[data-hint]`.
    const els = visible.map((t) => t.el);
    const deduped = visible.filter((t) => {
        if (t.el.hasAttribute("data-hint"))
            return true;
        return !els.some((other) => other !== t.el && t.el.contains(other));
    });
    const cx = vw / 2;
    const cy = vh / 2;
    const distance = (r) => Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
    deduped.sort((a, b) => distance(a.rect) - distance(b.rect));
    return deduped.slice(0, MAX_TARGETS);
}
/** Inputs that take typing. A checkbox, radio, range or button input is
 *  clicked like a button. */
const CLICKED_INPUTS = new Set([
    "checkbox",
    "radio",
    "range",
    "button",
    "submit",
    "reset",
    "file",
    "color",
    "image",
]);
function isTextTarget(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === "input")
        return !CLICKED_INPUTS.has(el.type);
    if (tag === "textarea" || tag === "select")
        return true;
    if (el.isContentEditable)
        return true;
    // CodeMirror's editable surface.
    return el.classList.contains("cm-content") || el.closest(".cm-editor") !== null;
}
/**
 * Bring `el` into view, then focus it — with the caret at the end of a text
 * field, so typing can start at once — or focus and click it. A field is
 * only ever focused; `focusOnly` focuses anything.
 */
export function activateHintTarget(el, opts = {}) {
    el.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    el.focus({ preventScroll: true });
    if (opts.focusOnly || isTextTarget(el)) {
        const tag = el.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") {
            const input = el;
            try {
                const end = input.value.length;
                input.setSelectionRange(end, end);
            }
            catch {
                // Some input types (number, email) have no selection.
            }
        }
        return;
    }
    // Focus first, so focus-dependent handlers see it, then click.
    el.click();
}
//# sourceMappingURL=hint-targets.js.map
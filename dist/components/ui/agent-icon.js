import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * Glyphs for agents the package has no mark for: an icon an agent registry
 * ships (`ExternalAgentMark`), and the agent's initial when there is none
 * (`AgentMonogram`). Which agent gets which is the app's call (ADR-0002); the
 * named marks are in `brand-marks.tsx`.
 */
/**
 * Does this SVG defer its colour to the caller?
 *
 * `currentColor` means "I have no colour of my own". Inside an `<img>` that is
 * a trap: the SVG is a separate document, CSS does not cascade into it, and
 * `currentColor` falls back to the initial value of `color` — **black** — so
 * the glyph disappears against a dark surface. Registry icons are mostly
 * monochrome this way, which is why every one of them was once invisible.
 *
 * Cached per data URL: the answer never changes for a given icon, and a grid
 * of agents re-renders on every install-progress tick. Decoded at render, not
 * at import, so the module is safe to load on a server.
 */
const deferredColorCache = new Map();
function defersColor(dataUrl) {
    const cached = deferredColorCache.get(dataUrl);
    if (cached !== undefined)
        return cached;
    let answer = false;
    const base64 = dataUrl.slice(dataUrl.indexOf("base64,") + 7);
    try {
        answer = dataUrl.includes("base64,")
            ? atob(base64).includes("currentColor")
            : decodeURIComponent(dataUrl).includes("currentColor");
    }
    catch {
        // Undecodable: treat it as carrying its own colour and just draw it.
        answer = false;
    }
    deferredColorCache.set(dataUrl, answer);
    return answer;
}
/**
 * An agent's icon from a registry manifest, as an SVG data URL.
 *
 * Two rendering paths, chosen by what the SVG itself asks for:
 *
 * - **`currentColor` (monochrome)** → a CSS mask filled with `currentColor`,
 *   so the glyph takes the surrounding ink exactly as its author meant, in any
 *   theme. A mask also cannot execute script, which matters for artwork
 *   fetched from a third-party registry.
 * - **anything else (real brand colours)** → an image, untouched. Masking
 *   one of these would flatten a multicolour logo to one tone.
 *
 * Neither path injects the SVG's markup into the DOM, and nothing here should.
 */
function ExternalAgentMark({ dataUrl, size = 14, className, }) {
    if (defersColor(dataUrl)) {
        const mask = `url("${dataUrl}") center / contain no-repeat`;
        return (_jsx("span", { "aria-hidden": true, className: cn("inline-block shrink-0 bg-current", className), style: { width: size, height: size, mask, WebkitMask: mask } }));
    }
    return (_jsx("img", { src: dataUrl, width: size, height: size, alt: "", "aria-hidden": true, className: cn("shrink-0 rounded-sm object-contain", className) }));
}
/**
 * The type step for a monogram in a `size`px box: the initial sits at about
 * 70% of the box, rounded to the scale (9, 10, 11, 13, 16, 24px).
 */
function monogramTextClass(size) {
    if (size <= 12)
        return "text-3xs";
    if (size <= 14)
        return "text-2xs";
    if (size <= 16)
        return "text-xs";
    if (size <= 18)
        return "text-base";
    if (size <= 22)
        return "text-lg";
    return "text-2xl";
}
/**
 * The last-resort agent glyph: the label's initial, for an agent with no
 * icon. Decorative: the caller shows the agent's name as text.
 */
function AgentMonogram({ label, size = 14, className, }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("font-mono font-semibold leading-none", monogramTextClass(size), className), children: ([...label.trim()][0] ?? "?").toUpperCase() }));
}
export { AgentMonogram, ExternalAgentMark, monogramTextClass };
//# sourceMappingURL=agent-icon.js.map
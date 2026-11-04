/**
 * The design-system ratchet's rules (desktop's decision 33), closed at zero.
 *
 * Each is a class of value that type-checks, lints and renders perfectly and is
 * invisible until someone re-reads the file: an arbitrary size, a raw colour, a
 * hand-written z-index. A rule's `instead` is printed on failure, so it says
 * what to write.
 *
 * The patterns are `/g`: always `match`, never `test`, which carries
 * `lastIndex` between calls and answers a different question each time.
 */
/** The colour-taking utilities a palette or white/black rule has to cover. */
const COLOUR_UTILITIES = "(?:bg|text|border|ring|fill|stroke|divide|outline|decoration|caret|shadow|accent|from|via|to)";
/**
 * `transition-all` animates whatever changes next, not what the author meant:
 * a width, a padding that follows a count. Each is a layout animation that
 * recalculates the page every frame, and nothing reports it. Exported on its
 * own so a consumer can pass it back with a wider `scope` (desktop holds all
 * of `src/` and `index.html` to it, not just the folders that render).
 */
export const TRANSITION_ALL_RULE = {
    id: "transition-all",
    instead: "name the properties: transition-colors for a hover colour, transition-opacity, or " +
        "transition-[translate,opacity] when movement goes with it (decision 29).",
    // The class, and the CSS or inline-style spelling (`transition: "all 200ms"`).
    pattern: /\btransition-all\b|\btransition(?:-property)?\s*:\s*["'`]?all\b/g,
};
export const RULES = [
    {
        id: "arbitrary-text-size",
        instead: "text-3xs … text-2xl (decision 24). Half-pixel sizes round UP.",
        pattern: /\btext-\[-?\d*\.?\d+(?:px|rem|em|pt)\]/g,
    },
    {
        id: "arbitrary-z-index",
        instead: "z-panel / z-titlebar / z-overlay / z-modal / z-popover / z-toast / z-tooltip / z-drag (decision 28).",
        pattern: /\bz-\[[^\]]+\]/g,
    },
    {
        id: "arbitrary-shadow",
        instead: "shadow-sm (raised) / shadow-md (menus) / shadow-lg (dialogs), plus inset-highlight (decision 27).",
        pattern: /\bshadow-\[[^\]]+\]/g,
    },
    {
        id: "arbitrary-radius",
        instead: "rounded (= sm) / rounded-md / rounded-lg / rounded-xl / rounded-full (decision 26).",
        pattern: /\brounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|es|ee))?-\[[^\]]+\]/g,
    },
    {
        id: "colour-literal",
        instead: "a base token or a theme key; see keys.toml.",
        pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g,
    },
    {
        id: "white-black-utility",
        instead: "a token: bg-background / bg-card / text-foreground / border-border. White and " +
            "black are not theme-neutral, and `bg-` was never the only way to write one.",
        pattern: new RegExp(`\\b${COLOUR_UTILITIES}-(?:white|black)(?:\\/\\d+)?\\b`, "g"),
    },
    {
        id: "tailwind-palette",
        instead: "a status or base token: text-warning / bg-warning-muted / text-success / " +
            "border-error. Tailwind's stock ramps are a second palette no theme can reach.",
        pattern: new RegExp(`\\b${COLOUR_UTILITIES}-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|\\d{3})(?:\\/\\d+)?\\b`, "g"),
    },
    {
        id: "bare-z-index",
        instead: "z-panel / z-titlebar / z-drawer / z-overlay / z-modal / z-popover / z-toast / " +
            "z-tooltip / z-drag (decision 28). Below 50 is local stacking and is fine.",
        // `z-50` is Tailwind's stock top and is what "float above everything"
        // reaches for, which with named layers running to 500 is the wrong instinct.
        pattern: /\bz-(?:[5-9]\d|\d{3,})\b/g,
    },
    TRANSITION_ALL_RULE,
    {
        id: "inline-numeric-style",
        instead: "a class from the scale; an inline style cannot be swept and cannot be themed.",
        // The `var(` escape hatch has to survive being QUOTED: an inline style in
        // TSX is a string, so `zIndex: "var(--z-popover)"` is the correct fix.
        pattern: /\b(?:zIndex|fontSize|boxShadow)\s*:\s*(?!["'`]?\s*var\()["'`\d]/g,
    },
];
/**
 * ADR-0027's contract step: a theme key's variable has no prefix
 * (`--element-hover`), so an `--atlas-…` name is a reference to the old one.
 * Opt-in through `banAtlasPrefix`, because desktop renames by directory and
 * only bans the old names once the aliases are gone.
 */
export const ATLAS_PREFIX_RULE = {
    id: "atlas-prefixed-variable",
    instead: "the unprefixed variable: a theme key's CSS name is its dotted name with `.` and `_` " +
        "as `-` (`element.hover` → `--element-hover`).",
    pattern: /--atlas-[a-z0-9-]+/g,
};
//# sourceMappingURL=rules.js.map
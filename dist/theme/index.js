/**
 * `@tryatlas/design/theme`: the pure half of the theme engine (ADR-0022,
 * ADR-0027). Reading, resolving and colour maths only — nothing here touches
 * the DOM, so applying a resolved theme stays the app's job.
 */
export { alphaOf, hexOf } from "./values.js";
export { colorToCss, contrastRatio, hsvToHex, lighten, mix, parseColor, readable, toHsv, withAlpha, } from "./color.js";
export { themeFromToml } from "./parse-theme.js";
export { resolveBase, resolveTheme, } from "./resolve-theme.js";
export * from "./theme-key-registry.js";
//# sourceMappingURL=index.js.map
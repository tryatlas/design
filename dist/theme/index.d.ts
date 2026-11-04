/**
 * `@tryatlas/design/theme`: the pure half of the theme engine (ADR-0022,
 * ADR-0027). Reading, resolving and colour maths only — nothing here touches
 * the DOM, so applying a resolved theme stays the app's job.
 */
export { alphaOf, hexOf } from "./values.ts";
export { colorToCss, contrastRatio, hsvToHex, lighten, mix, parseColor, readable, toHsv, withAlpha, type HsvColor, type RgbaColor, } from "./color.ts";
export { themeFromToml } from "./parse-theme.ts";
export { resolveBase, resolveTheme, type ResolvedTheme, type ThemeOverride, } from "./resolve-theme.ts";
export * from "./theme-key-registry.ts";
export type * from "./types.ts";
//# sourceMappingURL=index.d.ts.map
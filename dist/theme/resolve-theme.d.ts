import type { Theme, ThemeAppearance, ThemeKeyValue } from "./types.ts";
import { type Appearance, type DerivedVar, type PaletteKey, type ThemeKey } from "./theme-key-registry.ts";
export interface ThemeOverride {
    base?: Record<string, string>;
    palette?: Partial<Record<PaletteKey, string>>;
    keys?: Partial<Record<ThemeKey, ThemeKeyValue>> & Record<string, ThemeKeyValue | undefined>;
}
export interface ResolvedTheme {
    id: string;
    appearance: Appearance;
    base: Record<string, string>;
    palette: Record<string, string>;
    keys: Record<ThemeKey, string>;
    /** Colours Atlas derives from a key; see `DERIVED_VAR_REGISTRY`. */
    derived: Record<DerivedVar, string>;
    cssVars: Record<`--${string}`, string>;
}
/**
 * Every shadcn base token, from the ones a theme wrote (ADR-0022): a written
 * value is taken as is, and each one left out follows its rule in
 * `keys.toml` — palette, then an earlier token, then the Atlas default — so a
 * theme that names only `background` and `primary` still sets the whole set.
 * Tokens with no rule (the optional fonts) pass through untouched.
 */
export declare function resolveBase(written: Record<string, string>, palette: Record<string, string>, appearance: Appearance): Record<string, string>;
export declare function resolveTheme(theme: Theme, requested: ThemeAppearance, themeOverride?: ThemeOverride, 
/** `interfaceContrast`, in percent: 100 is the theme as written. */
contrast?: number): ResolvedTheme;
//# sourceMappingURL=resolve-theme.d.ts.map
/**
 * The theme file's shape, as desktop's Rust parser hands it to the frontend
 * (and as `parseTheme` reads it from TOML). The pure half of desktop's
 * `features/theme/lib/theme-api.ts`; the IPC half stays in the app.
 */
export type ThemeMode = "system" | "dark" | "light";
export type ThemeAppearance = "dark" | "light";
/** The table spelling of a theme key. Only `color` is accepted: nothing
 *  between a theme key and the code renderers can carry a font style. */
export type ThemeKeyStyle = {
    color: string;
};
export type ThemeKeyValue = string | ThemeKeyStyle;
export interface ThemeVariant {
    base: Record<string, string>;
    palette: Record<string, string>;
    keys: Record<string, ThemeKeyValue>;
}
export interface Theme {
    schema: number;
    id: string;
    name: string;
    author: string;
    license: string;
    /** Base tokens both variants share (shadcn's `cssVars.theme`), already
     *  merged into each variant's `base`; omitted when empty. */
    base?: Record<string, string>;
    dark?: ThemeVariant;
    light?: ThemeVariant;
    /** Omitted when there are no forward-compatibility warnings. */
    warnings?: ThemeWarning[];
}
export interface ThemeWarning {
    key: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map
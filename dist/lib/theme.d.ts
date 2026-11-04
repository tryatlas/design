/**
 * Theme control for Atlas Standards.
 *
 * Three settings, two appearances. "system" follows the OS and is the default,
 * because a user who has told their machine they want light has already
 * answered this question once.
 *
 * The resolved appearance is written to `data-appearance` on <html> as a
 * literal "dark" or "light" — never "system" — and the theme's id to
 * `data-theme`. Every block in themes.css keys off that pair, so nothing
 * downstream has to know a media query exists. Built-in themes only: a user
 * theme needs the resolver (`@tryatlas/design/theme`), which is the app's.
 */
export type ThemeSetting = "light" | "dark" | "system";
export type Appearance = "light" | "dark";
/**
 * Runs before first paint, inlined into the document head.
 *
 * Without this the server renders the dark fallback, the client reads
 * localStorage on mount, and a user on light gets a black flash on every
 * navigation. It is stringified rather than imported because it has to
 * execute before the bundle does.
 */
export declare const themeInitScript: (theme?: string) => string;
type ThemeContextValue = {
    /** What the user chose. */
    setting: ThemeSetting;
    /** What that resolves to right now. */
    appearance: Appearance;
    setSetting: (next: ThemeSetting) => void;
    /** Flips between the two appearances, leaving "system" behind. */
    toggle: () => void;
};
export declare function ThemeProvider({ theme, children, }: {
    /** A built-in theme's id, as in themes.css. */
    theme?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=theme.d.ts.map
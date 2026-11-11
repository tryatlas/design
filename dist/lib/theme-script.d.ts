/** Where `ThemeProvider` keeps the user's light/dark/system choice. */
export declare const STORAGE_KEY = "atlas-theme";
/**
 * Runs before first paint, inlined into the document head.
 *
 * Without this the server renders the dark fallback, the client reads
 * localStorage on mount, and a user on light gets a black flash on every
 * navigation. It is stringified rather than imported because it has to
 * execute before the bundle does.
 */
export declare const themeInitScript: (theme?: string) => string;
//# sourceMappingURL=theme-script.d.ts.map
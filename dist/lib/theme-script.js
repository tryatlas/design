// No "use client": a server component (a Next.js root layout) calls
// `themeInitScript()` to inline it into <head>, and a function exported from a
// client module reaches the server as a reference that cannot be called.
/** Where `ThemeProvider` keeps the user's light/dark/system choice. */
export const STORAGE_KEY = "atlas-theme";
/**
 * Runs before first paint, inlined into the document head.
 *
 * Without this the server renders the dark fallback, the client reads
 * localStorage on mount, and a user on light gets a black flash on every
 * navigation. It is stringified rather than imported because it has to
 * execute before the bundle does.
 */
export const themeInitScript = (theme = "atlas") => `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var setting = stored === "light" || stored === "dark" ? stored : "system";
    var appearance = setting === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : setting;
    document.documentElement.setAttribute("data-appearance", appearance);
  } catch (e) {
    document.documentElement.setAttribute("data-appearance", "dark");
  }
  document.documentElement.setAttribute("data-theme", ${JSON.stringify(theme)});
})();
`;
//# sourceMappingURL=theme-script.js.map
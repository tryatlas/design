"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
const STORAGE_KEY = "atlas-theme";
const SETTINGS = ["light", "dark", "system"];
function isThemeSetting(value) {
    return typeof value === "string" && SETTINGS.includes(value);
}
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
const ThemeContext = createContext(null);
function systemAppearance() {
    if (typeof window === "undefined")
        return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function storedSetting() {
    if (typeof window === "undefined")
        return "system";
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return isThemeSetting(stored) ? stored : "system";
    }
    catch {
        return "system";
    }
}
export function ThemeProvider({ theme = "atlas", children, }) {
    // The server has no localStorage and no media query, so both render paths
    // have to start at the same value or React will complain about the
    // mismatch. themeInitScript has already corrected the DOM by this point;
    // the effect below re-syncs state to it.
    const [setting, setSettingState] = useState("system");
    const [appearance, setAppearance] = useState("dark");
    useEffect(() => {
        const next = storedSetting();
        setSettingState(next);
        setAppearance(next === "system" ? systemAppearance() : next);
    }, []);
    // Only "system" cares what the OS is doing.
    useEffect(() => {
        if (setting !== "system")
            return;
        const query = window.matchMedia("(prefers-color-scheme: light)");
        const onChange = () => setAppearance(query.matches ? "light" : "dark");
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, [setting]);
    useEffect(() => {
        document.documentElement.setAttribute("data-appearance", appearance);
        document.documentElement.setAttribute("data-theme", theme);
    }, [appearance, theme]);
    const setSetting = useCallback((next) => {
        setSettingState(next);
        setAppearance(next === "system" ? systemAppearance() : next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        }
        catch {
            // A blocked storage API is not a reason to refuse to change theme.
        }
    }, []);
    const toggle = useCallback(() => {
        setSetting(appearance === "dark" ? "light" : "dark");
    }, [appearance, setSetting]);
    const value = useMemo(() => ({ setting, appearance, setSetting, toggle }), [setting, appearance, setSetting, toggle]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside a <ThemeProvider>");
    }
    return context;
}
//# sourceMappingURL=theme.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { ANSI_BG_CLASS, ANSI_NAMES } from "./code-surface.js";
/**
 * The theme's terminal colours on the terminal's own background: the sixteen
 * ANSI slots, normal over bright, then a line with the cursor and a selection.
 * A specimen for a theme page or a theme editor.
 */
export function TerminalPalette({ className }) {
    const rows = [ANSI_NAMES.slice(0, 8), ANSI_NAMES.slice(8)];
    return (_jsxs("div", { "data-slot": "terminal-palette", className: cn("flex flex-col gap-3 rounded-md border border-border bg-terminal-background p-3 font-mono text-2xs text-terminal-foreground", className), children: [rows.map((row, r) => (_jsx("div", { className: "grid grid-cols-4 gap-2 sm:grid-cols-8", children: row.map((name, i) => {
                    const slot = r * 8 + i;
                    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [_jsx("span", { className: cn("h-6 rounded-sm", ANSI_BG_CLASS[slot]) }), _jsxs("span", { className: "truncate opacity-70", children: [slot, " ", name] })] }, name));
                }) }, r))), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-terminal-ansi-green", children: "~/atlas" }), " ", _jsx("span", { className: "bg-terminal-selection", children: "git status" }), _jsx("span", { "aria-hidden": true, className: "ml-px inline-block h-[1.1em] w-[0.6em] bg-terminal-cursor align-text-bottom" })] })] }));
}
//# sourceMappingURL=terminal-palette.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { ClaudeMark, CursorMark, GeminiMark, OpenAIMark, OpenCodeMark } from "./brand-marks.js";
// `familyOf` and `agentFamily` are display-string heuristics for the web app,
// which only has a model or agent name to go on. Desktop never calls them: it
// knows the family and passes `family`.
function familyOf(model) {
    const m = model.toLowerCase();
    if (m.includes("claude") || m.includes("opus") || m.includes("sonnet"))
        return "claude";
    if (m.startsWith("gpt") || m.includes("codex") || /^o\d/.test(m))
        return "openai";
    if (m.includes("gemini"))
        return "gemini";
    return null;
}
/** The mark for a coding agent: Claude Code, Codex, Gemini CLI, Cursor, OpenCode. */
function agentFamily(agent) {
    const a = agent.toLowerCase();
    if (a.includes("claude"))
        return "claude";
    if (a.includes("codex") || a.includes("openai"))
        return "openai";
    if (a.includes("gemini"))
        return "gemini";
    if (a.includes("cursor"))
        return "cursor";
    if (a.includes("opencode"))
        return "opencode";
    return null;
}
const MARK = {
    claude: ClaudeMark,
    openai: OpenAIMark,
    gemini: GeminiMark,
    cursor: CursorMark,
    // Beside the model's name the mark is decoration, so it drops its title.
    opencode: (props) => _jsx(OpenCodeMark, { title: "", ...props }),
};
function ModelMark({ family, className }) {
    const Mark = MARK[family];
    return (_jsx(Mark, { className: cn(family === "opencode" ? "h-3 w-auto shrink-0" : "size-3 shrink-0", className) }));
}
function ModelBadge({ model, family, size = "xs", className, }) {
    const shown = family !== undefined ? family : familyOf(model);
    return (_jsxs("span", { "data-slot": "model-badge", "data-size": size === "2xs" ? size : undefined, className: cn(
        // Whole strings, not a 2xs override: tailwind-merge does not know the
        // `h-control-*` utilities conflict, so it would keep both heights.
        size === "2xs"
            ? "inline-flex h-control-2xs max-w-full items-center gap-1 rounded-full border border-border px-1.5 text-secondary-foreground"
            : "inline-flex h-control-xs max-w-full items-center gap-1.5 rounded-full border border-border px-2 text-secondary-foreground", className), children: [shown && _jsx(ModelMark, { family: shown }), _jsx("span", { className: "truncate font-mono text-2xs", children: model })] }));
}
export { ModelBadge, ModelMark, agentFamily, familyOf };
//# sourceMappingURL=model-badge.js.map
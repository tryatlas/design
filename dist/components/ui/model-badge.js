import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { ClaudeMark, CursorMark, GeminiMark, OpenAIMark, OpenCodeMark } from "./brand-marks.js";
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
    opencode: OpenCodeMark,
};
function ModelMark({ family, className }) {
    const Mark = MARK[family];
    return _jsx(Mark, { className: cn("size-3", family === "opencode" && "w-auto", className) });
}
function ModelBadge({ model, className }) {
    const family = familyOf(model);
    return (_jsxs("span", { "data-slot": "model-badge", className: cn("inline-flex h-control-xs max-w-full items-center gap-1.5 rounded-full border border-border px-2 text-secondary-foreground", className), children: [family && _jsx(ModelMark, { family: family }), _jsx("span", { className: "truncate font-mono text-2xs", children: model })] }));
}
export { ModelBadge, ModelMark, agentFamily, familyOf };
//# sourceMappingURL=model-badge.js.map
/**
 * A model, as a chip with its family's mark: the Claude spark, the Gemini
 * star, the OpenAI knot, the Cursor cube. The marks are inline SVG
 * (`brand-marks.tsx`), so the badge needs no asset files: Claude and Gemini
 * keep their brand colours, the monochrome ones take the chip's ink.
 */
type Family = "claude" | "openai" | "gemini" | "cursor" | "opencode";
declare function familyOf(model: string): Family | null;
/** The mark for a coding agent: Claude Code, Codex, Gemini CLI, Cursor, OpenCode. */
declare function agentFamily(agent: string): Family | null;
declare function ModelMark({ family, className }: {
    family: Family;
    className?: string;
}): import("react").JSX.Element;
declare function ModelBadge({ model, className }: {
    model: string;
    className?: string;
}): import("react").JSX.Element;
export { ModelBadge, ModelMark, agentFamily, familyOf };
//# sourceMappingURL=model-badge.d.ts.map
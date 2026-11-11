/**
 * A model, as a chip with its family's mark: the Claude spark, the Gemini
 * star, the OpenAI knot, the Cursor cube, the OpenCode frame. The marks are
 * inline SVG (`brand-marks.tsx`), so the badge needs no asset files: Claude
 * and Gemini keep their brand colours, the monochrome ones take the chip's
 * ink.
 *
 * Pass `family` when the app knows it (desktop does, from the agent's
 * metadata); without it the badge guesses from the model string.
 */
type ModelFamily = "claude" | "openai" | "gemini" | "cursor" | "opencode";
declare function familyOf(model: string): ModelFamily | null;
/** The mark for a coding agent: Claude Code, Codex, Gemini CLI, Cursor, OpenCode. */
declare function agentFamily(agent: string): ModelFamily | null;
declare function ModelMark({ family, className }: {
    family: ModelFamily;
    className?: string;
}): import("react").JSX.Element;
declare function ModelBadge({ model, family, size, className, }: {
    model: string;
    /** The model's family when the app knows it; `null` draws no mark. Omitted, it is guessed from `model`. */
    family?: ModelFamily | null;
    /**
     * `xs` (20px, the default) beside a control. `2xs` (18px, `h-control-2xs`)
     * is the inline chip: in a line of text or a dense row, with a tighter gap
     * and padding to match.
     */
    size?: "xs" | "2xs";
    className?: string;
}): import("react").JSX.Element;
export { ModelBadge, ModelMark, agentFamily, familyOf };
export type { ModelFamily };
//# sourceMappingURL=model-badge.d.ts.map
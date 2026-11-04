import { type BrandMarkProps } from "../../lib/brand-mark-svg.tsx";
/**
 * Third-party brand marks: every one the package draws except the BYOK
 * provider marks, which are in `provider-marks.tsx`.
 *
 * These are the only colour literals in the component tree, and they are not
 * theme colours — they are somebody else's trademark. Google's four-colour G
 * is specified by their brand guidelines and must not be recoloured, tinted
 * or reduced to a monochrome glyph on a sign-in button; doing so is both a
 * guideline violation and a recognisability problem, since the colour IS the
 * mark. The ratchet exempts this file by name for exactly that reason.
 *
 * Which keep their colour, and which take the ink they sit in:
 *
 * - Brand colour: Google's G, Claude's spark (Anthropic's terracotta),
 *   Gemini's star, and Cursor's 2.5D cube as an agent (`CursorAgentMark`, the
 *   five shades Cursor ships it in). For these the colour is the mark.
 * - `currentColor`: GitHub, X, Discord, OpenAI's knot, the flat Cursor cube
 *   (`CursorMark`, for a model or an editor), and the agent and editor marks
 *   (Claude Code, Codex, Kilo, Zed, JetBrains). Their owners authorise them
 *   in one colour, so they follow the theme.
 * - Theme tokens: OpenCode's frame, whose brand files are one geometry in
 *   two colourings, so it is drawn on `fill-foreground` and takes the right
 *   one in any theme.
 *
 * Sources: the model marks and the Claude Code and Codex marks are Lobe Icons
 * (MIT), the editor marks Simple Icons 16.33.0 (CC0), and the Cursor cube,
 * Kilo's placeholder and OpenCode's frame come from the Atlas desktop app;
 * see THIRD_PARTY_NOTICES.md.
 *
 * Accessibility: the agent and editor marks name themselves (`title`,
 * defaulting to the brand name; `title=""` makes one decorative, see
 * `lib/brand-mark-svg.tsx`). The social and model marks are decorative
 * (`aria-hidden`): they sit inside a labelled button or next to a model name.
 *
 * Choosing a mark is the app's job. Nothing here maps an agent, model or
 * provider id to a mark; desktop does that in `agentMeta()` (ADR-0002: no
 * agent gets special treatment, a mark is only an identity glyph).
 *
 * Sized at 16px to match `ICON_SIZES.md`, so a brand mark and a Lucide glyph
 * sit on the same optical line inside a button.
 */
declare function GoogleMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
declare function GitHubMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
declare function XMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
declare function DiscordMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/** Claude's spark, in Anthropic's terracotta. */
declare function ClaudeMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/** Gemini's star: a blue ground under three fading washes. The gradients
 *  need ids unique to this instance, so two stars on a page stay apart. */
declare function GeminiMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/** OpenAI's knot. Monochrome: takes `currentColor`. */
declare function OpenAIMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/** Cursor's cube, monochrome: takes `currentColor`. */
declare function CursorMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
/**
 * OpenCode's mark: a frame with a block set in its lower half. Its brand
 * files are the same geometry in two colourings — light frame and dim block
 * on dark, the reverse on light — so it is drawn on theme tokens and takes
 * the right one in ANY theme scope. Taller than wide: the height is fixed and
 * the width follows.
 */
declare function OpenCodeMark({ className, ...props }: BrandMarkProps): import("react").JSX.Element;
/** Claude Code's pixel glyph. Monochrome: takes `currentColor`. */
declare function ClaudeCodeMark(props: BrandMarkProps): import("react").JSX.Element;
/** Codex's prompt glyph. Monochrome: takes `currentColor`. */
declare function CodexMark(props: BrandMarkProps): import("react").JSX.Element;
/**
 * Cursor's 2.5D cube, as an agent: five fixed shades, the way Cursor ships
 * it. Its own letterboxed viewBox (taller than wide), centred in the square
 * box. For a model or an editor use the flat `CursorMark`.
 */
declare function CursorAgentMark(props: BrandMarkProps): import("react").JSX.Element;
/**
 * Kilo's mark. PLACEHOLDER: a bold K (takes `currentColor`) until the
 * official brand SVG replaces it, the way Cursor's did.
 */
declare function KiloMark(props: BrandMarkProps): import("react").JSX.Element;
/** Zed's mark. Monochrome: takes `currentColor`. */
declare function ZedMark(props: BrandMarkProps): import("react").JSX.Element;
/** JetBrains' mark. Monochrome: takes `currentColor`. */
declare function JetBrainsMark(props: BrandMarkProps): import("react").JSX.Element;
export { ClaudeCodeMark, ClaudeMark, CodexMark, CursorAgentMark, CursorMark, DiscordMark, GeminiMark, GitHubMark, GoogleMark, JetBrainsMark, KiloMark, OpenAIMark, OpenCodeMark, XMark, ZedMark, };
export type { BrandMarkProps };
//# sourceMappingURL=brand-marks.d.ts.map
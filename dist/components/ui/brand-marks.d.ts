/**
 * Third-party brand marks.
 *
 * These are the only colour literals in the component tree, and they are not
 * theme colours — they are somebody else's trademark. Google's four-colour G
 * is specified by their brand guidelines and must not be recoloured, tinted
 * or reduced to a monochrome glyph on a sign-in button; doing so is both a
 * guideline violation and a recognisability problem, since the colour IS the
 * mark. GitHub's Octocat is authorised in a single colour, so it takes
 * `currentColor` and inherits the button's ink.
 *
 * The model marks below follow the same rule: Claude's spark and Gemini's
 * star keep their brand colours; OpenAI's knot, Cursor's cube and OpenCode's
 * frame are monochrome marks, so they take the ink they sit in. They are the
 * marks desktop draws (Lobe Icons, MIT — THIRD_PARTY_NOTICES.md), inlined so
 * a consumer needs no asset files.
 *
 * The ratchet exempts this file by name for exactly that reason.
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
 * the right one in ANY theme scope.
 */
declare function OpenCodeMark({ className, ...props }: React.ComponentProps<"svg">): import("react").JSX.Element;
export { ClaudeMark, CursorMark, DiscordMark, GeminiMark, GitHubMark, GoogleMark, OpenAIMark, OpenCodeMark, XMark, };
//# sourceMappingURL=brand-marks.d.ts.map
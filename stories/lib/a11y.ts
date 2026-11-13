/**
 * Story parameters that turn axe's `color-contrast` rule off for ONE story.
 * `.storybook/preview.tsx` runs it on every story under
 * `bun run test:storybook`, and this is the only way out of it. The argument
 * is the reason, and there are four:
 *
 *   disabled      The low-contrast text is a disabled state. WCAG 1.4.3
 *                 exempts inactive UI components.
 *   code-content  The failing text is code or terminal output, coloured by
 *                 the theme's syntax and ANSI keys (Atlas dark's syntax is
 *                 Pierre's palette, synced by desktop's `bun run theme:pierre`)
 *                 or by the program itself (SGR faint, inverse, ANSI black).
 *                 That is the content's palette, not the package's chrome;
 *                 raising it is a palette decision of its own.
 *   every-theme   The story draws every built-in theme at once, including
 *                 the ported third-party palettes, whose colours Atlas does
 *                 not restate (see `text.disabled` in `keys.toml`). Known
 *                 open failures there: the 12% hue fills behind `Tag` and
 *                 `Pill` in light themes, Atlas's own included. The run
 *                 checks the default theme everywhere else.
 *   decorative    The failing text is an `aria-hidden` mark standing in for
 *                 an image: a project's monogram where its icon would be,
 *                 dimmed with the row that receded. WCAG 1.4.3 exempts
 *                 text that is pure decoration or part of a logo; the row's
 *                 accessible name carries the project.
 */
export function contrastExempt(
  _reason: "disabled" | "code-content" | "every-theme" | "decorative",
) {
  return { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } };
}

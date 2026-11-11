# @tryatlas/design

Atlas's design system, as one package: the primitives, the tokens, the
themes and the ratchet that keeps them honest. Desktop, the web app and the
docs all install it, so a button looks the same in all three because it is
the same button.

Desktop is the source of truth ([ADR-0027][adr]). Everything here was
copied out of the desktop app and is changed here from now on; desktop
installs it back.

## What is in it

| Path                        | What it is                                                                                                                                                                                                                                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/`                   | Desktop's primitives, on `@base-ui/react`: button, dialog, menus, select, tooltip, popover, segmented, switch, slider, command, colour picker…                                                                                                                                                                          |
| `src/components/`           | Components only the old `standards` gallery had (avatar, toast, table, tag, sheet, tabs…, plus `patterns/`, `blocks/` and `shell/`), restyled to desktop's language, `layout/`: the controlled frame, dock, splits and tab strip both apps' shells are built from, and `code-surface/`: the editor and terminal chrome. |
| `src/styles/`               | `styles.css` (the entry), `styles-core.css` (the entry with only the default theme), `tokens.css`, `utilities.css`, and the generated `themes.css` and `default-theme.css`                                                                                                                                              |
| `src/theme/`                | The theme engine's pure half: the resolver, the colour maths, the generated key registry                                                                                                                                                                                                                                |
| `src/ratchet/`              | The design-system ratchet, as rules and a runner                                                                                                                                                                                                                                                                        |
| `keys.toml`                 | **The one hand-edited source of every derived colour**                                                                                                                                                                                                                                                                  |
| `themes/*.toml`             | The built-in themes                                                                                                                                                                                                                                                                                                     |
| `theme-rules/*.txt`         | Generated tables desktop's Rust reads                                                                                                                                                                                                                                                                                   |
| `scripts/generate-theme.ts` | The generator                                                                                                                                                                                                                                                                                                           |
| `stories/`                  | Storybook: the foundations pages and a story for every `src/ui` primitive and `src/components` component (see [Storybook](#storybook))                                                                                                                                                                                  |

## The boundary rule

A component belongs here if it renders from its props alone. Anything that
calls `invoke()`, `fetch`, a router or a store stays in its app.

The shell components (`AppShell`, `Sidebar`, `SettingsShell`,
`OrgSwitcher`, `CommandMenu`…) need links, so they take them through
`LinkProvider` instead of importing a router:

```tsx
import { LinkProvider } from "@tryatlas/design"

// TanStack Router
<LinkProvider
  Link={({ href, ...props }) => <Link to={href} {...props} />}
  location={useRouterState({ select: (s) => s.location })}
  navigate={(href) => router.navigate({ to: href })}
>
```

Without a provider, links are plain `<a href>` and nothing is "active".

## Exports

```jsonc
{
  ".": "components, lib helpers (cn, motion, LinkProvider…)",
  "./variants": "the server-safe subset: the cva recipes (buttonVariants…), Icon, cn",
  "./blocks": "the illustration blocks for a marketing page (Globe, DitherField, LogoMarquee…), react and motion only",
  "./styles.css": "the stylesheet",
  "./styles-core.css": "the stylesheet with only Atlas as a :root floor, for an app that applies themes itself",
  "./blocks.css": "the stylesheet for ./blocks alone: Atlas, the utilities, and only the blocks' classes",
  "./theme": "resolveTheme, resolveBase, themeFromToml, the registry, colour utils",
  "./ratchet": "runRatchet, defineRatchetSuite, formatViolations, RULES, strictRules, ATLAS_PREFIX_RULE, TRANSITION_ALL_RULE, SURFACE_CARD_RULE",
  "./animations": "INFINITE_ANIMATIONS, INFINITE_ANIMATION_FPS_VAR, infiniteAnimationFps (no React, no DOM at import)",
  "./session": "the SessionView types and helpers, StreamingMarkdown, ToolCallCard, TurnRow, SessionTimeline, SessionPipeline",
  "./timeline-calendar": "TimelineCalendar, which needs @tanstack/react-virtual",
  "./checkpoint-trace": "CheckpointTrace and its types, which needs @tanstack/react-virtual",
  "./keys.toml": "the derivation source",
  "./themes/*": "the built-in theme files, e.g. ./themes/dracula.toml",
  "./theme-rules/*": "theme-keys.txt and base-rules.txt",
}
```

A website that only wants the illustration blocks imports `./blocks` and
`./blocks.css`; [docs/website-adoption.md](./docs/website-adoption.md) is the
guide.

Peer dependencies, never bundled: `react`, `react-dom`, `@base-ui/react`,
`lucide-react`, `motion`, and optionally `@tanstack/react-virtual` — only
`./timeline-calendar` and `./checkpoint-trace` import it, which is why each
is an entry of its own.
`./session` is an entry of its own for the same reason: it needs
`react-markdown`, `remark-gfm`, `remark-parse` and `unified` (optional peers,
which desktop and web already have), and the root entry imports none of them.

### Sessions

Desktop and web each adapt their own session shape (the delta wire, the
server's `TimelineEntry` pages) onto one presentational type, `SessionView`,
and render it with the same blocks. The field-by-field mapping is the
docblock of `src/components/session/session-view.ts`.

```tsx
import rehypeHighlight from "rehype-highlight";
import { SessionTimeline, toolKindOf, type SessionView } from "@tryatlas/design/session";

const plugins = [rehypeHighlight]; // stable identity: blocks re-render on a new array

<SessionTimeline
  session={toSessionView(source)} // the app's adapter
  rehypePlugins={plugins}
  commentSlot={(anchor) => <CommentButton anchor={anchor} />}
  onLoadPayload={(callId, part) => loadPayload(callId, part)}
  errorAction={<Button onClick={signIn}>Sign in</Button>}
/>;
```

The package highlights nothing itself: pass `rehype-highlight` (or anything
that emits highlight.js classes), and `syntax.css`, part of `styles.css`,
colours them from the theme's `syntax.*` keys. `StreamingMarkdown` never
re-parses a finished block, so stream into it as fast as text arrives.

### Server components

Every module that uses hooks, context or a Base UI part starts with
`"use client"`, and nothing touches `window` at import time. That makes the
components safe to render from a React Server Component, but it does not make
the root entry a good import there:

- The root is a barrel of client modules, so importing it from a server
  component puts the whole package in the client graph.
- A function exported from a client module reaches a server component as a
  client reference, which cannot be called. `buttonVariants()` from the root
  throws on the server.

So import by what the file is:

```tsx
// A server component: the class recipes, Icon, Badge and cn. No "use client"
// anywhere behind this entry (a test holds it).
import { BookIcon } from "lucide-react";
import { Badge, buttonVariants, Icon } from "@tryatlas/design/variants";

<a href="/docs" className={buttonVariants({ variant: "outline", size: "sm" })}>
  <Icon icon={BookIcon} size="sm" /> Docs
</a>;

// A client component ("use client" at its top): anything, from the root.
import { Button, Dialog, Tooltip } from "@tryatlas/design";
```

The recipes on `./variants` are `buttonVariants`, `iconButtonVariants`,
`badgeVariants`, `kbdVariants`, `inputVariants`, `toggleVariants`,
`tabsListVariants`, `linkVariants` and `calloutVariants`, plus the menu's
`menuContentVariants`, `menuItemVariants`, `menuLabelVariants` and
`menuShortcutVariants` (for a list that cannot take focus, such as an editor's
slash menu: `highlight: "active"` styles the row the caller marks `data-active`). The root re-exports the same
functions, so client code can keep importing them from there.

## How themes work

```
keys.toml + themes/*.toml
        │  bun run theme
        ├──▶ src/theme/theme-key-registry.ts   the resolver's rules
        ├──▶ theme-rules/*.txt                 desktop's Rust interpreter
        ├──▶ src/styles/themes.css             every built-in theme, resolved
        └──▶ src/styles/default-theme.css      Atlas alone, the floor in styles-core.css
```

A theme is a shadcn base (`background`, `primary`, `foreground`… every one
optional), an optional eight-hue palette, and optional theme keys
(`element.hover`, `syntax.keyword`). Whatever a theme leaves out is derived
by the rules in `keys.toml`, in one place ([ADR-0022][adr22]).

Those rules run in three places, and all three are generated from the same
file:

- **`themes.css`**, for anything that only shows built-in themes (web, docs,
  Storybook). One block per theme and appearance, fully resolved; no colour
  code runs. `:root` is Atlas dark.
- **The TypeScript resolver** (`@tryatlas/design/theme`), for a user theme
  or a live theme-editor preview.
- **The Rust tables**, which desktop's Rust interpreter runs for import and
  export. The golden fixture `theme-rules/base-derivation.json` (exported as `@tryatlas/design/theme-rules/base-derivation.json`) holds both
  interpreters to the same answers.

Pick a theme with two attributes, on `<html>` or on any element:

```html
<html data-theme="tokyo-night" data-appearance="dark"></html>
```

A theme key's CSS variable is its dotted name with `.` and `_` turned into
`-`, with no prefix: `element.hover` is `--element-hover`. Tailwind sees
them through `utilities.css`, so you write `bg-element-hover`, never the
variable. A test fails if two names would write the same variable.

The palette's eight hues are identities (a label, a project), not
statuses, and reach Tailwind as `bg-hue-red`, `text-hue-blue`… through
their own keys, `hue.red` … `hue.pink`, plus `hue-grey` (the theme's
`muted-foreground`) for no hue. Each key derives from the palette hue of the
same name, so an "orange" chip is the theme's orange; a theme that wants its
chips to differ from its palette sets the key. Atlas does, for dark yellow:
its palette's yellow is a terminal's `#ffff00`, which ANSI yellow, the
warning status and search matches keep, and its chips use `#e0ca66`.

To change a rule or a built-in theme, edit `keys.toml` or `themes/`, run
`bun run theme`, and commit what it writes. `bun run theme:check` (and the
test suite) fails when a generated file is stale. Never derive a theme colour
with `color-mix()` in CSS; a tint at a call site is fine.

## Using it

In the consumer's entry CSS, after Tailwind:

```css
@import "tailwindcss";
@import "@tryatlas/design/styles.css";
```

`styles.css` does not import Tailwind itself, so there is one preflight. It
brings Geist and Geist Mono (via `@fontsource-variable`, so they work
offline in Tauri) and an `@source` for the package's compiled files, so your
Tailwind keeps the classes only the package uses.

An app that applies themes itself — resolving a theme with `resolveTheme`
and writing its `cssVars` onto `<html>`, as desktop does — imports
`@tryatlas/design/styles-core.css` instead. It is `styles.css` with
`default-theme.css` in place of `themes.css`: the same tokens, utilities,
fonts and `@source`, minus the other themes' `[data-theme][data-appearance]`
blocks, which are most of the bytes and never match in such an app.

`default-theme.css` is Atlas alone, as a floor for the first paint, before
the app's engine has written anything: Atlas dark at `:root`, Atlas light
when the OS prefers light, and `data-appearance="dark|light"` on `<html>`
overriding the OS. Every selector is `:root` (specificity 0,1,0), so write
the app's own theme one step above it, at `html:root` as desktop does, and
it wins wherever either block sits — including a launch-cache `<style>` that
lands before the package's stylesheet. In the consumer fixture the core
entry builds to about 149 KB against 273 KB for `styles.css`.

- **Desktop** imports components and styles from the package and pins an
  exact version. `bun run theme:keys` copies `keys.toml`, the built-in themes
  and the Rust tables from `node_modules` into `crates/atlas-theme/`, so the
  Rust build never reads `node_modules`. It runs the ratchet from its own
  test with `runRatchet`, turning on `banAtlasPrefix` once its `--atlas-`
  rename is done.
- **Web and docs** import components and `styles.css`, and pick themes with
  `data-theme`/`data-appearance`. They need no theme code.

The ratchet, from any consumer's tests:

```ts
import { TRANSITION_ALL_RULE, formatViolations, runRatchet } from "@tryatlas/design/ratchet";

it("holds the design system at zero", () => {
  const violations = runRatchet({
    roots: ["src/features", "src/components"],
    exemptFiles: {
      "src/brand.tsx": "Shape 2. A third party's logo; a recoloured logo is wrong.",
    },
    // Optional: rules of your own, each { id, pattern (/g), instead, scope? }.
    // `scope` replaces `roots` for that rule (directories or single files, read
    // whatever `include` says), and a rule with a built-in's id replaces it.
    rules: [{ ...TRANSITION_ALL_RULE, scope: ["src", "index.html"] }],
  });
  expect(violations, formatViolations(violations)).toEqual([]);
});
```

Exemptions and `ratchet-allow:` markers apply to a consumer's rules as to the
built-in ones.

Or the whole test as config: `defineRatchetSuite` registers the suite with
your runner's `describe` and `it`, fails with the same message (plus
`footer`), and with `minFiles` also fails when the roots hold too few files —
a root that moved scans nothing and would pass. `strictRules` is the next
notch, which web holds: `rounded-[inherit]` allowed, no raised shadows
(`shadow-sm`, `shadow-xl`…), no `[var(--…)]` arbitrary values, no `dark:`.
`SURFACE_CARD_RULE` is opt-in on top of either: an in-content card is the
`surface-card` utility, never a ring or `rounded-xl bg-card` of its own
(`rules: [...strictRules, SURFACE_CARD_RULE]`).

```ts
import { defineRatchetSuite, strictRules } from "@tryatlas/design/ratchet";
import { describe, it } from "vitest";

defineRatchetSuite(
  {
    root: import.meta.dirname + "/..",
    roots: ["src/components", "src/routes", "src/lib"],
    rules: strictRules,
    minFiles: 200,
    exemptFiles: { "src/lib/seo.ts": "<meta name=theme-color> is read before any CSS loads." },
    footer: "Roles and scales come from @tryatlas/design; see its token CSS.",
  },
  { describe, it },
);
```

Two guards for a consumer's own tests, from the root entry:

- **`PACKAGE_SENTINEL_CLASS`** (`"[--tryatlas-design-sentinel:1]"`) is
  named only in the package's `dist/`, so the rule
  `--tryatlas-design-sentinel: 1` is in the consumer's compiled CSS only if
  Tailwind scanned the package through `styles.css`'s `@source`. Assert on
  the declaration; import the constant rather than writing it out, or your
  own source generates the rule.
- **`D23_RENAMES`** maps each renamed colour name (without `--`) to
  `{ variable, utility }`: the old `standards` roles (`hairline` →
  `border-subtle`, `success` → `status-success-foreground`…) and desktop's
  `--atlas-<key>` → `--<key>`, generated from the key registry. `utility` is
  the Tailwind colour name that replaces `<prefix>-<old>`, the old name
  itself where the package still bridges it (`text-success` still works),
  or `null` where no utility exists.

### Endless animations

`@tryatlas/design/animations` lists every animation in the package that
never stops (`INFINITE_ANIMATIONS`), for an app that has to cap them — desktop
does on Linux, where WebKitGTK presents a frame per tick. A `css` entry gives
the `selector` to override and a `steps` count near 12 fps; a `js` entry (the
marquee, the globe's turn, the dither field) reads `--infinite-animation-fps`
when it starts:

```css
html.platform-linux {
  --infinite-animation-fps: 12;
}
html.platform-linux [data-slot="globe-live-dot"] {
  animation-timing-function: steps(24);
}
```

### Links

A link that stands on its own in the interface — "View all", a footer link,
"Learn more" after a line of UI copy — has **no underline at rest** and
underlines on hover and on keyboard focus. Its place and its ink already say
it is a link. A link **inside running text** — prose, rendered markdown, a
field's description — **keeps its underline at rest**, because there the
underline is the only thing telling it apart from the words around it.

- `TextLink` (`href`, `tone="default" | "muted"`) is the standalone link. It
  renders through `LinkProvider`, so the app's router handles `href`.
  `linkVariants` is its recipe, for a plain `<a>` in a server component.
- `Button variant="link"` follows the standalone rule.
- `.prose-session a` (the session blocks' markdown), `FieldDescription` and
  `Accordion` content underline their links at rest.

## Migrating from standards

The package replaced the old `standards` gallery (its last commit is
`172759a`). The web app's adoption (tryatlas/server#42) ran into everything
below. The list comes from diffing that commit's components, `lib` and
stylesheets against today's `src`.

### Imports

- Import from the package root, not a deep path: `import { Button } from "@tryatlas/design"`.
  The primitives moved from `components/ui/` to `src/ui/` (desktop's versions);
  the root hides the move.
- **In a server component, import from `@tryatlas/design/variants`**: the cva
  recipes, `Icon`, `Badge` and `cn`. See [Server components](#server-components).
- `styles.css` replaces the old `tokens.css`, `themes.css`, `globals.css` and
  `utilities.css`. Import it after Tailwind (see [Using it](#using-it)).

### Renamed or removed components and props

| standards                                                                                                                                       | the package                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SegmentedPills` (`onChange`, `SegmentOption`)                                                                                                  | `Segmented` (`onValueChange`, `SegmentedOption`, a required `aria-label`). It is a **radio group**, so tests query `getByRole("radio")`, not `"tab"`                                                                                                                                                                                                                         |
| `UnderlineTabs` `onChange`                                                                                                                      | unchanged: still `onChange`                                                                                                                                                                                                                                                                                                                                                  |
| `DeltaPill value={8.0}` (a percentage)                                                                                                          | `DeltaChip delta={0.08}`. `delta` is a fraction and renders as `▲ 8%` (`▼`, or `—` when flat; `null` renders nothing). `tone="up-good" \| "down-good"` replaces `DeltaPill`'s `tone` (since 0.1.5)                                                                                                                                                                           |
| `Sparkline`                                                                                                                                     | removed                                                                                                                                                                                                                                                                                                                                                                      |
| `LogoMarquee` with built-in logos (`src`, `srcLight`, `alt`)                                                                                    | `logos` is required: `{ mark, … }[]`, so the caller brings its own                                                                                                                                                                                                                                                                                                           |
| `UiScaleProvider`, `useUiScale`, `uiScaleInitScript`                                                                                            | removed. The package applies no interface scale; the app owns it (desktop and web set `zoom` on `<html>`). `UiScaleControl` and `UiScalePanel` take `scale` and `onScaleChange`                                                                                                                                                                                              |
| `OrgProvider`, `useOrg`                                                                                                                         | removed. `OrgSwitcher` takes `orgs`, `org`, `onOrgChange`, `email`, `settingsHref`, and optionally `membersHref` and `onLogOut`                                                                                                                                                                                                                                              |
| shell components reading the router                                                                                                             | `AppShell` (`title`, `header`, `nav`, `footer`, `actions`, and the controlled `collapsed` and `dockMode`), `SettingsShell` (`groups`, `backHref`, `org`) and the `sidebar-controls` menus (`user`, `links`, `onLogOut`, …) take everything as props; links go through `LinkProvider`                                                                                         |
| `StatCard` `index` (staggered entrance)                                                                                                         | removed; stat cards don't animate in                                                                                                                                                                                                                                                                                                                                         |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScroll*Button` | one `Select` with `value`, `onValueChange` and `options` (`SelectOption[]`). `value={null}` shows `placeholder`; a chosen option's label replaces it (until 0.1.2 a `placeholder` always won, so a "Mixed" select now passes `value={null}`). `id`, `name`, `required` and the `aria-*` field props pass through, so `<Label htmlFor>` works. `empty` is the no-options slot |
| a table sorted on the server                                                                                                                    | `DataTable` with `sort` + `onSortChange` (controlled, `DataTableSort`) and `manualSorting` to draw `rows` as given; a column without `sortValue` opts in with `sortable`. Local sorting stays the default                                                                                                                                                                    |
| `ScrollBar`                                                                                                                                     | removed; `ScrollArea` draws its own                                                                                                                                                                                                                                                                                                                                          |
| `ContextMenuRadioItem`                                                                                                                          | removed                                                                                                                                                                                                                                                                                                                                                                      |
| `menu-styles.ts` (`menuItem`, `menuPopup`…)                                                                                                     | removed; the menus style themselves                                                                                                                                                                                                                                                                                                                                          |
| `ProgressiveBlur`                                                                                                                               | removed. `GradualBlur` / `BlurEdge` are the package's edge blur, with a different API                                                                                                                                                                                                                                                                                        |
| `TAG_CLASS`, `HUE_VAR`                                                                                                                          | `HUE_BG` and `HUE_CHIP` (class strings), or `bg-hue-*` / `text-hue-*`                                                                                                                                                                                                                                                                                                        |
| tag and hue `indigo`, `amber`                                                                                                                   | `blue`, `yellow`; `pink` is new. `hueFor` hashes over the nine identity hues and never returns `grey`, so most entities change colour (they now match desktop)                                                                                                                                                                                                               |
| `Badge variant="error"`                                                                                                                         | `variant="destructive"`; `severe` is new                                                                                                                                                                                                                                                                                                                                     |
| `Button` default variant `secondary`                                                                                                            | default is `default` (primary). A bare `<Button>` that meant the quiet one needs `variant="secondary"`                                                                                                                                                                                                                                                                       |
| `Button variant="destructive"` (a tint)                                                                                                         | solid. The tint is `destructive-outline`; `ghost-destructive` and `warning-outline` are new                                                                                                                                                                                                                                                                                  |
| `Button size="xl"`                                                                                                                              | `lg`                                                                                                                                                                                                                                                                                                                                                                         |
| `Button size="icon"`, `icon-xs`, `icon-sm`, `icon-lg`                                                                                           | `IconButton` with `size` `md`, `xs`, `sm`, `lg` (`label` required)                                                                                                                                                                                                                                                                                                           |
| `DialogContent size="sm" \| "md" \| "lg"`                                                                                                       | removed; set a max width with a class                                                                                                                                                                                                                                                                                                                                        |
| `Icon` sizes `xs 12 · sm 14 · md 16 · lg 18 · xl 22`                                                                                            | `xs 10 · sm 12 · md 14 · lg 16 · xl 20`: each name is one step smaller, stroke 1.75                                                                                                                                                                                                                                                                                          |
| `initials` from the mock folder                                                                                                                 | `initialsOf` from the root                                                                                                                                                                                                                                                                                                                                                   |

New since standards, and worth knowing: `Hint` / `HintGroup` (tooltips with
key hints), `KbdKeys` and `KbdCombo`, the `Command*` palette parts,
`SecretInput`, the colour picker, and more brand marks (Claude, OpenAI,
Gemini, Cursor, OpenCode).

### Classes and utilities

| standards                                                                                                                    | the package                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `*-hairline`                                                                                                                 | `*-border-subtle`                                                                                |
| `bg-surface`, `ring-surface`                                                                                                 | `bg-panel`, `ring-panel`                                                                         |
| `*-shell-canvas`, `*-shell-edge`                                                                                             | `*-sidebar`, `*-sidebar-border`                                                                  |
| `bg-segment-thumb`                                                                                                           | `bg-element-active`                                                                              |
| `micro`                                                                                                                      | `eyebrow`                                                                                        |
| `figure`                                                                                                                     | `font-semibold tabular-nums`                                                                     |
| `text-4xs`                                                                                                                   | `text-3xs` (the smallest step, 9px)                                                              |
| `h-control-xl`, `size-control-xl`                                                                                            | `*-control-lg` (32px, the largest)                                                               |
| `rounded-2xl`, `rounded-3xl`                                                                                                 | `rounded-xl`, the top of the radius scale                                                        |
| `hide-scrollbar` and the global hidden scrollbars                                                                            | not in the package; an app that wants them keeps its own utility                                 |
| layout sizes (`w-sidebar`, `w-dock`, `w-list-pane`, `w-properties`, `w-settings-nav`, `max-w-settings`, `h-topbar`, `h-row`) | removed; the shell components size themselves, and an app's own layout constants live in the app |
| `tag`, `tag-<hue>`                                                                                                           | `<Tag>`, or `HUE_CHIP`                                                                           |
| `glass`                                                                                                                      | `glass-hud` (with `backdrop-blur-glass`)                                                         |
| `diff-*`, `syntax-*`, `illustration` colours                                                                                 | the theme keys' own names: `text-syntax-keyword`, `bg-diff-added-text`; no `illustration`        |
| `surface-raised`, `segment-track`, `element-emphasis`                                                                        | removed; pick the role from the Colour foundations page                                          |
| `--ease-panel`                                                                                                               | `ease-out-strong` (CSS) or `EASE_PANEL` (`motion`)                                               |

Only 500 and 600 weights exist, and headings tighten by size (see the Type
foundations page).

### Themes and variables

- **Pick a theme with two attributes**: `data-theme="atlas"` (or any built-in
  id) plus `data-appearance="dark|light"`. Standards used
  `data-theme="dark|light"` alone.
- **Theme variables are unprefixed**: `--element-hover`, not desktop's
  `--atlas-element-hover`. A theme key's variable is its dotted name with `.`
  and `_` turned into `-`. In Tailwind you write `bg-element-hover`, never the
  variable.
- The package sets no root font size; desktop and web both use 13px, so `rem`
  spacing matches between them.

### Upgrading to 0.1.18

Motion, surfaces and variants from the web design audit. **One breaking change:** `Panel`'s `delay` prop is now `index` (stagger position).

- **Motion:**
  - `Dialog`, `Popover` and `Sheet` take `instant`, so surfaces opened from the keyboard skip their entrance.
  - Under reduced motion, popups fade instead of moving.
  - The new `stream-caret` replaces `.session-caret`.
  - The shimmer and pulse-ring are listed in `INFINITE_ANIMATIONS`.
  - New `pressable` utility: a press dip for anything clickable that isn't a `Button`.
- **Surfaces:** a `surface-card` utility, plus an opt-in ratchet rule, `SURFACE_CARD_RULE`.
- **Variants:**
  - `Button`: `loading`, a success tone, a pill shape.
  - `IconButton`: `xl` and `reveal`. `reveal` hides by opacity, so the button stays in the tab order and the accessibility tree.
  - `Skeleton`: `xl` radius.
  - `Textarea`: `size`.
  - `Sheet`: `surface`. `SheetHeader`: `divided` and `compact`.
  - `EmptyState`: page size.
  - `KpiStrip`: a column per cell, and a phone layout.
  - `SettingRow`: disabled.
  - `TextLink`: inline (always underlined).
  - Read-only inputs get their own look.
- **Shells:**
  - `SettingsShell`: a phone layout, and parent items stay lit on sub-pages.
  - `OrgSwitcher`: logos, plan label, loading state, `onCreateOrg`, `onInvite`, `numberKeys`, `shortcuts={false}`.
  - `ProfileMenu` and `InfoMenu` take `children` for host submenus. `InfoMenu` also takes `onFeedback`.
  - `PersonAvatar`: `art`, `image={null}`, `xl` and `2xl`.

### Upgrading to 0.1.17

Focus and keycap fixes.

- **Text fields draw no focus outline.** Text-type `input`, `textarea`, `[contenteditable]` and `[role=textbox]` are left out of the global `:focus-visible` rule. `Input`, `Textarea`, `InputGroup`, `ComboboxChips` and the `DataTable` search show focus by turning their border `--ring`. An invalid field keeps its red border.
- **One muted keyboard ring.** Everything else gets 2px of `--ring` with a 2px offset (was 1px). The Atlas themes' `ring` is no longer pure white or black: Atlas dark `#808080`, light `#757575`. It reaches 3:1 or better on every surface.
- **Keycaps inside filled buttons.** In a `default` or `destructive` `Button`, `Kbd` and `KbdKeys` take their colours from the button.

### Upgrading to 0.1.16

Accessibility fixes. Secondary and disabled text get brighter in the Atlas-authored themes.

- **Text contrast.** `muted-foreground` and `text.disabled` now reach at least 4.5:1 on every surface in `atlas`, `atlas-mono`, `chyral` and `phosphor`, both dark and light. Atlas dark moves from `#585858` to `#939393` (muted) and from `#3f3f3f` to `#858585` (disabled). The ported third-party themes are unchanged.
- **`test:storybook` now fails on `color-contrast`.** A story that is low-contrast on purpose opts out with `contrastExempt(reason)` (`stories/lib/a11y.ts`).
- **`AccordionTrigger`** draws the standard focus ring, inset.
- **`AuthSplit`**'s form column is a `<main>` landmark.
- **`DataTable`** rows with an `onRowClick` are focusable and open on Enter or Space. **`TerminalBlock`** link segments are `role="link"` and open on Enter.
- Secondary text in `SessionPipeline`, `TurnRow`, `CommsMessageRow` and `CodeBlock` is dimmed with text tokens, not opacity.

### Upgrading to 0.1.15

Additive, plus two fixes.

- **New entry: `@tryatlas/design/blocks`** with `@tryatlas/design/blocks.css`, for the website. It holds the illustration blocks (`Globe`, `DitherField`, `DashedRails`, `LogoMarquee`, `GhostCards`, `ProgressiveBlur`, `InfiniteSlider`, `PlusDecorator`, `PlusCorners`) and `themeInitScript`. See `docs/website-adoption.md`.
- **`Globe`** loads cobe lazily, once it nears the viewport and the main thread is idle, and draws a token-coloured fallback (or `fallback`) in its box until then, and for good without WebGL.
- **`DitherField`** paints its first frame on idle behind a static fallback (or `fallback`), and now follows Reduce Motion live: turning it on stops the drift without a remount. It renders a fallback element beside its canvas.
- **`TabStrip`** draws the keyboard ring inside each tab, so the scrolling strip no longer clips it.
- `dither-field` and `logo-marquee` moved from `components/ui/` to `components/blocks/`; the root entry exports the same names.

### Upgrading to 0.1.14

Everything here is additive. Three defaults change, all of them fixes: keycaps follow the host's keyboard, `Hint` draws a string shortcut as keycaps, and `CheckpointTrace` stacks faces side by side.

- **Keycaps follow the keyboard.** `Kbd`, `KbdKeys` and `KbdCombo` now detect the platform. On Windows and Linux, ⌘ and ⌃ read Ctrl, ⌥ reads Alt and ⇧ reads Shift, in desktop's `displayKeys` order (⌃⌘ reads Ctrl Win). Pass `platform="mac"` or `"other"` to override. A server render, and the first client render, draw `"mac"`. A test that expects "⌘" under happy-dom now needs `navigator.platform` stubbed to a Mac. The package also exports `platformKeys`, `platformKey`, `detectKeyPlatform` and the `KeyPlatform` type. `KbdKeys` and `KbdCombo` also take `variant` and `size`.
- **`Hint` keycaps.** A string `shortcut` ("⌘K", or "Ctrl+Shift+B" as Windows spells it) is drawn as keycaps in the new `Kbd variant="inherit"`, which takes its ink from the tooltip, so it reads on any tooltip fill. A tooltip that matched the shortcut as one text node ("⌘+") now finds one `[data-slot="kbd"]` per key. Any other node is still drawn as given.
- **`CheckpointTrace`:**
  - Faces in a cluster and in a lane header sit side by side instead of overlapping, so both sets of initials read whole ("AT JW", not "A JW"). Clusters grow a few px wider.
  - `TraceAuthor` adds an optional `initials`, used when a name would make poor ones ("You" → "ME", "A member" → "?").
  - The default face is exported as `TraceAvatar`, so a `renderAvatar` can wrap it instead of redrawing it.
- **New:**
  - `CodeFence` is a message's fenced block, with its language label inside the box. Desktop's team-chat block: it cancels `hljs` padding and background inside it. Hand it the `<code>` from react-markdown's `pre` override.
  - `min-w-control-2xs` sits beside `h-control-2xs` and `size-control-2xs`.
  - The `.diff-syntax` scope in `syntax.css` is desktop's `diff-syntax.css`, rule for rule, so desktop can delete its copy.
- **New props on existing components:**
  - `DialogTitle` adds `variant="quiet"`, for a filename over a `variant="media"` lightbox.
  - `SectionHeader` adds `icon`, and its `title` now type-checks as any node (it was `string`, through the HTML `title` attribute).
  - `CommsComposerShell` adds `replyEmptyLabel` ("Message deleted" by default). A reply to a message with no text reads "Lin · Message deleted", not "Lin · ".
  - `StepList` adds `startingMessage`. It announces "Starting…" while every step is pending. Pass `null` for a list shown before anything starts.
  - `CommsConversationRow.onSelect` receives a second argument, `{ newTab, event }`: `newTab` is ⌘-click on a Mac and Ctrl-click elsewhere. A one-argument handler still type-checks.
- **Canvas:**
  - `CanvasPagesPanel` adds `lastPageLabel`, the disabled delete's hint ("The last page cannot be deleted." by default).
  - `CanvasMedia` adds `loadingLabel` ("Loading image…"), shown under the spinner.
  - `CanvasHeaderPill` adds `emptyPagesLabel` ("No pages yet." by default), for a switcher with no pages. It also adds `offlineTone`: `"warning"` stays the default, because offline there means edits are held, which is the status scale's "degraded". Pass `"error"` for desktop's red.
  - `CanvasActionPill` adds `exportLabel`, a visible label beside the export icon.

### Upgrading to 0.1.13

One component changes: `CheckpointTrace` is redesigned so a week is readable at a glance. Two of its defaults change.

- **Titles on the chart.** A checkpoint shows its title whenever there is room, then its time and lines changed, or "6 checkpoints · Priya, Sam" for a cluster. Hosts that fill `title` get the full effect; without one, the short sha stands in, set in mono.
- **Bigger faces and lanes.** Faces are 24px and lanes 52px. A person without a photo gets initials in their own hue. A session with no checkpoints is captioned "No checkpoints".
- **Week zoom fits the range** to the screen instead of showing a fortnight of empty canvas.
- **New:** `density` (`"comfortable"` by default, or `"compact"`), and the optional labels `clusterSummary`, `handoffShort`, `latest` and `noCheckpoints`.
- **Changed:** `renderAvatar` is now asked for 24, 20 and 18px faces, not 16 and 14, and must render exactly the size it is given.
- **Changed:** `defaultZoom` now defaults to `"week"`. Pass `defaultZoom="day"` to keep the old default.

### Upgrading to 0.1.12

Everything here is additive. Two defaults change, both of them fixes: the InputGroup focus ring and the icon alignment in DropdownMenu items.

- **New components:** `SplitButton`, `StepList`, `Rail`/`RailNode` (exported from the root), and `SegmentMeter variant="gauge"`.
- **New props on existing components:**
  - `DiffStat` adds `compact`, `hideZero`, `layout="aligned"` and `label`. The package also now exports `formatDiffCount`.
  - `Progress` adds `tone`.
  - `Switch` adds `appearance="check"`.
  - `ModelBadge` gets a new `size="2xs"`, sized by the new 18px `h-control-2xs`/`size-control-2xs` utilities.
  - `IconButton` adds `loading` and a new `variant="floating"`.
  - `EmptyState`'s `icon` now accepts an element as well as an icon.
- **Dialogs:**
  - `DialogContent` adds `size="lg"`.
  - Dialog and AlertDialog share a new `blur` option.
  - `AlertDialogContent` adds `dismissOnBackdrop`, which reports a dismissal as `close-press`, the same as Cancel.
- **`TabStrip`:**
  - Its default behaviours can now be turned off: `rovingFocus`, `closeOnMiddleClick`, `closeOnDelete` and `closeLabel`.
  - `tabProps` lets the host implement drag-to-reorder.
- **`AppFrame`** adds `inset="sides"` for the macOS titlebar.
- **Menus:** the package now exports `menu*Variants({ highlight: "active" })` recipes.
- **`CommsComposerShell`** adds new slots: a tool strip, an overlay, `invalid`/`dropActive`, a mention popup, `renderSend`, and a way to turn its Escape handling off.
- **`Skeleton`** adds `animated={false}` and `radius`.
- **Model marks** can take an optional `title`.
- **`AtlasBadge`** adds `tone="app-icon"`.

### Upgrading to 0.1.11

- **`CheckpointTrace`** is new. It ships as its own entry, `@tryatlas/design/checkpoint-trace`, and like `./timeline-calendar` it needs the optional `@tanstack/react-virtual` peer.
  - It draws sessions as lanes on a time axis, with each checkpoint shown as its author's face.
  - Zoom by hour, day or week, drag to pan, and navigate by keyboard. Close checkpoints cluster together, and it shows handoffs, orphaned commits and live edges. Lanes can be grouped by project or by person.
  - It takes pure props: pass one project's sessions for a project view, or the organisation's for an org view.
  - Lanes are memoized on `renderAvatar`, `renderAgentMark`, `onOpenSession` and `labels`, so keep those referentially stable.
- **`INFINITE_ANIMATIONS`** gains `checkpoint-trace-live-edge`.

### Upgrading to 0.1.10

- **Popovers, menus, Select, Combobox and Tooltip now animate out**: they scale out over 120ms, or fade under reduced motion. The exit is applied through a `data-ending-style:` variant, so a caller's `className="animate-none"` doesn't stop it. A test that expects a popup to be gone on the same tick as Escape now needs to wait about 120ms.
- **`Callout variant="tucked"`** is a strip tucked into the top of a composer. Place it directly above the composer, and give the composer `relative` and a higher z-index. **`Callout animate`** makes it rise in on mount; this adds the `animate-pill-in` token.
- **Sessions:**
  - `SessionTimeline` adds `revealItemId`, which keeps any item drawn even when it is past the window. It also adds `heading`; `false` hides the heading but still shows the error.
  - The rail node has two new slots: `agentMark` and `authorFace`.
  - `TurnRow` and `SessionTimeline` add `renderCheckpointFooter`, `clampResponses` and `toolRunSummary` (`"kinds"` or `"files"`).
  - `Payload` adds `load` (`"loading"` or `"failed"`), so "Load full …" can show a loading state and a retry. `ToolCallCardLabels` adds an optional `loadFailed` label.
  - Leaving any of these unset changes nothing.
- **Inline pickers:** `CommandItem`, `CommandGroupLabel` and `CommandFooter` take `size="compact"`. `CommandItem listbox={false}` drops the option role and its `aria-*` attributes.
- **`DialogContent variant="media"`** is a full-bleed viewer centred by margins rather than a translate, with no padding. Pass `showCloseButton={false}` if your header row has its own close button.
- **`IconButton size="2xs"`** is a 16px square. Its `size` union gains `"2xs"`, so an exhaustive `Record` over that union needs the new key.
- **`Pill`** takes `size="sm"`, `trailingAction` and `surface="raised"`.

### Upgrading to 0.1.9

- **Canvas blocks** (listed under 0.1.8 by mistake; they first ship here): the glass chrome, `CanvasToolbar`, `CanvasHeaderPill`,
  `CanvasActionPill`, `PresenceCursor`/`PresenceLayer`,
  `CanvasPagesPanel`, `CanvasNodeFrame` and the five node bodies,
  `CanvasMinimap`, `actorHue`, `ACTOR_COLOUR_HUE` and `PEER_INK`.
  `canvas.css` (imported by both stylesheets) themes xyflow's `--xy-*`
  variables, so an app can drop its own xyflow overrides.

### Upgrading to 0.1.8

- **New block families**, all exported from the root (canvas came in 0.1.9):
  - **Team chat**: `CommsConversationRow`, `CommsMessageRow`,
    `CommsDayDivider`, `CommsUnreadLine`, `CommsComposerShell`, their view
    types and helpers (`transcriptRows`, `reactionChips`,
    `conversationTitle`, `unreadBadge`), and `rounded-composer`.
  - **Code surface**: `EditorFrame`, `EditorBreadcrumbs`, `EditorStatusBar`,
    `EditorPreview`, `FindBar`, `TerminalBlock`, `TerminalOutput`,
    `TerminalCommandInput`, `TerminalStatus`, `CommandSuggestions`,
    `TerminalStopControl`, `TerminalPalette`, the helpers in
    `code-surface.ts`, and Tailwind bridges for the syntax, editor,
    search-match, diff-text and terminal keys (`bg-terminal-background`
    and friends).
- **Session blocks take more opt-in props** (unset, nothing changes):
  - `ToolCallCard`: controlled open state, `onCopy`, `labels`, and a
    `data-tool-call-id` on every card.
  - `TurnRow` and `SessionTimeline`: `onLoadBody` ("Read the rest" on a
    truncated prompt or reply), `openToolRunIds` /
    `onOpenToolRunIdsChange` (open a folded tool-call group from outside),
    `renderItemFooter`, the thinking props and `onOpenAttachment`.
    `SessionTimeline` forwards them all.
  - **`TurnRow` now calls `commentSlot` for thinking items too.**
- **`AppFrame` is `h-dvh`** (was `h-svh`): no gap under the composer when a
  phone's toolbar collapses. Desktop windows see no difference.
- **`TimelineCalendar endSpace="measure"`** subtracts whatever follows the
  list in its scroller. `true` and `false` behave as before.
- **`UiScalePanel` looks like desktop's**: `ring-1 ring-border shadow-sm`
  (2px shorter), a `border-foreground/8` divider, 8%/6% preset fills.
- **`PopoverContent surface="glass"`** is new, for small menus only (it
  blurs).
- **`IconButton icon` also takes an element**, drawn as given. Wrap it in
  `Icon` or use a package glyph so it stays hidden from screen readers.
- **Accessibility fixes that change names and tab stops:**
  - The account button's name starts with its initials
    (`"UM, account — Name"`), and the collapsed org switcher's is
    `"AT, Atlas"`. Collapsed nav links carry their label.
  - Block `Code`, markdown `<pre>` and the `DataTable` scroller are tab
    stops. The combobox's "Show options" button is not (`tabIndex -1`).
  - `SegmentMeter` takes `label`; `CommandList` takes `aria-label` /
    `aria-labelledby`. An empty `Select` or command popup is no longer an
    empty listbox.
  - Markdown task checkboxes are named after their item.
- **The ratchet's colour rule also bans** `oklch()`, `oklab()`, `lab()`,
  `lch()`, `hwb()` and a `color-mix()` with a named colour. A mix of
  `var()`s, `currentColor` and `transparent` is still fine.
- **Storybook runs every story as a test** (`bun run test:storybook`:
  Chromium, the story's play, and axe with colour-contrast skipped).
  Foundations gain a Spacing page and anchored, cross-linked Principles.

### Upgrading to 0.1.7

- **`StatusDot` has its own module and more of what the apps hand-roll.**
  Same export and default look (a 6px muted disc), now with `size`
  (`xs` 4px · `sm` 6px · `md` 8px · `lg` 10px), the tones `subtle`
  (offline), `primary` (unread) and `foreground`, `hollow` for the off
  state, `cutout` to ring it in the surface it sits on (an avatar's corner),
  and `label` to name it. **Without a `label` (or `aria-label`) it is now
  `aria-hidden`.** Presence reads `success` online, `warning` away, `subtle`
  offline. A deep import from `components/ui/pill.tsx` moves to the root.
- **The segmented `TabsList` looks like `Segmented`.** Tabs sit at their
  own width (they were `flex-1`, so equal), the chosen one's fill is a thumb
  that slides between them (Base UI's `Tabs.Indicator`, `data-slot="tabs-indicator"`),
  and `size="sm" | "md"` matches `Segmented`'s two. Still a `tablist` of
  `tab`s. The active tab no longer carries `bg-element-selected` itself.
- **Links follow one underline rule** (see [Links](#links)): `TextLink` and
  `linkVariants` (also on `./variants`) are new; `Button variant="link"`
  underlines on keyboard focus too; **`.prose-session a` is underlined at
  rest**, where it used to show a dotted rule only on hover.
- **`KiloMark` is Kilo Code's published logo** (a framed monogram, its own
  `0 0 100 100` viewBox) instead of the placeholder K.
- **Guards for consumers' tests**: `PACKAGE_SENTINEL_CLASS` and
  `D23_RENAMES` on the root, and `defineRatchetSuite` and `strictRules` on
  `./ratchet` (see [Using it](#using-it)). `RatchetOptions.rules` takes a
  readonly array.
- **`NextPage`** is new: the end of an infinite list (`hasNext`,
  `fetching`, `failed`, `onNext`, `skeleton`, `failure`, optional `root`).
- **`InputGroupInput` and `InputGroupTextarea` draw no focus ring of their
  own** (`focus-ring-none`). The group shows focus: its border lifts to
  `border-strong`, and on keyboard focus the global ring (2px of `--ring`)
  goes around the whole group, where it used to sit inside its border.
- **`Avatar` takes `size="2xs"` (16px) and `"3xs"` (14px)**, below the
  control ladder, for a face in a line of text or a dense graph.

### Upgrading to 0.1.6

- **`@tryatlas/design/session`** is new: `SessionView` and its helpers,
  `StreamingMarkdown`, `ToolCallCard`, `DefaultDiff`, `TurnRow`,
  `SessionTimeline` and `SessionPipeline`. It needs the optional peers
  `react-markdown`, `remark-gfm`, `remark-parse` and `unified`.
- **`SessionTimeline` and `SessionPipeline` moved** from the root to
  `./session` and take a `SessionView` (`session`) instead of the old
  `status`/`session` plus `entries`. `ENTRY_ICON`, `TimelineEntry` and
  `TimelineEntryKind` are gone.
- **`styles.css` and `styles-core.css` import `syntax.css`** (highlight.js
  classes from the theme's `syntax.*` keys) and `session.css` (the
  `.prose-session` reading type and the streaming caret).
- **`Segmented` is reachable by Tab when nothing is selected.** When `value`
  matches no option (a "Custom" range outside the presets), the first option
  is the tab stop, and Home on it selects it. Until 0.1.6 no option was.

### Upgrading to 0.1.5

0.1.5 also ships the layout primitives (see [Layout primitives](#layout-primitives-new-in-015),
including the `Resizable*` and `Dock*` renames), the palette patterns
(`CommandPalette`, `SearchOverlay`, `HintOverlay`) and the inline brand marks.

- **`styles-core.css` carries Atlas as a first-paint floor** (the new
  generated `default-theme.css`), so an app that applies themes itself no
  longer paints unthemed before its engine runs. It is `:root`-specific only:
  an app writing its theme at plain `:root` must move to `html:root` (or
  anything more specific) to be sure of winning. Desktop already does.
  `styles.css` is unchanged.
- **Atlas dark's `hue.yellow` is `#e0ca66`**, pinned in `themes/atlas.toml`;
  it was the palette's `#ffff00`. Only the identity hue moved: ANSI yellow,
  the warning status and search matches still read the palette. The key's
  default (for a theme with no palette) is the same colour. A consumer that
  copies the generated files re-copies them.
- **`DitherField` needs no `ThemeProvider`.** Its ink is its own CSS
  `color` (`text-foreground` by default, so `className="text-…"` recolours
  it), and it repaints when `class`, `style`, `data-theme`, `data-appearance`
  or `data-theme-appearance` changes on `<html>`, or the OS colour scheme
  does. Inside the provider nothing changes.
- **`UiScalePanel` and `UiScaleControl` take `shortcuts`**
  (`{ decrease?, increase? }`, any node): given, the stepper buttons get
  hints, "Smaller ⌘-" / "Larger ⌘+". Without it, no hints, as before.
- **`TimelineCalendar`**:
  - leaves room after the last day (`endSpace`, on by default), sized from
    the scroller, so the last day can become the sticky date. Pass
    `endSpace={false}` to keep the old end.
  - is semantic again: each day is a `<section>` named "November 4, Today"
    with its `<h2>` and a `role="list"` of `role="listitem"` rows carrying
    `aria-posinset`/`aria-setsize` for the whole day. The wrappers are
    `display: contents`. The sticky date is now a plain `<div>` (no
    `banner` landmark) and its date is hidden from assistive tech. Tests
    that query rows can use `getAllByRole("listitem")`.
  - takes `flush` to put the dates on the column's edge. By default they sit
    8px in, on the text of a row whose fill has its own `px-2` inside the
    hairlines (desktop's `SessionRow`); a row that overhangs with
    `-mx-2 px-2` wants `flush`.
  - measured the sticky header as 0px when the scroller was a parent's ref,
    so the date changed a header's height late. Fixed.
- **`SettingRow` wraps**: once the label column would drop under 12rem, the
  control moves under the label.
- **`DeltaChip` takes `tone`**: `"neutral"` (default, unchanged),
  `"up-good"` or `"down-good"`, turning the chip success or error the way
  `Badge` does; a flat change stays neutral. `KpiCell.tone` and
  `StatCard`'s `trendTone` pass it through. `DeltaTone` is exported.
- **`Segmented` labels are nodes** (`label: React.ReactNode`), with an
  optional `ariaLabel` per option for the accessible name (and an
  `iconOnly` option's tooltip) when the label is not plain text.

### Upgrading to 0.1.4

- **Identity hues are theme keys.** `hue.red` … `hue.pink` (variables
  `--hue-red` … `--hue-pink`) are new, in a new "Identity hues" group, each
  derived from the palette hue of its name. `--color-hue-*` reads them instead
  of `syntax.number`, `syntax.escape` and the ANSI slots, so `orange` and
  `pink` chips change colour in every theme whose syntax colours differ from
  its palette (Atlas, Dracula, Mirage, Monokai, One Dark, Rosé Pine, Tokyo
  Night, Vesper). The Atlas and Mirage palettes' `pink` is now a pink. A
  consumer that copies the generated files (desktop's `bun run theme:keys`)
  re-copies them; there is no fallback for themes written before the keys
  existed, which simply derive them.
- **`styles-core.css`** is new; `styles.css` is unchanged.
- **The ratchet bans `transition-all`** (and `transition: all`) by default,
  as rule `transition-all`. `runRatchet` takes `rules`, and
  `TRANSITION_ALL_RULE` is exported to widen its scope.
- **`@tryatlas/design/animations`** is new. `SessionPipeline`'s running
  spinner and `Globe`'s ping rings and live dot gained `data-slot`s for it.

### Layout primitives (new in 0.1.5)

A new `src/components/layout/` group: router-free, storage-free layout pieces
that desktop and web compose their shells from. Every one is controlled: it
reports a change and draws what it is given, so the app decides what is
remembered and where.

- **`TabStrip`** (`items: TabStripItem[]`, `activeId`, `onSelect`, `onClose`,
  `focused`, `leading`, `trailing`, `renderTab`, a required `aria-label`):
  desktop's pane tabs. A `TabStripItem` is `{ id, title, icon?, closable?,
  dirty?, busy?, pinned? }`. Manual activation (arrows move focus, Enter or
  Space opens), middle-click and Delete close, edges fade and scroll arrows
  appear on overflow. `renderTab(item, tab)` wraps a tab for a context menu
  or a drag handle.
- **`ResizableSplit`, `ResizablePane`, `ResizableHandle`** replace
  `ResizableGroup`, `ResizablePanel` and `ResizableHandle`. The split takes
  `orientation="vertical"` as well as `horizontal`, needs an `id` (and so
  does every pane), and reports `onLayoutCommit(layout)` once per drag, never
  for a layout the library settled on by itself. `ResizableHandle hidden`
  keeps a handle mounted but inert. The handle now lights in `primary` on
  hover and drag, as desktop's do.
- **`AppFrame`** (`sidebar`, `topBar?`, `overlay?`, `dockMode`,
  `onDockModeChange`, `children`): the canvas, the page panel and the dock
  slot, with nothing else in it. **`SideDock`**, **`SideDockSizeToggle`**,
  **`useSideDock`**, **`useSideDockRoom`** and the type **`SideDockMode`** are
  the dock, renamed from `Dock`, `DockSizeToggle`, `useDock`, `useDockRoom`
  and `DockMode`, and moved out of `app-shell`. A borrow from
  `useSideDockRoom` widens the dock without reaching `onDockModeChange`, so
  it can never become the size an app remembers; a pick from the toggle ends
  every borrow; unmounting releases.
- **`AppShell`** is `AppFrame` filled in, and no longer reads or writes
  `localStorage`. It takes `collapsed`, `onCollapsedChange`, `dockMode` and
  `onDockModeChange`; an app that wants the old behaviour keeps both values
  in its own storage.
- The `Sidebar` rail and its active pill snap under reduced motion instead
  of springing.
- `tests/router-agnostic.test.ts` fails if anything in `src` imports a router.

## Installing

Install from a git tag. The package is not published to npm; every consumer is an Atlas repo.

```bash
bun add github:tryatlas/design#v0.1.9
```

Bun does not run a git dependency's build, so **a release tag carries the
built `dist/`**. Cut one from a clean `main`:

```bash
bun run release   # builds, commits dist/ on a detached HEAD, tags v<version>, pushes the tag
```

The version comes from `package.json`; bump it on `main` first.

`main` itself never holds `dist/`.

### Working on desktop and the package together

```bash
# here
bun link
bun run dev            # tsc --watch into dist/

# in the consumer
bun link @tryatlas/design
```

A linked package resolves its peers from its own `node_modules`, so while
linked the consumer must dedupe them (Vite: `resolve.dedupe` with `react`,
`react-dom`, `@base-ui/react` and `motion`), or it renders with two copies of
React and every hook throws. `bun run test:consumer` installs a packed
tarball instead, which is what a real install looks like.

## Developing

```bash
bun install
bun run typecheck
bun run test            # vitest: primitives, resolver, golden fixture, generator, ratchet
bun run test:storybook  # every story in Chromium: render, play, axe (see Storybook)
bun run build           # tsc into dist/
bun run test:consumer   # packs, installs into fixtures/consumer, builds its CSS, renders on the server
bun run format:check
```

**Why `tsc` builds it, not Vite library mode or tsdown.** The package
ships one ESM file per source file, with types, and nothing in it needs
bundling: no CSS imports in JS, no assets, no code to tree-shake that a
consumer's bundler would not shake anyway. `tsc` does exactly that, keeps
`"use client"` at the top of every file (bundlers strip module-level
directives unless a plugin puts them back), and rewrites the `.ts`/`.tsx`
import extensions to `.js` (`rewriteRelativeImportExtensions`). It is one
tool we already need for the type check, with no plugin to keep in step.

## Storybook

Storybook is the package's review surface: the foundations pages (principles,
colour, type, control heights, spacing, radius, elevation, z-index, motion,
icons) and a story for every `src/ui` primitive and every `src/components`
component, under every built-in theme. Stories live
in `stories/`, outside `src`, so they never ship in `dist/`.

**Start here:** [Foundations/Principles](https://design.tryatlas.cc/?path=/story/foundations-principles--page),
how Atlas looks and moves and why. When a story or a redesign makes a
judgment call, cite the principle by its anchor, e.g.
`Principles#rings-not-shadows`.

```bash
bun run storybook         # dev server on http://localhost:6006
bun run build-storybook   # static build into storybook-static/ (gitignored)
bun run storybook:smoke   # after a build: fails if a primitive or component has no story
bun run test:storybook    # every story as a browser test: renders, play passes, axe is clean
```

`test:storybook` runs each story in headless Chromium through
`@storybook/addon-vitest`: the story has to render, its `play` function has
to pass, and `@storybook/addon-a11y`'s axe run has to find nothing, since
`.storybook/preview.tsx` sets `parameters.a11y.test` to `"error"`. Label a
story's controls to fix a violation. When the violation is the component's
own, set `parameters: { a11y: { test: "todo" } }` on that story with a
comment naming the axe rule and the bug: it shows as a warning, and the
story says what to fix. `color-contrast` runs too, in the default theme
(Atlas dark). A story whose low contrast is deliberate (a disabled state,
code coloured by a syntax palette, every theme at once) turns that one rule
off with `contrastExempt(reason)` from `stories/lib/a11y.ts`. Install the browser once with
`bunx playwright install chromium` (add `--with-deps` on Linux, as CI does).

A primitive at `src/ui/<name>.tsx` keeps its stories in
`stories/ui/<name>.stories.tsx`, and a component at
`src/components/<group>/<name>.tsx` in
`stories/components/<group>/<name>.stories.tsx`, which must use every
component the file exports. The smoke test holds both conventions. The
ratchet scans `stories/` too.

### The toolbar, and URLs

Four globals, all of which round-trip through the URL:

| Global       | Values                                          | Reaches the DOM as                      |
| ------------ | ----------------------------------------------- | --------------------------------------- |
| `theme`      | every `id` in `themes/*.toml`                   | `data-theme` on `<html>`                |
| `appearance` | `dark`, `light`                                 | `data-appearance` on `<html>`           |
| `scale`      | `0.9`, `1`, `1.15`, `1.3` (desktop's presets)   | CSS `zoom` on `<html>`, and `--ui-zoom` |
| `viewport`   | `phone` (375), `tablet` (768), `desktop` (1280) | Storybook's viewport                    |

`scale` is a zoom rather than a root font size because desktop's interface
scale is the WebView's zoom (`applyUiScale` in desktop): the type and control
scales are in px, so a root font size would only move `rem` spacing. The
preview sets a 13px root, as desktop does, so `rem` spacing matches the app.

```
/?path=/story/primitives-button--variants&globals=theme:dracula;appearance:light
/iframe.html?id=foundations-colour--page&globals=theme:tokyo-night;appearance:dark;scale:1.15
/iframe.html?id=primitives-dialog--open&globals=viewport:phone
```

`iframe.html` renders the story alone, which is what a screenshot wants.
Overlays (dialog, popover, dropdown and context menu, tooltip, select,
command, and among the components alert dialog, combobox, sheet, toast and the
shell menus) each have an `Open` story that shows the overlay on load.

### Enumerating stories

A build writes `storybook-static/index.json`; the dev server serves the same
file at `/index.json`. Each entry has an `id`, a `title`, a `name`, a `type`
(`story` or `docs`) and the `importPath` of its file:

```bash
curl -s localhost:6006/index.json \
  | jq -r '.entries[] | select(.type == "story") | .id'
```

Feed each `id` to `iframe.html?id=<id>&globals=…` to visit every story in
every theme.

Third-party material is listed in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

[adr]: https://github.com/pacifio/atlas/blob/main/docs/adr/0027-one-design-package-filled-from-desktop-themes-ship-as-generated-css.md
[adr22]: https://github.com/pacifio/atlas/blob/main/docs/adr/0022-a-theme-is-two-colours-and-everything-else-is-derived.md

/**
 * The package as an installed dependency sees it: resolve every export from
 * node_modules, render a component on the server (no window, as Next.js
 * would), resolve a built-in theme, and check the consumer's Tailwind build
 * kept a class only the package uses.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { parse } from "smol-toml";

const design = await import("@tryatlas/design");
const theme = await import("@tryatlas/design/theme");
const ratchet = await import("@tryatlas/design/ratchet");

// Server render: nothing in the component entry may touch `window` on import.
const html = renderToString(createElement(design.Button, null, "Hi"));
assert.match(html, /data-slot="button"/, "Button renders on the server");

// The session entry, with its optional markdown peers installed: the blocks
// render on the server, and the root entry above never needed those peers.
const session = await import("@tryatlas/design/session");
const Markdown = ({ source, className }) =>
  createElement("div", { className: className ?? "prose-session" }, source);
assert.match(
  renderToString(
    createElement(
      session.TranscriptProvider,
      { value: { Markdown, onToggleExpand() {}, onToggleGroup() {} } },
      createElement(session.TranscriptRowItem, {
        row: {
          kind: session.RowKind.Prose,
          id: "p:a1",
          turnId: "t1",
          firstInTurn: true,
          text: "Done",
          streaming: false,
          showHeader: true,
          model: "claude-sonnet",
          timestamp: "2026-11-13T10:00:00Z",
        },
        priority: 0,
        agentLabel: "Claude Code",
      }),
    ),
  ),
  /data-row-id="p:a1".*claude-sonnet.*Done/s,
  "a transcript row renders on the server",
);
assert.equal(
  session.summarizeMarkers([]).summary,
  "Used tools",
  "the transcript's label helpers ship",
);

const require = createRequire(import.meta.url);

// The server-safe entry: callable recipes and a server-rendered Icon, with no
// "use client" in the built entry file.
const variants = await import("@tryatlas/design/variants");
assert.match(variants.buttonVariants({ variant: "outline" }), /border-border/);
assert.doesNotMatch(
  readFileSync(new URL(import.meta.resolve("@tryatlas/design/variants")), "utf8"),
  /^["']use client["']/m,
  "the variants entry is not a client module",
);
const { BookIcon } = await import("lucide-react");
assert.match(
  renderToString(createElement(variants.Icon, { icon: BookIcon, size: "sm" })),
  /width="12"/,
  "Icon renders on the server",
);
assert.match(
  renderToString(createElement(variants.Badge, { variant: "success" }, "Live")),
  /data-slot="badge"/,
  "Badge renders on the server from the variants entry",
);

// A built-in theme from the shipped TOML, through the shipped resolver.
const toml = readFileSync(require.resolve("@tryatlas/design/themes/dracula.toml"), "utf8");
const resolved = theme.resolveTheme(theme.themeFromToml(parse(toml)), "dark");
assert.ok(resolved.cssVars["--element-hover"], "theme keys resolve to unprefixed variables");
assert.equal(typeof ratchet.runRatchet, "function");
assert.equal(ratchet.TRANSITION_ALL_RULE.id, "transition-all");
assert.equal(typeof ratchet.defineRatchetSuite, "function");
assert.ok(
  ratchet.strictRules.some((rule) => rule.id === "dark-variant"),
  "strictRules ships",
);
assert.equal(design.D23_RENAMES.hairline.variable, "border-subtle", "D23_RENAMES ships");

// The endless-animation list, importable without React or a DOM.
const animations = await import("@tryatlas/design/animations");
assert.ok(animations.INFINITE_ANIMATIONS.length > 0, "the endless animations are listed");
assert.equal(animations.INFINITE_ANIMATION_FPS_VAR, "--infinite-animation-fps");

for (const file of ["keys.toml", "theme-rules/theme-keys.txt", "theme-rules/base-rules.txt"]) {
  assert.ok(readFileSync(require.resolve(`@tryatlas/design/${file}`), "utf8").length > 0, file);
}

const css = readFileSync("out/app.css", "utf8");
// The sentinel: only the package's own dist/ names it, so its rule is in the
// output only if Tailwind scanned the package through its `@source`.
assert.equal(design.PACKAGE_SENTINEL_CLASS, "[--tryatlas-design-sentinel:1]");
const SENTINEL = /--tryatlas-design-sentinel:\s*1/;
assert.match(css, SENTINEL, "package classes survive the consumer's build");
assert.ok(
  css.includes(".aria-pressed\\:bg-element-selected"),
  "a class only the package's Button uses survives too",
);
assert.ok(
  css.includes('[data-theme="dracula"][data-appearance="light"]'),
  "themes.css is included",
);
assert.ok(css.includes("Geist Variable"), "Geist is the sans face");

// The theme-less entry: the same package classes and fonts, and Atlas alone
// as the first-paint floor instead of every built-in theme.
const core = readFileSync("out/app-core.css", "utf8");
assert.match(core, SENTINEL, "package classes survive the consumer's build from styles-core.css");
assert.ok(core.includes("Geist Variable"), "styles-core.css brings Geist");
assert.ok(!core.includes("[data-theme="), "styles-core.css carries no built-in theme blocks");
assert.match(
  core,
  /:root\s*\{[^}]*--background:/,
  "styles-core.css carries Atlas as the :root floor",
);
assert.ok(
  core.includes(':root:where([data-appearance="light"])'),
  "styles-core.css carries Atlas light too",
);
// One theme rather than fifteen: by the dropped themes' bytes (about 124 KB),
// not by a ratio, which moves every time the shared stylesheets grow.
assert.ok(css.length - core.length > 100_000, "styles-core.css drops the other themes' bytes");
console.log(`app.css ${css.length} bytes, app-core.css ${core.length} bytes`);

// The blocks entry: server-rendered fallbacks in the globe's and the dither
// field's boxes, cobe only behind a dynamic import, and a stylesheet with the
// blocks' classes but not the app primitives'.
const blocks = await import("@tryatlas/design/blocks");
const inTheme = (el) => createElement(blocks.ThemeProvider, null, el);
assert.match(
  renderToString(inTheme(createElement(blocks.Globe))),
  /data-slot="globe-fallback"/,
  "Globe server-renders its fallback",
);
assert.match(
  renderToString(createElement(blocks.DitherField)),
  /data-slot="dither-fallback"/,
  "DitherField server-renders its fallback",
);
assert.equal(typeof blocks.themeInitScript(), "string");
assert.equal(blocks.Button, undefined, "the blocks entry carries no app primitives");
const globeJs = readFileSync(
  new URL("./globe.js", import.meta.resolve("@tryatlas/design/blocks")),
  "utf8",
);
assert.match(globeJs, /import\("cobe"\)/, "the globe loads cobe dynamically");
assert.doesNotMatch(globeJs, /from\s*"cobe"/, "and never statically");

const blocksCss = readFileSync("out/app-blocks.css", "utf8");
assert.ok(blocksCss.includes("from-muted-foreground\\/15"), "the globe fallback's classes survive");
assert.ok(blocksCss.includes(".eyebrow"), "LogoMarquee's eyebrow label survives");
assert.ok(
  !blocksCss.includes(".aria-pressed\\:bg-element-selected"),
  "no class only an app primitive uses",
);
assert.ok(!blocksCss.includes("[data-theme="), "Atlas alone, no other built-in theme");
assert.ok(blocksCss.includes("Geist Variable"), "blocks.css brings Geist");
console.log(`app-blocks.css ${blocksCss.length} bytes`);

console.log("consumer fixture: ok");

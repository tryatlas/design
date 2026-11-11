import type { Decorator, Preview } from "@storybook/react-vite";
import { MotionGlobalConfig } from "motion/react";
import { BUILT_IN_THEMES, SCALE_PRESETS } from "../stories/lib/themes.ts";
import "./preview.css";

/**
 * The toolbar's globals, and how they reach the DOM.
 *
 *   theme, appearance  `data-theme` / `data-appearance` on <html>, the pair
 *                      every block in `themes.css` selects on. Portalled
 *                      overlays (menus, dialogs, tooltips) mount under
 *                      <body>, so <html> is the one root that themes them too.
 *   scale              CSS `zoom` on <html>. Desktop's interface scale is the
 *                      WebView's own zoom (`applyUiScale` in desktop's
 *                      `features/settings/lib/ui-scale.ts`), not a root font
 *                      size, because the type and control scales are px; `zoom`
 *                      is the same thing in a browser. `--ui-zoom` is set
 *                      alongside it, as desktop does. (The package's
 *                      standards-era `src/lib/ui-scale.tsx` writes a
 *                      `--ui-scale` that no package CSS reads.)
 *   viewport           Storybook's own viewport global.
 *
 * All four round-trip through the URL:
 * `?path=/story/primitives-button--default&globals=theme:dracula;appearance:light;scale:1.15;viewport:phone`
 */
// Under `bun run test:storybook`, motion jumps to its end state. axe reads
// colours from the rendered frame, so an entrance fade caught at opacity 0.1
// reads as a contrast failure that no user ever sees.
if ("__vitest_browser__" in globalThis) MotionGlobalConfig.skipAnimations = true;

const withAtlasTheme: Decorator = (Story, context) => {
  const { theme, appearance, scale } = context.globals as {
    theme?: string;
    appearance?: string;
    scale?: string;
  };
  const root = document.documentElement;
  root.dataset.theme = theme ?? "atlas";
  root.dataset.appearance = appearance ?? "dark";
  const zoom = Number(scale ?? "1") || 1;
  root.style.zoom = zoom === 1 ? "" : String(zoom);
  root.style.setProperty("--ui-zoom", String(zoom));

  // In docs mode Storybook paints its own white page around each story, so
  // the story brings the theme's ground with it.
  if (context.viewMode === "docs") {
    return (
      <div className="rounded-md bg-background p-4 text-foreground">
        <Story />
      </div>
    );
  }
  return <Story />;
};

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withAtlasTheme],
  globalTypes: {
    theme: {
      description: "Built-in theme (themes/*.toml)",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: BUILT_IN_THEMES.map((t) => ({ value: t.id, title: t.name })),
        dynamicTitle: true,
      },
    },
    appearance: {
      description: "Appearance",
      toolbar: {
        title: "Appearance",
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "light", title: "Light", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
    scale: {
      description: "Interface scale (desktop's presets)",
      toolbar: {
        title: "Scale",
        icon: "zoom",
        items: SCALE_PRESETS.map((s) => ({ value: s.value, title: `${s.title} (${s.value})` })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "atlas",
    appearance: "dark",
    scale: "1",
  },
  parameters: {
    // Every story is an axe run under `bun run test:storybook`, and a
    // violation fails it, `color-contrast` included: text clears 4.5:1 on
    // the surfaces it sits on, in the default theme (Atlas dark) the run
    // renders. A story whose violation is the component's own bug sets
    // `a11y: { test: "todo" }` with a comment naming the axe rule. One that
    // is low-contrast on purpose — a disabled state, which WCAG exempts —
    // turns `color-contrast` off for that story alone, and says why.
    a11y: {
      test: "error",
    },
    layout: "padded",
    backgrounds: { disable: true },
    controls: { expanded: true, sort: "requiredFirst" },
    viewport: {
      options: {
        phone: { name: "Phone (375)", styles: { width: "375px", height: "812px" }, type: "mobile" },
        tablet: {
          name: "Tablet (768)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop (1280)",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          [
            "Principles",
            "Colour",
            "Type",
            "Control heights",
            "Spacing",
            "Radius",
            "Elevation",
            "Z-index",
            "Motion",
            "Icons",
          ],
          "Primitives",
          "Components",
          "Patterns",
          "Blocks",
          "Session",
          "Shell",
        ],
      },
    },
  },
};

export default preview;

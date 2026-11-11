// `@tryatlas/design/blocks`: the illustration blocks, for a marketing page
// that wants them without the app primitives, Base UI or the session blocks.
// Its import graph stays inside this directory and `src/lib/` (a test walks
// it), so the only peers it needs are `react` and `motion`; cobe is fetched by
// the globe at runtime, never imported statically. No "use client" here: a
// server component may import this barrel, and each block carries its own
// directive where it needs one. `docs/website-adoption.md` is the guide.
//
// The app blocks in this directory (`ScrollRail`, `TimelineCalendar`,
// `CheckpointTrace`) are not marketing material and stay off this entry.
export { DashedRails } from "./dashed-rails.js";
export { DitherField } from "./dither-field.js";
export { GhostCards } from "./ghost-cards.js";
export { Globe } from "./globe.js";
export { GradualBlur } from "./gradual-blur.js";
export { InfiniteSlider } from "./infinite-slider.js";
export { LogoMarquee } from "./logo-marquee.js";
export { PlusCorners, PlusDecorator } from "./plus-decorator.js";
// The globe reads the appearance from `ThemeProvider`. `themeInitScript` comes
// from a module with no directive, so a server layout can call it.
export { ThemeProvider, useTheme } from "../../lib/theme.js";
export { themeInitScript } from "../../lib/theme-script.js";
//# sourceMappingURL=index.js.map
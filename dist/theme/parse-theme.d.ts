import type { Theme } from "./types.ts";
/**
 * A theme from its TOML, already parsed into plain objects by any TOML reader
 * (the generator uses `smol-toml`; this module takes no dependency on one).
 *
 * It mirrors what desktop's Rust `parse_theme` hands the frontend: nested
 * tables flatten to dotted names, the shared `[base]` is merged under each
 * variant's own, and a key written as `{ color = "…" }` stays a table. Rust
 * remains the validator of user themes; this only has to read the built-ins
 * and anything a web consumer chooses to load.
 */
export declare function themeFromToml(raw: unknown): Theme;
//# sourceMappingURL=parse-theme.d.ts.map
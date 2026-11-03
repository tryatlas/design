export declare const PALETTE_KEYS: readonly ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Appearance = "dark" | "light";
export type ColorTransform = (color: string, context: DerivationContext) => string;
export interface DerivationContext {
    base: Record<string, string>;
    palette: Record<string, string>;
    appearance: Appearance;
}
export interface ThemeKeyRule {
    /** First derivation source after an explicit theme key. */
    palette?: PaletteKey;
    /** Second derivation source after the palette. */
    base?: string;
    /** Per-appearance Atlas default, used only when both sources are absent. */
    atlasDefault: Record<Appearance, string>;
    transform?: ColorTransform;
    description: string;
}
export interface ThemeKeyDefinition<Key extends string = string> {
    key: Key;
    cssVar: `--${string}`;
    rule: ThemeKeyRule;
}
export interface BaseRule {
    token: string;
    palette?: PaletteKey;
    /** An earlier base token this one follows. */
    base?: string;
    /** Per-appearance default, for when neither source answers. */
    atlasDefault?: Record<Appearance, string>;
    transform?: ColorTransform;
    description: string;
}
/**
 * How each shadcn base token a theme leaves out is derived (ADR-0022), in
 * `BASE_TOKENS` order: a rule's `base` is always an earlier rule, so one
 * pass resolves the set.
 */
export declare const BASE_RULE_REGISTRY: readonly BaseRule[];
/**
 * The public schema-1 theme-key registry. Every key appears once and carries
 * exactly one explicit → palette → base → Atlas-default derivation rule.
 */
export declare const THEME_KEY_REGISTRY: readonly [ThemeKeyDefinition<"border.subtle">, ThemeKeyDefinition<"border.strong">, ThemeKeyDefinition<"element.hover">, ThemeKeyDefinition<"element.selected">, ThemeKeyDefinition<"element.active">, ThemeKeyDefinition<"element.highlight">, ThemeKeyDefinition<"primary.hover">, ThemeKeyDefinition<"primary.muted">, ThemeKeyDefinition<"text.disabled">, ThemeKeyDefinition<"status.success.foreground">, ThemeKeyDefinition<"status.warning.foreground">, ThemeKeyDefinition<"status.error.foreground">, ThemeKeyDefinition<"status.info.foreground">, ThemeKeyDefinition<"selection.background">, ThemeKeyDefinition<"terminal.foreground">, ThemeKeyDefinition<"terminal.background">, ThemeKeyDefinition<"terminal.cursor">, ThemeKeyDefinition<"terminal.ansi.black">, ThemeKeyDefinition<"terminal.ansi.red">, ThemeKeyDefinition<"terminal.ansi.green">, ThemeKeyDefinition<"terminal.ansi.yellow">, ThemeKeyDefinition<"terminal.ansi.blue">, ThemeKeyDefinition<"terminal.ansi.magenta">, ThemeKeyDefinition<"terminal.ansi.cyan">, ThemeKeyDefinition<"terminal.ansi.white">, ThemeKeyDefinition<"terminal.ansi.bright_black">, ThemeKeyDefinition<"terminal.ansi.bright_red">, ThemeKeyDefinition<"terminal.ansi.bright_green">, ThemeKeyDefinition<"terminal.ansi.bright_yellow">, ThemeKeyDefinition<"terminal.ansi.bright_blue">, ThemeKeyDefinition<"terminal.ansi.bright_magenta">, ThemeKeyDefinition<"terminal.ansi.bright_cyan">, ThemeKeyDefinition<"terminal.ansi.bright_white">, ThemeKeyDefinition<"syntax.comment">, ThemeKeyDefinition<"syntax.keyword">, ThemeKeyDefinition<"syntax.string">, ThemeKeyDefinition<"syntax.number">, ThemeKeyDefinition<"syntax.type">, ThemeKeyDefinition<"syntax.function">, ThemeKeyDefinition<"syntax.variable">, ThemeKeyDefinition<"syntax.operator">, ThemeKeyDefinition<"syntax.tag">, ThemeKeyDefinition<"syntax.attribute">, ThemeKeyDefinition<"syntax.constant">, ThemeKeyDefinition<"syntax.regexp">, ThemeKeyDefinition<"syntax.escape">, ThemeKeyDefinition<"syntax.definition">, ThemeKeyDefinition<"syntax.property">, ThemeKeyDefinition<"editor.background">, ThemeKeyDefinition<"editor.foreground">, ThemeKeyDefinition<"editor.caret">, ThemeKeyDefinition<"editor.gutter.background">, ThemeKeyDefinition<"editor.gutter.foreground">, ThemeKeyDefinition<"editor.active_line.background">, ThemeKeyDefinition<"editor.active_line.gutter_foreground">, ThemeKeyDefinition<"editor.selection.background">, ThemeKeyDefinition<"editor.match_bracket.background">, ThemeKeyDefinition<"editor.match_bracket.border">, ThemeKeyDefinition<"search.match.background">, ThemeKeyDefinition<"search.match.active_background">, ThemeKeyDefinition<"scrollbar.thumb.background">, ThemeKeyDefinition<"scrollbar.thumb.hover">, ThemeKeyDefinition<"panel.background">, ThemeKeyDefinition<"panel.input.background">, ThemeKeyDefinition<"diff.added.background">, ThemeKeyDefinition<"diff.added.emphasis">, ThemeKeyDefinition<"diff.added.text">, ThemeKeyDefinition<"diff.removed.background">, ThemeKeyDefinition<"diff.removed.emphasis">, ThemeKeyDefinition<"diff.removed.text">, ThemeKeyDefinition<"diff.context.background">, ThemeKeyDefinition<"agent.chip.foreground">, ThemeKeyDefinition<"agent.chip.background">];
export type ThemeKey = (typeof THEME_KEY_REGISTRY)[number]["key"];
export declare const THEME_KEY_DEFINITION_BY_KEY: Record<ThemeKey, (typeof THEME_KEY_REGISTRY)[number]>;
export interface DerivedVarDefinition<Name extends string = string> {
    name: Name;
    cssVar: `--${string}`;
    /** The settable key this transforms, or null when it transforms a base token. */
    from: ThemeKey | null;
    /** The base token this transforms, or null when it transforms a key. */
    base: string | null;
    transform: ColorTransform;
    description: string;
}
/**
 * Colours Atlas still writes as custom properties, but that no
 * theme may set: each is a pure transform of a key that IS settable, so a
 * theme author steers it through that key and never restates it. They are
 * deliberately absent from `theme-keys.txt` and from the JSON Schema, which is
 * what makes writing one in a theme file an unknown-key warning.
 */
export declare const DERIVED_VAR_REGISTRY: readonly [DerivedVarDefinition<"status.success.background">, DerivedVarDefinition<"status.warning.background">, DerivedVarDefinition<"status.error.background">, DerivedVarDefinition<"status.info.background">, DerivedVarDefinition<"element.emphasis">, DerivedVarDefinition<"terminal.selection">];
export type DerivedVar = (typeof DERIVED_VAR_REGISTRY)[number]["name"];
export declare function describeDerivation(definition: ThemeKeyDefinition): string;
//# sourceMappingURL=theme-key-registry.d.ts.map
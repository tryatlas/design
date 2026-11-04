/**
 * The design-system ratchet's rules (desktop's decision 33), closed at zero.
 *
 * Each is a class of value that type-checks, lints and renders perfectly and is
 * invisible until someone re-reads the file: an arbitrary size, a raw colour, a
 * hand-written z-index. A rule's `instead` is printed on failure, so it says
 * what to write.
 *
 * The patterns are `/g`: always `match`, never `test`, which carries
 * `lastIndex` between calls and answers a different question each time.
 */
export interface RatchetRule {
    id: string;
    /** What to write instead. Printed on failure, so keep it actionable. */
    instead: string;
    pattern: RegExp;
}
export declare const RULES: readonly RatchetRule[];
/**
 * ADR-0027's contract step: a theme key's variable has no prefix
 * (`--element-hover`), so an `--atlas-…` name is a reference to the old one.
 * Opt-in through `banAtlasPrefix`, because desktop renames by directory and
 * only bans the old names once the aliases are gone.
 */
export declare const ATLAS_PREFIX_RULE: RatchetRule;
//# sourceMappingURL=rules.d.ts.map
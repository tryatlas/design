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
    /** Must be `/g` (see above). */
    pattern: RegExp;
    /**
     * Where this one rule looks, relative to `cwd`, in place of `runRatchet`'s
     * `roots`: directories, or single files. A file named here is read whatever
     * `include` says, so a consumer can hold `index.html` to a rule. Omitted,
     * the rule scans `roots` like the built-in ones.
     */
    scope?: string[];
}
/**
 * `transition-all` animates whatever changes next, not what the author meant:
 * a width, a padding that follows a count. Each is a layout animation that
 * recalculates the page every frame, and nothing reports it. Exported on its
 * own so a consumer can pass it back with a wider `scope` (desktop holds all
 * of `src/` and `index.html` to it, not just the folders that render).
 */
export declare const TRANSITION_ALL_RULE: RatchetRule;
export declare const RULES: readonly RatchetRule[];
/**
 * ADR-0027's contract step: a theme key's variable has no prefix
 * (`--element-hover`), so an `--atlas-…` name is a reference to the old one.
 * Opt-in through `banAtlasPrefix`, because desktop renames by directory and
 * only bans the old names once the aliases are gone.
 */
export declare const ATLAS_PREFIX_RULE: RatchetRule;
//# sourceMappingURL=rules.d.ts.map
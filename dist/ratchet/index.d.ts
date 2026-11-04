import { type RatchetRule } from "./rules.ts";
export { ATLAS_PREFIX_RULE, RULES, TRANSITION_ALL_RULE, type RatchetRule } from "./rules.ts";
/**
 * `@tryatlas/design/ratchet`: the design-system ratchet as a function a
 * consumer calls from its own test, so desktop, web and docs hold one set of
 * rules at zero.
 *
 *   import { formatViolations, runRatchet } from "@tryatlas/design/ratchet";
 *
 *   it("holds the design system at zero", () => {
 *     const violations = runRatchet({
 *       cwd: repoRoot,
 *       roots: ["src/features", "src/components"],
 *       exemptFiles: { "src/x/brand.tsx": "Shape 2. A third party's logo colours…" },
 *     });
 *     expect(violations, formatViolations(violations)).toEqual([]);
 *   });
 *
 * The exits are deliberate friction. A whole file goes in `exemptFiles` (or a
 * folder in `exemptDirs`) with a real argument next to it: the file DEFINES
 * the scale, or its colours are not Atlas's to choose (a brand mark, a palette
 * the user picks from). A single site gets `ratchet-allow: <reason>` in a
 * comment on its line or anywhere in the comment block above it. Both are
 * checked: a reason that is too short, an exemption whose path is gone and an
 * exemption that no longer suppresses anything are violations too.
 *
 * A consumer adds its own rules with `rules`, each an id, a `/g` pattern, the
 * advice to print and optionally a `scope` of its own. One with a built-in
 * rule's id replaces it, which is how a rule's scope is widened:
 *
 *   rules: [{ ...TRANSITION_ALL_RULE, scope: ["src", "index.html"] }]
 */
export interface RatchetOptions {
    /** Directories to scan, relative to `cwd`. */
    roots: string[];
    /** The directory paths are relative to. Defaults to `process.cwd()`. */
    cwd?: string;
    /** Whole files, relative to `cwd`, each with the argument for exempting it. */
    exemptFiles?: Record<string, string>;
    /** Whole directories, same bar as `exemptFiles`. */
    exemptDirs?: Record<string, string>;
    /** Also ban `--atlas-…` variable names (ADR-0027's contract step). */
    banAtlasPrefix?: boolean;
    /** Which files to read. Defaults to `.ts`, `.tsx` and `.css`. */
    include?: RegExp;
    /**
     * Extra rules, after the built-in ones. A rule with a built-in's `id`
     * replaces it. Exemptions and `ratchet-allow` markers apply to these too.
     */
    rules?: RatchetRule[];
}
export interface RatchetViolation {
    /** A rule id, or one of the exemption checks: `thin-allow-reason`,
     *  `thin-exemption-reason`, `missing-exemption`, `idle-exemption`. */
    rule: string;
    /** Relative to `cwd`, with forward slashes. */
    file: string;
    /** 1-based; absent for a whole-file finding. */
    line?: number;
    /** The text that matched, or the reason that was too short. */
    match: string;
    instead: string;
}
export declare function runRatchet(options: RatchetOptions): RatchetViolation[];
/** The violations as a failure message: one line each, then what to write. */
export declare function formatViolations(violations: RatchetViolation[]): string;
//# sourceMappingURL=index.d.ts.map
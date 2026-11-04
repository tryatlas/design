import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ATLAS_PREFIX_RULE, RULES } from "./rules.js";
export { ATLAS_PREFIX_RULE, RULES, TRANSITION_ALL_RULE, strictRules, } from "./rules.js";
const ALLOW_MARKER = /ratchet-allow:\s*(.*)$/;
// `{/*` too: in TSX, a comment above markup is a JSX expression.
const COMMENT_LINE = /^\s*(?:\{?\/\*|\/\/|\*)/;
const MIN_ALLOW_REASON = 20;
const MIN_EXEMPTION_REASON = 40;
function walk(dir, include) {
    if (!existsSync(dir))
        return [];
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory())
            out.push(...walk(full, include));
        else if (include.test(entry.name))
            out.push(full);
    }
    return out;
}
/** A directory's files that `include` matches; a file named directly, as is. */
function filesUnder(target, include) {
    if (!existsSync(target))
        return [];
    return statSync(target).isFile() ? [target] : walk(target, include);
}
/** The built-in rules, then the consumer's; a consumer rule with a built-in's
 *  id takes its place. */
function rulesFor(options) {
    const builtIn = options.banAtlasPrefix ? [...RULES, ATLAS_PREFIX_RULE] : [...RULES];
    const extra = options.rules ?? [];
    for (const rule of extra) {
        if (!rule.pattern.global)
            throw new Error(`ratchet rule ${rule.id}: the pattern must be /g`);
    }
    const replaced = new Set(extra.map((rule) => rule.id));
    return [...builtIn.filter((rule) => !replaced.has(rule.id)), ...extra];
}
/** The marker governing line `i`: on the line itself, or in the contiguous
 *  comment block above it (a formatter decides where a long value wraps). */
function markerFor(lines, i) {
    const own = ALLOW_MARKER.exec(lines[i]);
    if (own)
        return own;
    for (let j = i - 1; j >= 0 && COMMENT_LINE.test(lines[j]); j--) {
        const found = ALLOW_MARKER.exec(lines[j]);
        if (found)
            return found;
    }
    return null;
}
export function runRatchet(options) {
    const cwd = options.cwd ?? process.cwd();
    const include = options.include ?? /\.(ts|tsx|css)$/;
    const exemptFiles = options.exemptFiles ?? {};
    const exemptDirs = options.exemptDirs ?? {};
    const rules = rulesFor(options);
    const violations = [];
    const relative = (file) => path.relative(cwd, file).split(path.sep).join("/");
    // Each file, with the rules that look at it: the unscoped ones under
    // `roots`, a scoped one under its own paths.
    const rulesByFile = new Map();
    const claim = (paths, rule) => {
        for (const where of paths) {
            for (const file of filesUnder(path.join(cwd, where), include)) {
                const list = rulesByFile.get(file) ?? [];
                if (!list.includes(rule))
                    list.push(rule);
                rulesByFile.set(file, list);
            }
        }
    };
    for (const rule of rules)
        claim(rule.scope ?? options.roots, rule);
    const violates = (file, fileRules) => {
        const text = readFileSync(file, "utf8");
        return fileRules.some((rule) => text.match(rule.pattern) !== null);
    };
    for (const [file, fileRules] of rulesByFile) {
        const where = relative(file);
        if (where in exemptFiles)
            continue;
        if (Object.keys(exemptDirs).some((dir) => where.startsWith(`${dir.replace(/\/+$/, "")}/`))) {
            continue;
        }
        // Line by line, so one allowed site does not exempt its neighbours.
        const lines = readFileSync(file, "utf8").split("\n");
        lines.forEach((line, i) => {
            const marker = markerFor(lines, i);
            if (marker) {
                // Without the comment's own closer: `*/` would count toward the length.
                const reason = marker[1].replace(/\*\/\}?\s*$/, "").trim();
                if (reason.length < MIN_ALLOW_REASON) {
                    violations.push({
                        rule: "thin-allow-reason",
                        file: where,
                        line: i + 1,
                        match: reason,
                        instead: `a \`ratchet-allow:\` reason of ${MIN_ALLOW_REASON}+ characters that argues the case`,
                    });
                }
                return;
            }
            for (const rule of fileRules) {
                for (const match of line.match(rule.pattern) ?? []) {
                    violations.push({
                        rule: rule.id,
                        file: where,
                        line: i + 1,
                        match,
                        instead: rule.instead,
                    });
                }
            }
        });
    }
    const exemptions = [
        ...Object.entries(exemptFiles).map(([p, r]) => [p, r, "file"]),
        ...Object.entries(exemptDirs).map(([p, r]) => [p, r, "dir"]),
    ];
    for (const [where, reason, kind] of exemptions) {
        const full = path.resolve(cwd, where);
        const finding = (rule, instead, match = where) => violations.push({ rule, file: where, match, instead });
        if (reason.trim().length < MIN_EXEMPTION_REASON) {
            finding("thin-exemption-reason", "an argument: the file defines the scale, or its colours are not Atlas's to choose", reason);
        }
        const exists = existsSync(full) &&
            (kind === "file" ? statSync(full).isFile() : statSync(full).isDirectory());
        if (!exists) {
            finding("missing-exemption", "delete the entry, or fix the path");
            continue;
        }
        // An exempt file outside every rule's reach is held to all of them, so an
        // exemption is idle only when nothing would have matched.
        const rulesOf = (file) => rulesByFile.get(file) ?? rules;
        const earning = kind === "file"
            ? violates(full, rulesOf(full))
            : walk(full, include).some((file) => violates(file, rulesOf(file)));
        if (!earning) {
            finding("idle-exemption", "delete the entry and let the file be scanned");
        }
    }
    return violations;
}
/** The violations as a failure message: one line each, then what to write. */
export function formatViolations(violations) {
    if (violations.length === 0)
        return "No design-system violations.";
    const lines = violations.map((v) => `  ${v.file}${v.line ? `:${v.line}` : ""}  ${v.rule}  ${JSON.stringify(v.match)}`);
    const advice = [...new Map(violations.map((v) => [v.rule, v.instead])).entries()].map(([rule, instead]) => `  ${rule}: ${instead}`);
    return [
        `${violations.length} design-system violation(s):`,
        ...lines,
        "",
        "Use instead:",
        ...advice,
        "",
        "If a value truly cannot come from the scale, put `ratchet-allow: <why>` in a",
        "comment on the line or the block above it, and make the reason an argument.",
    ].join("\n");
}
/**
 * A consumer's whole ratchet test, as config. Registers one `describe` with a
 * test that the roots hold no violation and, given `minFiles`, one that they
 * hold enough files to mean something. Failures throw with
 * `formatViolations`'s message (plus `footer`), so the suite needs no
 * `expect` and the package no test runner:
 *
 *   import { defineRatchetSuite, strictRules } from "@tryatlas/design/ratchet";
 *   import { describe, it } from "vitest";
 *
 *   defineRatchetSuite(
 *     { root, roots: ["src/components", "src/routes"], rules: strictRules, minFiles: 200,
 *       exemptFiles: { "src/lib/seo.ts": "<meta name=theme-color> needs a literal…" } },
 *     { describe, it },
 *   );
 */
export function defineRatchetSuite(config, { describe, it }) {
    const { root, minFiles, footer, ...options } = config;
    describe("design-system ratchet", () => {
        it(`has no violation in ${options.roots.join(" + ")}`, () => {
            const violations = runRatchet({ ...options, cwd: root });
            if (violations.length > 0) {
                throw new Error([formatViolations(violations), footer].filter(Boolean).join("\n\n"));
            }
        });
        if (minFiles !== undefined) {
            it(`scans at least ${minFiles} files`, () => {
                const include = options.include ?? /\.(ts|tsx|css)$/;
                const count = options.roots.reduce((n, where) => n + filesUnder(path.join(root, where), include).length, 0);
                if (count < minFiles) {
                    throw new Error(`The ratchet scanned ${count} files under ${options.roots.join(", ")}, fewer than ` +
                        `${minFiles}. A root that moved scans nothing and passes; fix the roots.`);
                }
            });
        }
    });
}
//# sourceMappingURL=index.js.map
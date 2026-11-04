import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ATLAS_PREFIX_RULE, RULES } from "./rules.js";
export { ATLAS_PREFIX_RULE, RULES } from "./rules.js";
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
    const rules = options.banAtlasPrefix
        ? [...RULES, ATLAS_PREFIX_RULE]
        : RULES;
    const violations = [];
    const relative = (file) => path.relative(cwd, file).split(path.sep).join("/");
    const violates = (file) => {
        const text = readFileSync(file, "utf8");
        return rules.some((rule) => text.match(rule.pattern) !== null);
    };
    const files = options.roots.flatMap((root) => walk(path.join(cwd, root), include));
    for (const file of files) {
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
            for (const rule of rules) {
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
        const full = path.join(cwd, where);
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
        const earning = kind === "file" ? violates(full) : walk(full, include).some(violates);
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
//# sourceMappingURL=index.js.map
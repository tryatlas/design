/**
 * D23: the role names are the theme keys' names. Every colour variable the
 * package writes is a theme key's dotted name with `.` and `_` as `-`
 * (`border.subtle` → `--border-subtle`), and the Tailwind utilities are
 * bridged from those (`utilities.css`). What that renamed, as a map from the
 * old name to the new, for a consumer's guard test or a one-off codemod:
 *
 *   import { D23_RENAMES } from "@tryatlas/design";
 *   for (const [old, { variable, utility }] of Object.entries(D23_RENAMES)) …
 *
 * Two sources, both recorded in this repo:
 *
 * - **The roles the old `standards` stylesheets named differently** (the web
 *   app's copy of them; README, "Migrating from standards"). Listed by hand
 *   below; `tests/d23-renames.test.ts` holds each new name to a variable the
 *   package declares and each old one to a name it does not.
 * - **ADR-0027's prefix drop**: desktop's `--atlas-<key>` is `--<key>`.
 *   Generated from the key registry, so a key added to `keys.toml` is here
 *   without an edit.
 *
 * Keys and values are names without the leading `--`. A variable and its
 * utility did not always move together, so each entry carries both:
 *
 * - `variable`: the custom property that replaces `--<old>`.
 * - `utility`: the colour name that replaces `<prefix>-<old>` (`bg-`, `text-`,
 *   `border-`…). Equal to the old name when the package still bridges that
 *   utility (`text-success` works; only `--success` moved). `null` when there
 *   is no utility for the role: write `var(--<variable>)` in CSS, or use the
 *   component that draws it.
 */
export interface D23Rename {
    variable: string;
    utility: string | null;
}
export declare const D23_RENAMES: Readonly<Record<string, D23Rename>>;
//# sourceMappingURL=d23-renames.d.ts.map
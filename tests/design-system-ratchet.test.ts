import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  SURFACE_CARD_RULE,
  TRANSITION_ALL_RULE,
  defineRatchetSuite,
  runRatchet,
  strictRules,
} from "../src/ratchet/index.ts";

/**
 * The package holds its own source to the ratchet it exports, with the
 * `--atlas-` ban on: the package is the first place the unprefixed names are
 * authoritative. `src/styles` is the scale itself and is not scanned, as on
 * desktop; `src/ratchet` spells out the patterns it bans.
 */

const ROOT = path.join(import.meta.dirname, "..");

const EXEMPT_FILES: Record<string, string> = {
  "src/theme/theme-key-registry.ts":
    "Shape 1. The table of Atlas's per-appearance default for every theme key, " +
    "so every entry is a colour literal by construction.",
  "src/theme/color.ts":
    "Shape 1. The colour parser and mixer the resolver is built on. Its literals " +
    "are the identity values of the operations themselves.",
  "src/theme/resolve-theme.test.ts":
    "Shape 1. Fixture themes. A test for the resolver has to hand it colours.",
  "src/components/ui/brand-marks.tsx":
    "Shape 2. Third-party trademarks whose colours are fixed by their brand " +
    "guidelines; a recoloured logo is the wrong logo.",
  // Provider trademarks copied from Lobe Icons; the same argument as brand-marks.tsx.
  "src/components/ui/provider-marks.tsx":
    "Shape 2. Third-party trademarks whose colours are fixed by their brand " +
    "guidelines; a recoloured logo is the wrong logo.",
};

// The package's own suite, through the same helper a consumer calls.
defineRatchetSuite(
  {
    root: ROOT,
    roots: ["src/ui", "src/components", "src/lib", "src/theme", "stories", ".storybook"],
    exemptFiles: EXEMPT_FILES,
    banAtlasPrefix: true,
    rules: [SURFACE_CARD_RULE],
    minFiles: 150,
  },
  { describe, it },
);

describe("runRatchet", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const put = (file: string, text: string) => {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), text);
  };
  const rulesOf = (options: Parameters<typeof runRatchet>[0]) =>
    runRatchet({ cwd: dir, ...options }).map((v) => `${v.file}:${v.line ?? "-"} ${v.rule}`);

  put("src/a.tsx", 'const a = "text-[11px] z-50 bg-white"\nconst b = "var(--atlas-border)"\n');
  put(
    "src/b.tsx",
    [
      "// ratchet-allow: a third party's colour, fixed by their brand guidelines",
      'const ok = "#ff0000"',
      'const thin = "#00ff00" // ratchet-allow: because',
      'const closed = "#0000ff" /* ratchet-allow: short but closed */',
    ].join("\n"),
  );
  put("src/clean.tsx", 'const c = "text-sm z-popover"\n');
  put("src/sub/x.tsx", 'const x = "z-[999]"\n');

  it("reports each violation with its line", () => {
    expect(rulesOf({ roots: ["src"], exemptFiles: {} })).toEqual([
      "src/a.tsx:1 arbitrary-text-size",
      "src/a.tsx:1 white-black-utility",
      "src/a.tsx:1 bare-z-index",
      "src/b.tsx:3 thin-allow-reason",
      "src/b.tsx:4 thin-allow-reason",
      "src/sub/x.tsx:1 arbitrary-z-index",
    ]);
  });

  it("bans --atlas- names only when asked", () => {
    expect(rulesOf({ roots: ["src"], banAtlasPrefix: true })).toContain(
      "src/a.tsx:2 atlas-prefixed-variable",
    );
  });

  it("checks the exemptions themselves", () => {
    expect(
      rulesOf({
        roots: ["src"],
        exemptFiles: {
          "src/a.tsx": "too short",
          "src/clean.tsx": "An exemption for a file with nothing in it to exempt.",
          "src/gone.tsx": "An exemption for a file that has since been deleted.",
        },
        // A trailing slash still names the directory.
        exemptDirs: {
          "src/sub/": "A directory whose one file exists to be exempted here.",
        },
      }).filter((line) => !line.startsWith("src/b.tsx")),
    ).toEqual([
      "src/a.tsx:- thin-exemption-reason",
      "src/clean.tsx:- idle-exemption",
      "src/gone.tsx:- missing-exemption",
    ]);
  });
});

describe("runRatchet's rules", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-rules-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const put = (file: string, text: string) => {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), text);
  };
  const rulesOf = (options: Parameters<typeof runRatchet>[0]) =>
    runRatchet({ cwd: dir, ...options }).map((v) => `${v.file}:${v.line ?? "-"} ${v.rule}`);

  put("src/motion.tsx", 'const m = "transition-all"\nconst s = { transition: "all 200ms" }\n');
  put("src/todo.tsx", "// TODO: something\n");
  put("styles/app.css", ".x { transition: all 200ms; }\n");
  put("index.html", '<div class="transition-all"></div>\n');

  it("ban transition-all by default, the class and the CSS spelling", () => {
    expect(rulesOf({ roots: ["src"] })).toEqual([
      "src/motion.tsx:1 transition-all",
      "src/motion.tsx:2 transition-all",
    ]);
  });

  it("take a consumer's extra rule, under roots unless it has a scope", () => {
    const todo = { id: "no-todo", instead: "file an issue", pattern: /\bTODO\b/g };
    expect(rulesOf({ roots: ["src"], rules: [todo] })).toContain("src/todo.tsx:1 no-todo");
    expect(rulesOf({ roots: ["src"], rules: [{ ...todo, scope: ["styles"] }] })).not.toContain(
      "src/todo.tsx:1 no-todo",
    );
  });

  it("let a rule with a built-in's id replace it, widening its scope to files outside roots", () => {
    expect(
      rulesOf({
        roots: ["src"],
        rules: [{ ...TRANSITION_ALL_RULE, scope: ["src", "styles", "index.html"] }],
      }),
    ).toEqual([
      "src/motion.tsx:1 transition-all",
      "src/motion.tsx:2 transition-all",
      "styles/app.css:1 transition-all",
      // Named directly, so read even though `include` is .ts/.tsx/.css.
      "index.html:1 transition-all",
    ]);
  });

  it("still count an exemption outside roots as earning its keep", () => {
    expect(
      rulesOf({
        roots: ["src/nothing-here"],
        exemptFiles: {
          "src/motion.tsx": "Exempt from outside the scanned roots, on purpose here.",
        },
      }),
    ).toEqual([]);
  });

  it("refuse a pattern without /g", () => {
    expect(() =>
      runRatchet({ cwd: dir, roots: ["src"], rules: [{ id: "x", instead: "y", pattern: /x/ }] }),
    ).toThrow(/must be \/g/);
  });
});

describe("the colour-literal rule", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-colour-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const lines = [
    // Banned: the modern colour functions, as a value and as a class.
    'const a = "oklch(0.7 0.12 250)"',
    'const b = "bg-[oklab(0.5_0.1_0.1)]"',
    'const c = "lab(50% 40 59)"',
    'const d = "lch(50% 40 59)"',
    'const e = "hwb(194 0% 0%)"',
    // Banned: a color-mix() with a named colour, before or after its percentage.
    'const f = "color-mix(in srgb, white 10%, var(--background))"',
    'const g = "bg-[color-mix(in_srgb,40%_red,var(--background))]"',
    // Allowed: a mix of tokens and colourless keywords, in any space.
    'const h = "bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))]"',
    'const i = "color-mix(in oklab, currentColor 45%, transparent)"',
    'const j = "color-mix(in srgb-linear, var(--a) calc(10% + 5%), var(--b))"',
    'const k = "color-mix(in oklch longer hue, var(--a), var(--b))"',
    // Allowed: a colour interpolated from code is the code's to check.
    "const o = `color-mix(in oklab, ${tone} 30%, ${theme.ink})`",
    // Allowed: a function named in prose, with no colour in it.
    "// understands oklch() and color-mix(), unlike a regex",
    // Allowed: a word that merely ends in a function's name.
    'const l = "collab(x)"',
    // Still banned, as before: a hex, rgb() and hsl().
    'const m = "#fff rgb(0 0 0) hsl(0 0% 0%)"',
    // An allowed site, as for every rule.
    'const n = "oklch(0.6 0.2 30)" // ratchet-allow: a third party\'s brand colour, fixed',
  ];
  writeFileSync(path.join(dir, "a.tsx"), lines.join("\n"));
  const lineOf = (prefix: string) => lines.findIndex((l) => l.startsWith(prefix)) + 1;

  it("bans oklch, oklab, lab, lch and hwb, and a color-mix() of a named colour", () => {
    const found = runRatchet({ cwd: dir, roots: ["."] }).map((v) => `${v.line} ${v.rule}`);
    expect(found).toEqual(
      ["a", "b", "c", "d", "e", "f", "g", "m", "m", "m"].map(
        (name) => `${lineOf(`const ${name} =`)} colour-literal`,
      ),
    );
  });
});

describe("strictRules", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-strict-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(
    path.join(dir, "a.tsx"),
    [
      'const inherit = "rounded-[inherit]"',
      'const radius = "rounded-[3px]"',
      'const raised = "shadow-sm shadow-md shadow-lg drop-shadow-sm text-shadow-sm"',
      'const arbitrary = "border-[var(--border-subtle)]"',
      'const dark = "dark:bg-card"',
    ].join("\n"),
  );
  const rulesOf = (rules?: Parameters<typeof runRatchet>[0]["rules"]) =>
    runRatchet({ cwd: dir, roots: ["."], rules }).map((v) => `${v.line} ${v.rule} ${v.match}`);

  it("allow rounded-[inherit], and ban raised shadows, [var(--…)] and dark:", () => {
    expect(rulesOf(strictRules)).toEqual([
      "2 arbitrary-radius rounded-[3px]",
      "3 raised-shadow shadow-sm",
      "4 arbitrary-var [var(--",
      "5 dark-variant dark:b",
    ]);
  });

  it("are not on by default", () => {
    expect(rulesOf()).toEqual([
      "1 arbitrary-radius rounded-[inherit]",
      "2 arbitrary-radius rounded-[3px]",
    ]);
  });
});

describe("SURFACE_CARD_RULE", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-card-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(
    path.join(dir, "a.tsx"),
    [
      'const ok = "surface-card"',
      'const ring = "rounded-xl bg-card ring-1 ring-element-selected"',
      'const glass = "rounded-xl bg-card/95 backdrop-blur-glass"',
    ].join("\n"),
  );

  it("bans a ring edge and the dialog radius on a card fill, and lets glass through", () => {
    expect(
      runRatchet({ cwd: dir, roots: ["."], rules: [SURFACE_CARD_RULE] })
        .filter((v) => v.rule === "surface-card")
        .map((v) => `${v.line} ${v.match}`),
    ).toEqual(["2 rounded-xl bg-card", "2 ring-element-selected"]);
  });
});

describe("defineRatchetSuite", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ratchet-suite-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(path.join(dir, "src"));
  writeFileSync(path.join(dir, "src/a.tsx"), 'const a = "text-[11px]"\n');

  /** Runs the suite it registers, collecting each test's name and error. */
  const run = (config: Parameters<typeof defineRatchetSuite>[0]) => {
    const results: Array<[string, string | null]> = [];
    defineRatchetSuite(config, {
      describe: (_name, fn) => fn(),
      it: (name, fn) => {
        try {
          fn();
          results.push([name, null]);
        } catch (error) {
          results.push([name, (error as Error).message]);
        }
      },
    });
    return results;
  };

  it("fails with the violations and the footer", () => {
    const [[name, error]] = run({
      root: dir,
      roots: ["src"],
      footer: "Roles come from the package.",
    });
    expect(name).toBe("has no violation in src");
    expect(error).toContain("src/a.tsx:1  arbitrary-text-size");
    expect(error).toMatch(/Roles come from the package\.$/);
  });

  it("passes when the roots are clean, and checks the file count when asked", () => {
    const results = run({
      root: dir,
      roots: ["src"],
      exemptFiles: { "src/a.tsx": "A fixture file that exists to hold one violation." },
      minFiles: 2,
    });
    expect(results.map(([name, error]) => [name, error === null])).toEqual([
      ["has no violation in src", true],
      ["scans at least 2 files", false],
    ]);
    expect(results[1]![1]).toContain("scanned 1 files under src");
  });
});

/**
 * A class only the package's own files use, so a consumer can assert that
 * its Tailwind build saw them.
 *
 * Tailwind generates a class only if it finds it in a scanned file. The
 * package's classes live in `node_modules/@tryatlas/design/dist`, which a
 * consumer scans only because `styles.css` says `@source "../../dist"`. Lose
 * that line, or the `@import "@tryatlas/design/styles.css"`, and every
 * package class is purged: nothing errors, the build is green, and every
 * primitive renders unstyled.
 *
 * This is an arbitrary property, so the rule it generates is unmistakable:
 * `--tryatlas-design-sentinel: 1`. It appears here and nowhere else, which
 * is the point: a consumer test imports the constant (never writes it out,
 * or its own source would generate the rule) and checks the compiled CSS
 * for that declaration.
 *
 *   expect(css).toMatch(/--tryatlas-design-sentinel:\s*1/);
 */
export declare const PACKAGE_SENTINEL_CLASS = "[--tryatlas-design-sentinel:1]";
//# sourceMappingURL=sentinel.d.ts.map
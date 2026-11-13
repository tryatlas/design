/** What a command did, in the vocabulary the marker rows render. */
export type ParsedShell = {
    kind: "read";
    path: string;
} | {
    kind: "list";
    path: string | null;
} | {
    kind: "search";
    query: string | null;
    path: string | null;
} | {
    kind: "run";
};
/**
 * Classify a whole shell command.
 *
 * Reduction rule, and the reason it is this strict: after the plumbing and the
 * scaffolding are dropped, the command must come down to exactly ONE thing it
 * did. `sed -n '1,120p' file` is a read; `pwd && rg --files -g '*.ts'` did two
 * things and gets the terminal glyph, which is what the engine's own TUI shows
 * for it. Summarising several actions as one would need a verb that promises
 * more than a single glyph can keep.
 */
export declare function parseShellCommand(command: string): ParsedShell;
/**
 * The program a command runs, for the live line ("Running sed"): the first
 * segment that is not scaffolding (`cd x &&`) or output shaping (`| head`),
 * past any `FOO=bar` assignments and launchers, as a basename. `null` when
 * the command does not tokenize.
 */
export declare function commandProgramName(command: string): string | null;
//# sourceMappingURL=parse-shell-command.d.ts.map
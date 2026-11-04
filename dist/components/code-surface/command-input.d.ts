import * as React from "react";
import { type CommandSuggestionsProps } from "./command-suggestions.tsx";
export interface TerminalCommandInputProps {
    value: string;
    onValueChange: (value: string) => void;
    /** History, Tab completion and Ctrl-C live here, in the app. */
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onPaste?: React.ClipboardEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    /** A command is running: the field answers its prompts instead of composing a command. */
    busy?: boolean;
    /** The running program reads keys one by one (a TUI): every key goes straight to it. */
    rawMode?: boolean;
    placeholder?: string;
    /** At the row's end: a `TerminalStopControl`. */
    stopControl?: React.ReactNode;
    /** Before the stop control: a `TerminalStatus`. */
    status?: React.ReactNode;
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    /** The completion list above the field, which the field's `aria-activedescendant` follows. */
    suggestions?: Omit<CommandSuggestionsProps, "anchor">;
    className?: string;
}
/**
 * The terminal's command line, under its blocks (desktop's block-terminal
 * footer and `command-input.tsx`): a prompt glyph, or a spinner while a
 * command runs, the field, and the row's status and stop control. The field
 * is controlled; every key is the app's to handle.
 *
 * The row is a container, so the status gives way to the field in a narrow
 * pane rather than a narrow window.
 */
export declare function TerminalCommandInput({ value, onValueChange, onKeyDown, onPaste, onBlur, busy, rawMode, placeholder, stopControl, status, textareaRef, suggestions, className, }: TerminalCommandInputProps): React.JSX.Element;
export interface TerminalStatusProps {
    cwd: string;
    /** `""` is a detached HEAD; unset, not a repository. */
    branch?: string;
    ahead?: number;
    behind?: number;
    /** Uncommitted changes. */
    dirty?: boolean;
}
/**
 * Where the terminal is: the folder, and the branch with its distance from
 * upstream. Hidden in a pane under 300px wide, the branch under 420px.
 */
export declare function TerminalStatus({ cwd, branch, ahead, behind, dirty }: TerminalStatusProps): React.JSX.Element;
//# sourceMappingURL=command-input.d.ts.map
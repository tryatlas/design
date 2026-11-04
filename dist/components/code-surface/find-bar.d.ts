import * as React from "react";
export type FindFlag = "caseSensitive" | "wholeWord" | "regexp";
export interface FindBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    /** The current match, 0-based. `null` or unset: none chosen, so the count reads "12 results". */
    matchIndex?: number | null;
    /** Unset while the count is unknown (a search still running): no count shows. */
    matchCount?: number;
    /** The query does not parse (a bad regular expression). */
    invalid?: boolean;
    caseSensitive?: boolean;
    wholeWord?: boolean;
    regexp?: boolean;
    /** Shows the three option toggles. Without it the bar is find-only, as the terminal's is. */
    onToggle?: (flag: FindFlag, value: boolean) => void;
    /** The replacement text. The replace row exists only with `onReplaceChange`. */
    replace?: string;
    onReplaceChange?: (replace: string) => void;
    replaceOpen?: boolean;
    onReplaceOpenChange?: (open: boolean) => void;
    onReplace?: () => void;
    onReplaceAll?: () => void;
    onNext: () => void;
    onPrevious: () => void;
    /** Escape anywhere in the bar, or the close button. */
    onClose: () => void;
    /** Selects every match at once (Alt+Enter in the query). */
    onSelectAll?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    /** The query input, for an app that puts the keyboard back in it (⌘F while open). */
    inputRef?: React.Ref<HTMLInputElement>;
    className?: string;
}
/**
 * Find (and replace) over a file or a terminal's output: desktop's
 * `FileFindBar` in its looks, with the editor's options and replace added.
 * It is controlled and searches nothing itself; the app runs the search and
 * passes the count back.
 *
 * Keys: Enter is the next match and Shift+Enter the previous; Alt+Enter
 * selects every match (with `onSelectAll`); in the replace field Enter
 * replaces and ⌘⌥Enter (Ctrl+Alt+Enter) replaces all; Escape anywhere closes.
 *
 * It opens from a key, so it does not animate in.
 */
export declare function FindBar({ query, onQueryChange, matchIndex, matchCount, invalid, caseSensitive, wholeWord, regexp, onToggle, replace, onReplaceChange, replaceOpen, onReplaceOpenChange, onReplace, onReplaceAll, onNext, onPrevious, onClose, onSelectAll, placeholder, autoFocus, inputRef, className, }: FindBarProps): React.JSX.Element;
//# sourceMappingURL=find-bar.d.ts.map
import type * as React from "react";
export interface EditorStatusBarProps {
    /** 1-based, like the editor shows it. */
    line: number;
    column: number;
    /** Characters selected; shown when above zero. */
    selected?: number;
    language?: string;
    encoding?: string;
    /** "LF" / "CRLF". */
    eol?: string;
    /** "Spaces: 2", "Tab Size: 4". */
    indent?: string;
    /** Anything before the items, on the left. */
    start?: React.ReactNode;
    onPositionClick?: () => void;
    onLanguageClick?: () => void;
    className?: string;
}
/**
 * The line under an editor: the cursor's position, then the file's indent,
 * encoding, line endings and language. An item left undefined is left out.
 * Deliberately not a live region: the position changes with every keystroke,
 * and announcing it would talk over the typing.
 */
export declare function EditorStatusBar({ line, column, selected, language, encoding, eol, indent, start, onPositionClick, onLanguageClick, className, }: EditorStatusBarProps): React.JSX.Element;
//# sourceMappingURL=editor-status-bar.d.ts.map
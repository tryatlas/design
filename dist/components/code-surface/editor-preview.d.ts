import { type SyntaxRole } from "./code-surface.ts";
export interface EditorPreviewToken {
    text: string;
    role?: SyntaxRole;
    /** Inside the selection. */
    selected?: boolean;
    /** A find match; `active` is the current one. */
    match?: "match" | "active";
    /** The bracket matching the one at the cursor. */
    bracket?: boolean;
    /** The caret sits at the end of this token. */
    caret?: boolean;
}
export interface EditorPreviewLine {
    tokens: readonly EditorPreviewToken[];
    /** The gutter's change bar against git HEAD. */
    change?: "added" | "modified" | "deleted-above";
    /** A foldable range starts here. */
    fold?: "open" | "closed";
}
export interface EditorPreviewProps {
    lines: readonly EditorPreviewLine[];
    /** The number shown on the first line. */
    startLine?: number;
    /** The line the cursor is on, by its shown number. */
    activeLine?: number;
    className?: string;
}
/**
 * A static, highlighted excerpt drawn exactly as desktop's CodeMirror theme
 * (`build-cm-theme.ts`) draws a file: the change-bar gutter, line numbers,
 * the fold gutter, the active line, selection, find matches, the matching
 * bracket and the caret. It is the reference look the editor's theme is held
 * to, and a way to show code with the editor's colours where no editor runs.
 *
 * It takes tokens, not source: the package highlights nothing.
 */
export declare function EditorPreview({ lines, startLine, activeLine, className }: EditorPreviewProps): import("react").JSX.Element;
//# sourceMappingURL=editor-preview.d.ts.map
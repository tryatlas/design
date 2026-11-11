import type * as React from "react";
export interface EditorFrameProps {
    /** The header's left side: usually `EditorBreadcrumbs`. */
    breadcrumbs?: React.ReactNode;
    /** The header's right side: the file's actions ("Disk changed · Reload", a preview toggle). */
    actions?: React.ReactNode;
    /** A one-line note under the header, in the warning tone: a limit the view is showing. */
    notice?: React.ReactNode;
    /** Floats over the body's top-right corner: a `FindBar`. */
    findBar?: React.ReactNode;
    /** Below the body: an `EditorStatusBar`. */
    statusBar?: React.ReactNode;
    /** The editor itself (CodeMirror in desktop) or an `EditorPreview`. */
    children?: React.ReactNode;
    className?: string;
}
/**
 * A file view's chrome: desktop's file tab (`editor-panel.tsx`), a header
 * band with the path and the file's actions, then the editor. It holds no
 * state and renders no editor; the slots are filled by the app.
 */
export declare function EditorFrame({ breadcrumbs, actions, notice, findBar, statusBar, children, className, }: EditorFrameProps): React.JSX.Element;
//# sourceMappingURL=editor-frame.d.ts.map
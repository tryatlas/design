import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/**
 * A file view's chrome: desktop's file tab (`editor-panel.tsx`), a header
 * band with the path and the file's actions, then the editor. It holds no
 * state and renders no editor; the slots are filled by the app.
 */
export function EditorFrame({ breadcrumbs, actions, notice, findBar, statusBar, children, className, }) {
    return (_jsxs("section", { "data-slot": "editor-frame", className: cn("flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground", className), children: [_jsxs("div", { "data-slot": "editor-frame-header", className: "flex h-control-lg shrink-0 items-center gap-2 overflow-hidden border-b border-border bg-background px-3", children: [_jsx("div", { className: "flex min-w-0 flex-1 items-center", children: breadcrumbs }), actions != null && (_jsx("div", { className: "ml-auto flex shrink-0 items-center gap-1 pl-2", children: actions }))] }), notice != null && (_jsx("div", { role: "status", className: "shrink-0 border-b border-border bg-warning-muted px-3 py-1.5 text-2xs text-warning", children: notice })), _jsxs("div", { "data-slot": "editor-frame-body", className: "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-editor-background text-editor-foreground", children: [children, findBar != null && (_jsx("div", { className: "pointer-events-none absolute inset-x-3 top-2 z-panel flex justify-end *:pointer-events-auto", children: findBar }))] }), statusBar] }));
}
//# sourceMappingURL=editor-frame.js.map
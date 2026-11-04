import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/** Multi-line text. Same border and focus language as <Input>. */
function Textarea({ className, ...props }) {
    return (_jsx("textarea", { "data-slot": "textarea", className: cn("w-full min-w-0 rounded border border-border bg-panel-input px-2 py-1.5 text-xs text-foreground", "field-sizing-content min-h-16", "transition-colors duration-fast ease-out-strong", "placeholder:text-muted-foreground", "focus:border-border-strong", "disabled:cursor-not-allowed disabled:opacity-50", "aria-invalid:border-destructive", className), ...props }));
}
export { Textarea };
//# sourceMappingURL=textarea.js.map
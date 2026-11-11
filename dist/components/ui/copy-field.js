"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils.js";
import { CopyGlyph } from "../../ui/animated-icon.js";
import { IconButton } from "../../ui/icon-button.js";
/** How long the button shows that it copied. */
const COPIED_MS = 1200;
/**
 * A value to hand on (an invite link, a token, a slug) with a copy button at
 * its end. The value is monospace and truncates on one line; the button's
 * glyph draws a check once the value is on the clipboard (`CopyGlyph`), and
 * only then: a refusal leaves it as it was.
 *
 * `onCopy` puts the text on the clipboard and resolves `true` when it did,
 * for an app that copies through its own bridge. Without it the field uses
 * the browser's clipboard.
 */
function CopyField({ value, onCopy, label = "Copy", copiedLabel = "Copied", className, ...props }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = async () => {
        let ok = false;
        try {
            ok = onCopy
                ? (await onCopy(value)) === true
                : await navigator.clipboard.writeText(value).then(() => true);
        }
        catch {
            ok = false;
        }
        if (!ok)
            return;
        clearTimeout(timer.current);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    };
    return (_jsxs("div", { "data-slot": "copy-field", className: cn("flex min-w-0 items-center gap-1 rounded-md bg-muted py-1 pr-1 pl-2", className), ...props, children: [_jsx("code", { className: "min-w-0 flex-1 truncate code text-secondary-foreground", children: value }), _jsx(IconButton, { size: "sm", icon: _jsx(CopyGlyph, { copied: copied, size: "sm" }), label: copied ? copiedLabel : label, onClick: () => void copy() }), _jsx("span", { role: "status", className: "sr-only", children: copied ? copiedLabel : "" })] }));
}
export { CopyField };
//# sourceMappingURL=copy-field.js.map
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import { useCallback, useId, useRef } from "react";
import { Spinner } from "../components/ui/spinner.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Icon } from "./icon.js";
function SplitButton({ ref, label, children, icon, onClick, disabledReason = null, busy = false, busyLabel, menuLabel, menu, variant = "default", size = "sm", menuClassName, className, ...props }) {
    const groupRef = useRef(null);
    const reasonId = useId();
    // Stable, so the caller's ref is not detached and reattached on every render.
    const setRef = useCallback((el) => {
        groupRef.current = el;
        if (typeof ref === "function")
            ref(el);
        else if (ref)
            ref.current = el;
    }, [ref]);
    return (_jsxs("div", { ref: setRef, role: "group", "aria-label": label, "data-slot": "split-button", "data-busy": busy || undefined, className: cn("flex items-center gap-0.5", className), ...props, children: [_jsxs(Button, { "data-slot": "split-button-primary", variant: variant, size: size, onClick: onClick, disabled: busy || disabledReason !== null, 
                // Off but still focusable (`aria-disabled`): with a reason, so a
                // keyboard reaches it and a screen reader reads why; while busy, so
                // the button just pressed keeps focus instead of dropping it to body.
                focusableWhenDisabled: busy || disabledReason !== null, title: disabledReason ?? undefined, "aria-describedby": disabledReason !== null ? reasonId : undefined, "aria-busy": busy || undefined, children: [busy ? _jsx(Spinner, { size: "sm", label: "" }) : icon && _jsx(Icon, { icon: icon, size: "sm" }), busy ? (busyLabel ?? children) : children] }), disabledReason !== null && (_jsx("span", { id: reasonId, className: "sr-only", children: disabledReason })), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { render: _jsx(Button, { "data-slot": "split-button-menu", variant: "outline", size: size, "aria-label": menuLabel, disabled: busy, focusableWhenDisabled: busy, children: _jsx(Icon, { icon: ChevronDown, size: "sm" }) }) }), _jsx(DropdownMenuContent, { anchor: groupRef, align: "end", className: cn("min-w-56", menuClassName), children: menu })] })] }));
}
export { SplitButton };
//# sourceMappingURL=split-button.js.map
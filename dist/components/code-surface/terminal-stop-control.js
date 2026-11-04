"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { OctagonXIcon, SquareIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { iconButtonVariants } from "../../ui/icon-button-variants.js";
import { Icon } from "../../ui/icon.js";
import { Hint } from "../../ui/tooltip.js";
import { Spinner } from "../ui/spinner.js";
/** How long an interrupt gets before the control offers a force stop. */
const FORCE_STOP_DELAY_MS = 1500;
const LABEL = {
    ready: "Stop process",
    waiting: "Waiting for process to stop",
    force: "Force stop process",
    killing: "Force stopping process",
};
/**
 * Stops the running process: an interrupt first, and if the process is still
 * there after 1.5s, a force stop in the error tone. Desktop's
 * `terminal-stop-control.tsx`.
 */
export function TerminalStopControl({ active, onInterrupt, onForceStop, onForceStopped, className, }) {
    const [phase, setPhase] = React.useState("ready");
    React.useEffect(() => {
        if (!active) {
            setPhase("ready");
            return;
        }
        if (phase !== "waiting")
            return;
        const timer = setTimeout(() => setPhase("force"), FORCE_STOP_DELAY_MS);
        return () => clearTimeout(timer);
    }, [active, phase]);
    if (!active)
        return null;
    const force = phase === "force";
    const pending = phase === "waiting" || phase === "killing";
    const label = LABEL[phase];
    const shortcut = phase === "ready" ? "Ctrl+C" : undefined;
    const stop = async () => {
        if (!force) {
            setPhase("waiting");
            onInterrupt();
            return;
        }
        setPhase("killing");
        try {
            if (await onForceStop())
                onForceStopped();
            else
                setPhase("ready");
        }
        catch {
            setPhase("ready");
        }
    };
    return (_jsx(Hint, { label: label, shortcut: shortcut, side: "top", children: _jsx("button", { type: "button", "data-slot": "terminal-stop-control", onClick: () => void stop(), disabled: pending, "aria-label": shortcut ? `${label} (${shortcut})` : label, className: cn(iconButtonVariants({ size: "xs" }), force && "text-error hover:bg-error-muted hover:text-error", pending ? "cursor-wait" : "cursor-pointer", className), children: pending ? (_jsx(Spinner, { size: "xs", label: "" })) : force ? (_jsx(Icon, { icon: OctagonXIcon, size: "sm" })) : (_jsx(Icon, { icon: SquareIcon, size: "xs", strokeWidth: 3, fill: "currentColor" })) }) }));
}
//# sourceMappingURL=terminal-stop-control.js.map
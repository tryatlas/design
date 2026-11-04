import * as React from "react";
export interface TerminalStopControlProps {
    /** A process is running. Nothing renders otherwise; going false is what resets the control after a stop. */
    active: boolean;
    /** Ctrl-C to the process. */
    onInterrupt: () => void;
    /** Kill it; resolve `true` when it is gone. */
    onForceStop: () => Promise<boolean>;
    /** After a force stop succeeded. */
    onForceStopped: () => void;
    className?: string;
}
/**
 * Stops the running process: an interrupt first, and if the process is still
 * there after 1.5s, a force stop in the error tone. Desktop's
 * `terminal-stop-control.tsx`.
 */
export declare function TerminalStopControl({ active, onInterrupt, onForceStop, onForceStopped, className, }: TerminalStopControlProps): React.JSX.Element | null;
//# sourceMappingURL=terminal-stop-control.d.ts.map
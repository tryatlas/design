import { type ReactElement, type ReactNode } from "react";
export declare function HintGroup({ side, children, }: {
    side?: "top" | "bottom";
    children: ReactNode;
}): import("react").JSX.Element;
/**
 * One control in a `HintGroup`. Outside a group it renders the control
 * unchanged apart from its accessible name, so a shared button component can
 * use it unconditionally.
 */
export declare function HintItem({ label, reshowKey, className, children, }: {
    label: string;
    /** Show the tooltip again whenever this value changes under the pointer. A
     *  click hides it, so a label that confirms the click ("Copied") needs this
     *  to be seen: bump it once per confirmed action, e.g. a copy counter. A
     *  plain label change never reshows, so a toggle's flipped label (or the
     *  confirmation reverting) doesn't pop back up. */
    reshowKey?: number;
    className?: string;
    children: ReactElement<Record<string, unknown>>;
}): import("react").JSX.Element;
//# sourceMappingURL=hint-group.d.ts.map
import type { ProseRow } from "./model.ts";
export declare const ProseRowView: import("react").MemoExoticComponent<({ row, agentLabel, priority, canBranch, }: {
    row: ProseRow;
    /** The header's fallback when the row names no model. */
    agentLabel: string;
    /** Position in the thread: newest parses first. */
    priority: number;
    /** True only for the session's latest settled response on an agent that can
     *  fork, with no turn running. Resolved by the transcript, like `canRetry`. */
    canBranch?: boolean;
}) => import("react").JSX.Element>;
//# sourceMappingURL=prose-row.d.ts.map
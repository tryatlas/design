import type { SeparatorRow, TurnFooterRow, WorkHeaderRow } from "./model.ts";
/**
 * The head of an assistant turn: "Working for 46s" while it runs, then "Worked
 * for 7m 37s ›" with the work folded behind it. Clicking puts the earlier
 * prose, thinking and tool blocks back in the thread. Opening is instant — it
 * is a frequent, deliberate act, and the rows it reveals are ordinary rows.
 */
export declare const WorkHeaderRowView: import("react").MemoExoticComponent<({ row }: {
    row: WorkHeaderRow;
}) => import("react").JSX.Element>;
export declare const SeparatorRowView: import("react").MemoExoticComponent<({ row }: {
    row: SeparatorRow;
}) => import("react").JSX.Element>;
/**
 * The end of a turn: its changed-files card (or the quiet "N files read"
 * line), then the hover footer of the turn's last response. The footer is the
 * response's (`ResponseActions`: copy, branch, pin, time), drawn here so it
 * comes after the card, at the end of the whole response, rather than between
 * the text and the card. It reveals on hovering this row or the response row
 * just above it (`[data-footer-below]` in `transcript.css`).
 */
export declare const TurnFooterRowView: import("react").MemoExoticComponent<({ row, canBranch, }: {
    row: TurnFooterRow;
    /** True when the response this footer belongs to may branch (the
     *  transcript's `canBranchRowId`, matched against `row.responseRowId`). */
    canBranch?: boolean;
}) => import("react").JSX.Element>;
//# sourceMappingURL=turn-rows.d.ts.map
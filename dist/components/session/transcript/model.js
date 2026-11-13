/**
 * The transcript's row model: a session projected into a closed set of row
 * kinds, each carrying everything its view needs. Desktop's transcript and
 * web's session reader and remote-control view all render these.
 *
 * Nothing here knows either app's wire. Each app writes the projection from
 * its own data (desktop's `projectRows` over the session-delta messages; web's
 * adapters over `TimelineEntry` pages and the remote-control transcript), so
 * the row views are the one place a transcript's look is decided. The
 * vocabulary is closed on purpose: a new row kind is a deliberate addition to
 * what a transcript can say, not an ad-hoc branch in a render function.
 *
 * Rows are plain data compared shallowly by the views' `memo`, so a projection
 * that hands back the previous object for an unchanged row keeps its view from
 * re-rendering.
 */
// ── Row kinds ──────────────────────────────────────────────────────────────
export const RowKind = {
    User: 0,
    Prose: 1,
    Thinking: 2,
    Marker: 3,
    MarkerGroup: 4,
    Separator: 5,
    TurnFooter: 6,
    WorkHeader: 7,
    Subagent: 8,
    Interruption: 9,
    Injected: 10,
};
/** The message id behind a user row. Row ids are minted as `u:<messageId>`
 *  by the projection; anything that has to address the
 *  MESSAGE (pins, jumps) goes through this rather than slicing the prefix at
 *  the call site. */
export function userRowMessageId(rowId) {
    return rowId.startsWith("u:") ? rowId.slice(2) : rowId;
}
//# sourceMappingURL=model.js.map
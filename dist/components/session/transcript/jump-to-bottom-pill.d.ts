/**
 * "Scroll to bottom" / "N new messages", floated above the composer stack.
 *
 * Positioned against its parent's top edge (`bottom-full`), so the app puts it
 * in the box the composer stack sits in. The wrapper is `pointer-events-none`
 * so the empty width either side of the pill never swallows clicks meant for
 * the transcript.
 */
export declare const JumpToBottomPill: import("react").MemoExoticComponent<({ count, onClick, }: {
    count: number;
    onClick: () => void;
}) => import("react").JSX.Element>;
//# sourceMappingURL=jump-to-bottom-pill.d.ts.map
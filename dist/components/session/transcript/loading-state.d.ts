import { type ReactNode } from "react";
declare const PATTERNS: {
    drive: {
        delays: number[];
        dur: number;
        round: false;
    };
    dots: {
        delays: number[];
        dur: number;
        round: true;
    };
    orbit: {
        delays: (number | null)[];
        dur: number;
        round: false;
    };
};
export type LoaderVariant = keyof typeof PATTERNS;
/** How long the indicator waits before calling the wait a stall. */
export declare const STALL_AFTER_MS = 30000;
/** How long a wait has to run before the elapsed clock is worth showing.
 *
 *  Below this the number is noise: it appears, reads "0.2s", and is gone
 *  before anyone has finished looking at it. Past it the wait is long enough
 *  that "how long has this been going?" is a real question, which is the
 *  moment the clock starts earning its place. */
export declare const SHOW_ELAPSED_AFTER_MS = 3000;
/** What the indicator says while the request is still in flight.
 *
 *  Not "Thinking": this indicator is only ever on screen BEFORE the model has
 *  produced anything (a streaming assistant turn only exists once it
 *  emits a row, and the indicator is gone by then). Saying "Thinking" through a five-second wait claims the model is
 *  working when the request may not even have reached it. */
export declare const WAITING_LABEL = "Waiting for model";
export declare const LoadingState: import("react").MemoExoticComponent<({ label, variant, className, stalledContent, stallAfterMs, showElapsedAfterMs, }: {
    label?: string;
    variant?: LoaderVariant;
    className?: string;
    /** Rendered under the indicator once the wait has outlasted `stallAfterMs`
     *  — the way out of a start that is not going to finish on its own. Nothing
     *  is rendered (and no state flips) when this is not given. */
    stalledContent?: ReactNode;
    stallAfterMs?: number;
    /** How long before the elapsed clock appears. See `SHOW_ELAPSED_AFTER_MS`. */
    showElapsedAfterMs?: number;
}) => import("react").JSX.Element>;
export {};
//# sourceMappingURL=loading-state.d.ts.map
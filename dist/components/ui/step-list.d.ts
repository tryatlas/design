import type { ComponentProps, ReactNode } from "react";
/**
 * A multi-step action, in place: one row per step in the session timeline's
 * language (the status glyph, then what the step did), the failing step's
 * complaint under the list with a retry from there. Desktop's "Commit, push &
 * PR" progress (source control); anything that runs steps in order and can
 * resume from the one that broke.
 *
 * A step changes state by changing its glyph and ink; nothing moves, so the
 * list reads the same under reduced motion. Assistive tech hears one short
 * sentence per change (`role="status"`: the running step, the failure, or
 * done) rather than the whole list again.
 *
 * Renders from its props alone: the app runs the steps and owns what the
 * block is titled and what it ends on (a pull request, a link).
 */
type StepStatus = "pending" | "running" | "done" | "failed";
interface StepListStep {
    id: string;
    label: string;
    /** What the step acts on: the branch, the commit summary, the base. Monospace. */
    detail?: string | null;
    status: StepStatus;
}
interface StepListProps extends Omit<ComponentProps<"div">, "children"> {
    steps: StepListStep[];
    /** The failing step's complaint, in words; shown under the list while a step has failed. */
    error?: string | null;
    /** Resume from the failed step. Unset, no retry is offered. */
    onRetry?: () => void;
    /** The retry's label, naming where it starts ("Retry push"). */
    retryLabel?: ReactNode;
    /** What the status line says once every step is done. */
    doneMessage?: string;
}
declare function StepList({ steps, error, onRetry, retryLabel, doneMessage, className, ...props }: StepListProps): import("react").JSX.Element;
export { StepList };
export type { StepListProps, StepListStep, StepStatus };
//# sourceMappingURL=step-list.d.ts.map
/**
 * The card of this system.
 *
 * `rounded-lg border border-element-selected bg-card` — desktop's card: a
 * hairline on a lighter step of the ramp, never a shadow. A panel may carry
 * a top-right action cluster (filter, expand) of round ghost icon buttons;
 * nothing in it is filled, since the panel's content is the thing to read.
 * Panels enter with a small rise, and a page staggers them down with `delay`
 * so the eye is led rather than presented.
 */
declare function Panel({ title, subtitle, actions, onExpand, onFilter, className, bodyClassName, children, delay, }: {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    onExpand?: () => void;
    onFilter?: () => void;
    className?: string;
    bodyClassName?: string;
    children: React.ReactNode;
    delay?: number;
}): import("react").JSX.Element;
export { Panel };
//# sourceMappingURL=panel.d.ts.map
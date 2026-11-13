/**
 * The card of this system.
 *
 * `surface-card` — desktop's card: a hairline on a lighter step of the
 * ramp, never a shadow. A panel may carry a top-right action cluster
 * (filter, expand) of round ghost icon buttons; nothing in it is filled,
 * since the panel's content is the thing to read.
 *
 * Panels settle in with `animate-card-rise` (180ms, 4px up and a fade, a
 * fade alone under reduced motion), and a page staggers them down with
 * `index`, 30ms apart, so the eye is led rather than presented. CSS, not
 * `motion`: it plays while the page is busiest (the data just landed), and
 * a CSS animation stays off the main thread. The stagger stops at the sixth
 * panel; past that a wait is latency, not a lead.
 */
declare function Panel({ title, subtitle, actions, onExpand, onFilter, className, bodyClassName, children, index, }: {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    onExpand?: () => void;
    onFilter?: () => void;
    className?: string;
    bodyClassName?: string;
    children: React.ReactNode;
    /** The panel's place down the page, for the stagger. Capped at 5. */
    index?: number;
}): import("react").JSX.Element;
export { Panel };
//# sourceMappingURL=panel.d.ts.map
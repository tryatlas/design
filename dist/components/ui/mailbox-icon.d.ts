/**
 * A mailbox whose flag springs up — the Inbox's own mark.
 *
 * It animates on hover by itself, or on command through a ref
 * (`startAnimation` / `stopAnimation`) so a larger target — the whole page
 * title — can drive it. The flag is a critically damped spring (damping =
 * 2·√stiffness): it swings up and stops, with no overshoot, since a hover
 * throws nothing.
 *
 * `currentColor`, like every icon in the system.
 */
export type MailboxIconHandle = {
    startAnimation: () => void;
    stopAnimation: () => void;
};
declare const MailboxIcon: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    /** Pixel size of the glyph. */
    size?: number;
    /**
     * Line weight. 1.5 — lighter than the system's 1.75 because this glyph
     * is drawn larger, beside a title, where a heavier line reads as bold.
     */
    strokeWidth?: number;
    /** When true, hover on the icon itself does nothing; the parent drives it. */
    controlled?: boolean;
} & import("react").RefAttributes<MailboxIconHandle>>;
export { MailboxIcon };
//# sourceMappingURL=mailbox-icon.d.ts.map
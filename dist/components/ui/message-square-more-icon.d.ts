/**
 * A speech bubble whose three dots blink in turn — someone typing.
 *
 * Animates on hover by itself, or through a ref (`startAnimation` /
 * `stopAnimation`) so a whole button can drive it. `currentColor`, at the
 * system's icon stroke so it sits beside Lucide glyphs.
 */
export type MessageSquareMoreIconHandle = {
    startAnimation: () => void;
    stopAnimation: () => void;
};
declare const MessageSquareMoreIcon: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    size?: number;
    strokeWidth?: number;
    /** When true, hover on the icon itself does nothing; the parent drives it. */
    controlled?: boolean;
} & import("react").RefAttributes<MessageSquareMoreIconHandle>>;
export { MessageSquareMoreIcon };
//# sourceMappingURL=message-square-more-icon.d.ts.map
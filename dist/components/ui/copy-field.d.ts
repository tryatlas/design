/**
 * A value to hand on (an invite link, a token, a slug) with a copy button at
 * its end. The value is monospace and truncates on one line; the button's
 * glyph draws a check once the value is on the clipboard (`CopyGlyph`), and
 * only then: a refusal leaves it as it was.
 *
 * `onCopy` puts the text on the clipboard and resolves `true` when it did,
 * for an app that copies through its own bridge. Without it the field uses
 * the browser's clipboard.
 */
declare function CopyField({ value, onCopy, label, copiedLabel, className, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    value: string;
    onCopy?: (value: string) => boolean | Promise<boolean>;
    /** The button's name. */
    label?: string;
    /** The button's name for a moment after it copied. */
    copiedLabel?: string;
}): import("react").JSX.Element;
export { CopyField };
//# sourceMappingURL=copy-field.d.ts.map
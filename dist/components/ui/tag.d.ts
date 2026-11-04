import type { LabelTone } from "../../lib/types.ts";
/**
 * The hue-coded identity chip.
 *
 * A hue is an IDENTITY, not a status — `purple` means "the Design label",
 * not "informational". Shaped exactly like a `Badge` (same radius, padding
 * and type), with the hue where a badge has its status tone: the hue's own
 * ink on the hue at 12%. For status use `<Badge>`; for a stable hue for any
 * entity use `hueFor(id)`.
 */
declare function Tag({ hue, dot, className, children, ...props }: React.ComponentProps<"span"> & {
    hue?: LabelTone;
    dot?: boolean;
}): import("react").JSX.Element;
/** The bare dot, for a rail item or a legend where the word is already there. */
declare function HueDot({ hue, className, ...props }: React.ComponentProps<"span"> & {
    hue: LabelTone;
}): import("react").JSX.Element;
/**
 * A label as it appears inside a dense row: a hue dot and the name, no chip.
 * In a table the chip was the loudest shape in the row; here identity is
 * carried by the dot alone. Use `<Tag>` where a label stands on its own — a
 * header, a detail panel — and this where it is one cell among many.
 */
declare function LabelMark({ hue, className, children, ...props }: React.ComponentProps<"span"> & {
    hue: LabelTone;
}): import("react").JSX.Element;
export { HueDot, LabelMark, Tag };
//# sourceMappingURL=tag.d.ts.map
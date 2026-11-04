import type { LucideIcon } from "lucide-react";
/**
 * The atom every settings surface is built from.
 *
 * A bordered card containing divided rows. Each row is a label with an
 * optional description on the left, and exactly one control hard-right: a
 * switch, a select, a button, a badge, or a chevron.
 *
 * Why it is a component and not a div with two children: the alignment is the
 * whole point. Every row in a card shares one baseline for its label and one
 * right edge for its control, and the moment a screen hand-rolls one row the
 * column breaks. Six screens in this app show settings; they all use this.
 *
 * Rows are `min-h`, not `h` — a two-line description grows the row rather
 * than clipping.
 */
declare function SettingCard({ className, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
type SettingRowProps = React.ComponentProps<"div"> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    /** The control. Goes hard-right, vertically centred against the label. */
    control?: React.ReactNode;
    icon?: LucideIcon;
};
declare function SettingRow({ className, label, description, control, icon, children, ...props }: SettingRowProps): import("react").JSX.Element;
/**
 * A row that navigates rather than sets. The whole row is the target, so the
 * chevron is decoration — it must not be the only thing that is clickable.
 */
declare function DrillInRow({ className, label, description, icon, value, ...props }: Omit<React.ComponentProps<"button">, "value"> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    icon?: LucideIcon;
    value?: React.ReactNode;
}): import("react").JSX.Element;
export { DrillInRow, SettingCard, SettingRow };
//# sourceMappingURL=setting-card.d.ts.map
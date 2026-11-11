import type { IconSize } from "../../ui/icon.tsx";
/** An indeterminate progress indicator. Sized off the icon ladder. */
declare function Spinner({ className, size, label, ...props }: Omit<React.ComponentProps<"svg">, "ref"> & {
    size?: IconSize;
    /** Accessible name. Set to "" inside a control that already has one. */
    label?: string;
}): import("react").JSX.Element;
export { Spinner };
//# sourceMappingURL=spinner.d.ts.map
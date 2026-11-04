import type { HsvColor } from "../theme/color.ts";
interface ColorControlProps<T> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    /** Fires when a drag ends, so a caller batching updates can flush. */
    onInteractionEnd?: () => void;
    className?: string;
}
export declare function ColorSaturationValuePlane({ label, value, onChange, onInteractionEnd, className, }: ColorControlProps<HsvColor>): import("react").JSX.Element;
export declare function ColorHueSlider({ label, value, onChange, onInteractionEnd, className, }: ColorControlProps<number>): import("react").JSX.Element;
export {};
//# sourceMappingURL=color-picker.d.ts.map
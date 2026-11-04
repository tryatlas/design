/**
 * The house slider, built on `@base-ui/react/slider`: one thumb over a track
 * whose filled part is the brand colour.
 *
 * `onValueChange` fires on every step of a drag and `onValueCommitted` once,
 * on release. A control bound to `config.toml` saves on the second: every save
 * rewrites the file.
 */
export interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
    onValueChange: (value: number) => void;
    onValueCommitted?: (value: number) => void;
    "aria-label"?: string;
    className?: string;
}
export declare function Slider({ value, min, max, step, disabled, onValueChange, onValueCommitted, className, ...props }: SliderProps): import("react").JSX.Element;
//# sourceMappingURL=slider.d.ts.map
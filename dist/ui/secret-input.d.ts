import { type InputProps } from "./input.tsx";
/**
 * A masked field for a secret that is already stored somewhere else.
 *
 * It never holds the stored value: the field is always the replacement draft,
 * and `configured` only changes the placeholder to say one exists. A draft is
 * handed to `onCommit` on Enter or when the field loses focus, then cleared;
 * Escape drops it. An empty draft commits nothing, so tabbing through a row
 * can't erase a key.
 */
export interface SecretInputProps extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" | "autoComplete"> {
    configured?: boolean;
    onCommit: (value: string) => void;
}
export declare function SecretInput({ configured, placeholder, onCommit, onBlur, onKeyDown, ...props }: SecretInputProps): import("react").JSX.Element;
//# sourceMappingURL=secret-input.d.ts.map
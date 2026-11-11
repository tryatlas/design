/**
 * Multi-line text. Same border and focus language as <Input>, the same 16px
 * on a touch screen (iOS zooms the page into a smaller field), and the same
 * read-only look.
 */
type TextareaSize = "sm" | "md" | "lg";
declare function Textarea({ className, size, ...props }: React.ComponentProps<"textarea"> & {
    size?: TextareaSize;
}): import("react").JSX.Element;
export { Textarea };
export type { TextareaSize };
//# sourceMappingURL=textarea.d.ts.map
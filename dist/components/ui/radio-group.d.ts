import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
/**
 * `density="compact"` packs the options 4px apart instead of 8, for a stack
 * of `RadioCard`s inside a dialog, where the cards' own borders already
 * separate them.
 */
declare function RadioGroup({ className, density, ...props }: RadioGroupPrimitive.Props & {
    density?: "default" | "compact";
}): import("react").JSX.Element;
declare function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props): import("react").JSX.Element;
/**
 * An option that needs a sentence to choose between: a model, a role, what
 * to delete. The whole card is the radio, inside a `RadioGroup`, so the
 * arrow keys move between cards as between dots. The chosen card takes the
 * selected fill and a stronger edge, and a check at its end; the rest lift
 * on hover. Disabled is the one disabled look, 50%.
 */
declare function RadioCard({ className, title, description, ...props }: Omit<RadioPrimitive.Root.Props, "title"> & {
    title: React.ReactNode;
    description?: React.ReactNode;
}): import("react").JSX.Element;
export { RadioCard, RadioGroup, RadioGroupItem };
//# sourceMappingURL=radio-group.d.ts.map
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
/**
 * A hairline rule.
 *
 * Defaults to `border-subtle`, not `border`: a separator inside a card is
 * dividing things that already share a surface, so it should be quieter than
 * the card's own edge. Pass `strong` where it separates two regions.
 */
declare function Separator({ className, orientation, strong, ...props }: SeparatorPrimitive.Props & {
    strong?: boolean;
}): import("react").JSX.Element;
export { Separator };
//# sourceMappingURL=separator.d.ts.map
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { VariantProps } from "class-variance-authority";
import { toggleVariants } from "./toggle-variants.ts";
declare function Toggle({ className, variant, size, ...props }: TogglePrimitive.Props & VariantProps<typeof toggleVariants>): import("react").JSX.Element;
export { Toggle, toggleVariants };
//# sourceMappingURL=toggle.d.ts.map
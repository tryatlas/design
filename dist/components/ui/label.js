import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
/** The text on or beside a control. Uses the named `label` text style. */
function Label({ className, ...props }) {
    return (_jsx("label", { "data-slot": "label", className: cn("flex items-center gap-2 label select-none", "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50", "peer-disabled:cursor-not-allowed peer-disabled:opacity-50", 
        // A Base UI control wrapped in the label (radio, checkbox) marks itself `data-disabled`.
        "has-data-disabled:cursor-not-allowed has-data-disabled:text-muted-foreground", className), ...props }));
}
export { Label };
//# sourceMappingURL=label.js.map
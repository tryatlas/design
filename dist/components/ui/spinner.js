import { jsx as _jsx } from "react/jsx-runtime";
import { LoaderCircleIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { ICON_SIZES, ICON_STROKE_WIDTH } from "../../ui/icon.js";
/** An indeterminate progress indicator. Sized off the icon ladder. */
function Spinner({ className, size = "md", label = "Loading", ...props }) {
    return (_jsx(LoaderCircleIcon, { "data-slot": "spinner", role: label ? "status" : undefined, "aria-label": label || undefined, "aria-hidden": label ? undefined : "true", size: ICON_SIZES[size], strokeWidth: ICON_STROKE_WIDTH, className: cn("shrink-0 animate-spin text-muted-foreground", className), ...props }));
}
export { Spinner };
//# sourceMappingURL=spinner.js.map
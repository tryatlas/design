import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { DashedRails } from "../blocks/dashed-rails.js";
import { Globe } from "../blocks/globe.js";
import { PlusCorners } from "../blocks/plus-decorator.js";
/**
 * The two-pane authentication layout.
 *
 * Left is the form and nothing else: a single measured column, vertically
 * centred, with a way back at the top. The column is deliberately narrow —
 * an auth form is two buttons and a sentence, and letting it run to 600px
 * makes it look like there is more to fill in than there is.
 *
 * There is no mark above the form and no footer below it. Both were tried
 * and both were noise: a badge floating over an empty half-screen, and a
 * copyright line on a page nobody reads for legal information. The page is
 * two buttons; everything that is not those two buttons is competition.
 *
 * Right is atmosphere and proof: a draggable globe parked off the top-right
 * corner on the bare pane, one line of copy and the logo cloud anchored to
 * the bottom. There is no image behind it — the pane is the surface, and
 * the globe is the only thing moving on the page. It collapses
 * entirely below `lg` — on a phone it would be a screenful of texture
 * between the user and the button they came to press.
 *
 * The pane is `bg-sidebar` rather than `bg-background` so the two halves read
 * as the rail/canvas pair the rest of the app is built from, rather than as
 * two unrelated surfaces that happen to sit side by side.
 */
function AuthSplit({ children, back, aside, proof, }) {
    return (_jsxs("div", { className: "flex h-svh overflow-hidden bg-background", children: [_jsxs("div", { className: "relative flex min-w-0 flex-1 flex-col px-6 py-8", children: [_jsx(DashedRails, { fade: true }), _jsx("div", { className: "flex h-8 shrink-0 items-center", children: back }), _jsx("div", { className: "flex w-full flex-1 items-center justify-center", children: _jsxs("div", { className: "relative flex w-full max-w-88 flex-col gap-6 border border-dashed border-border px-8 py-10", children: [_jsx(PlusCorners, {}), children] }) }), _jsx("div", { "aria-hidden": "true", className: "h-8 shrink-0" })] }), _jsxs("aside", { className: "relative hidden w-1/2 shrink-0 overflow-hidden border-l border-border-subtle bg-panel lg:block", children: [_jsx(Globe, { className: "absolute -top-[28%] -right-[30%] w-[120%]" }), _jsx("div", { className: "pointer-events-none absolute inset-0 flex flex-col justify-end p-10", children: _jsxs("div", { className: "pointer-events-auto flex flex-col gap-8", children: [_jsx("div", { className: "flex flex-col gap-2", children: aside }), proof] }) })] })] }));
}
/** One line of atmosphere copy, sized to sit under the field. */
function AuthAsideCopy({ className, ...props }) {
    return (_jsx("p", { className: cn("max-w-md text-xl font-semibold tracking-tight text-balance", className), ...props }));
}
function AuthAsideNote({ className, ...props }) {
    return _jsx("p", { className: cn("max-w-sm text-xs text-secondary-foreground", className), ...props });
}
export { AuthAsideCopy, AuthAsideNote, AuthSplit };
//# sourceMappingURL=auth-split.js.map
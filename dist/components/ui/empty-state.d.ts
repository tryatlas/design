import type { LucideIcon } from "lucide-react";
/**
 * What a pane says when it has nothing to show.
 *
 * Deliberately quiet: a large illustration in an empty inbox is a reward for
 * having no work, which is the wrong emphasis in a tool people live in. One
 * dim glyph, one sentence, and — only when there is a real next step — one
 * action.
 *
 * The copy rule: say what would be here, not that there is nothing here.
 * "No sessions in the last 7 days" beats "Nothing found".
 *
 * `size="page"` is a whole page with nothing on it yet: more room above and
 * below, and the title a step up, so it holds the page rather than floating
 * in the top of it. A pane or a card keeps the default.
 */
declare function EmptyState({ className, icon, title, description, action, size, ...props }: React.ComponentProps<"div"> & {
    size?: "default" | "page";
    /**
     * A Lucide component, drawn through `Icon` at `md`; or an element, drawn as
     * given in the same 32px box, for a glyph that is not a Lucide icon (a
     * provider's logo, a package mark). Size an element yourself (14–16px sits
     * right) and keep it `aria-hidden`: the title says what is missing.
     */
    icon?: LucideIcon | React.ReactElement;
    title: string;
    description?: string;
    action?: React.ReactNode;
}): import("react").JSX.Element;
export { EmptyState };
//# sourceMappingURL=empty-state.d.ts.map
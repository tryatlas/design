import * as React from "react";
export interface CommandSuggestion {
    /** The completion: an entry's name, or a command's. */
    name: string;
    kind: "command" | "dir" | "file";
}
export interface CommandSuggestionsProps {
    /** The listbox's id; options are `${id}-option-${index}`, for `aria-activedescendant`. */
    id: string;
    open: boolean;
    items: readonly CommandSuggestion[];
    activeIndex: number;
    /** What the list sits above: the command field. */
    anchor: Element | null;
    onSelect: (item: CommandSuggestion) => void;
    onOpenChange: (open: boolean) => void;
}
/** The option element's id, for the field's `aria-activedescendant`. */
export declare function commandSuggestionId(id: string, index: number): string;
/**
 * The terminal's completion list, floating above the command field
 * (desktop's `command-suggestions.tsx`). Controlled: the app owns the items
 * and the active row, which follows Tab. It never takes focus, and a press on
 * a row is cancelled, so typing carries on in the field; a press on the field
 * itself does not close it. It follows Tab and arrow keys, so it does not
 * animate.
 */
export declare function CommandSuggestions({ id, open, items, activeIndex, anchor, onSelect, onOpenChange, }: CommandSuggestionsProps): React.JSX.Element;
//# sourceMappingURL=command-suggestions.d.ts.map
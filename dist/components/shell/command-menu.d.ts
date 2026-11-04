import type { LucideIcon } from "lucide-react";
/**
 * ⌘K: a filtered list of actions, on desktop's command shell (`src/ui/
 * command.tsx`) — the same dialog, field, rows and keyboard model as the
 * desktop palette. The field keeps focus and names the highlighted row as its
 * active descendant; ↑/↓ move the highlight, Enter runs it, and the pointer
 * only highlights where it rests.
 */
export type CommandAction = {
    id: string;
    label: string;
    group: string;
    icon?: LucideIcon;
    shortcut?: string;
    to?: string;
    onSelect?: () => void;
};
declare function CommandMenu({ open, onOpenChange, actions, placeholder, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actions: Array<CommandAction>;
    placeholder?: string;
}): import("react").JSX.Element;
/** Binds ⌘K / Ctrl+K. Returns the open state so a button can also trigger it. */
declare function useCommandMenu(): {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export { CommandMenu, useCommandMenu };
//# sourceMappingURL=command-menu.d.ts.map
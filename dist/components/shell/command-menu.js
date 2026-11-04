"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLinks } from "../../lib/link.js";
import { CommandDialog, CommandDialogPopup, CommandEmpty, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandPanel, CommandShortcut, } from "../../ui/command.js";
import { Icon } from "../../ui/icon.js";
function CommandMenu({ open, onOpenChange, actions, placeholder = "Search sessions, projects, people…", }) {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const { navigate } = useLinks();
    const listId = useId();
    const panel = useRef(null);
    // Reset on close, not on open: resetting on open makes the palette flash
    // the full list for a frame before the filter reapplies.
    useEffect(() => {
        if (!open) {
            setQuery("");
            setActive(0);
        }
    }, [open]);
    const groups = useMemo(() => {
        const q = query.trim().toLowerCase();
        const matched = q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions;
        const byGroup = new Map();
        for (const action of matched) {
            const list = byGroup.get(action.group) ?? [];
            list.push(action);
            byGroup.set(action.group, list);
        }
        return [...byGroup.entries()];
    }, [actions, query]);
    // The rows in display order, so the highlight is one index over all groups.
    const flat = useMemo(() => groups.flatMap(([, items]) => items), [groups]);
    // Keep the keyboard highlight on screen as ↑/↓ walk past the list's edge.
    useEffect(() => {
        panel.current?.querySelector("[data-active]")?.scrollIntoView({ block: "nearest" });
    }, [active]);
    function run(action) {
        onOpenChange(false);
        if (action.to)
            navigate(action.to);
        action.onSelect?.();
    }
    function onKeyDown(event) {
        if (flat.length === 0)
            return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => (i + 1) % flat.length);
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => (i - 1 + flat.length) % flat.length);
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            const action = flat[active];
            if (action)
                run(action);
        }
    }
    let index = -1;
    return (_jsx(CommandDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(CommandDialogPopup, { title: "Command menu", children: [_jsx(CommandInput, { autoFocus: true, value: query, onChange: (e) => {
                        setQuery(e.target.value);
                        setActive(0);
                    }, onKeyDown: onKeyDown, placeholder: placeholder, "aria-controls": listId, "aria-activedescendant": flat.length > 0 ? `${listId}-${active}` : undefined }), _jsxs(CommandPanel, { ref: panel, id: listId, children: [flat.length === 0 && _jsxs(CommandEmpty, { children: ["No matches for \u201C", query, "\u201D"] }), groups.map(([group, items]) => (_jsxs(Fragment, { children: [_jsx(CommandGroupLabel, { children: group }), items.map((action) => {
                                    index += 1;
                                    const at = index;
                                    return (_jsxs(CommandItem, { id: `${listId}-${at}`, active: at === active, onMouseMove: () => setActive(at), onClick: () => run(action), children: [action.icon && (_jsx(CommandItemIcon, { children: _jsx(Icon, { icon: action.icon, size: "lg" }) })), _jsx("span", { className: "min-w-0 flex-1 truncate", children: action.label }), action.shortcut && _jsx(CommandShortcut, { children: action.shortcut })] }, action.id));
                                })] }, group)))] })] }) }));
}
/** Binds ⌘K / Ctrl+K. Returns the open state so a button can also trigger it. */
function useCommandMenu() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((v) => !v);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);
    return { open, setOpen };
}
export { CommandMenu, useCommandMenu };
//# sourceMappingURL=command-menu.js.map
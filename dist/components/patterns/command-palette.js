"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState, } from "react";
import { ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";
import { CommandDialog, CommandDialogPopup, CommandEmpty, CommandFooter, CommandFooterHint, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandPanel, CommandShortcut, CommandSubmenuChevron, } from "../../ui/command.js";
import { Icon } from "../../ui/icon.js";
import { Kbd, KbdGroup } from "../../ui/kbd.js";
import { Skeleton } from "../ui/skeleton.js";
import { Spinner } from "../ui/spinner.js";
import { filterCommandGroups, optionId, selectableIds, useListHighlight, } from "./command-list.js";
/**
 * The palettes ⌘K, ⌘P and the new-tab palette are, on the `Command` shell
 * (`src/ui/command.tsx`). Copied from desktop's `command-palette-content.tsx`
 * and the view stack in `command-palette.tsx` (ADR-0027), with the stores
 * left behind: everything arrives as props.
 *
 * Three layers, each usable alone:
 *
 *   CommandList         the rows. Controlled (`activeId`), never takes focus,
 *                       never listens for keys — so an editor that keeps DOM
 *                       focus (a slash or mention picker) can drive it.
 *   CommandPaletteView  the field, the list and the key legend, with the
 *                       keyboard model. No dialog: a host dialog that swaps
 *                       views (desktop's ⌘K ⇄ ⌘P) mounts one per view.
 *   CommandPalette      the dialog, the filter and the submenu stack.
 *
 * The keyboard model: the field keeps focus and names the highlighted row as
 * its active descendant; ↑/↓ step the highlight over the enabled rows,
 * wrapping; Enter runs it; Backspace on an empty field, or Escape, goes back
 * out of a submenu. A new query highlights the first row again. The pointer
 * highlights a row only when it actually moves.
 *
 * No open, close or highlight animation, on purpose: a palette opens hundreds
 * of times a day, and motion on a keyboard action reads as latency. Nothing
 * moves, so there is nothing for reduced motion to take away.
 */
/** The rows, grouped, with the keyboard highlight the caller owns. */
function CommandList({ id, groups, activeId, onPoint, onRun, emptyMessage = "No results", loading = false, size, className, ref, ...aria }) {
    const empty = groups.every((g) => g.items.length === 0);
    // Keep the highlight on screen as ↑/↓ walk past the list's edge.
    useLayoutEffect(() => {
        if (activeId === null)
            return;
        document.getElementById(optionId(id, activeId))?.scrollIntoView?.({ block: "nearest" });
    }, [id, activeId]);
    if (empty && loading) {
        return (_jsx("div", { "data-slot": "command-list-loading", className: "flex flex-col gap-1 px-2 pb-2", children: [0, 1, 2].map((i) => (_jsx(Skeleton, { className: "h-9 rounded-lg" }, i))) }));
    }
    if (empty)
        return _jsx(CommandEmpty, { children: emptyMessage });
    return (_jsx(CommandPanel, { ref: ref, id: id, size: size, className: className, ...aria, children: groups.map((group, index) => {
            if (group.items.length === 0)
                return null;
            const rows = group.items.map((item) => (_jsx(CommandRow, { id: optionId(id, item.id), item: item, active: item.id === activeId, onPoint: onPoint ? (x, y) => onPoint(item.id, x, y) : undefined, onRun: onRun }, item.id)));
            if (!group.label)
                return _jsx("div", { children: rows }, group.id);
            const labelId = optionId(id, `group-${group.id}`);
            return (_jsxs("div", { role: "group", "aria-labelledby": labelId, className: index > 0 ? "pt-2" : undefined, children: [_jsx(CommandGroupLabel, { id: labelId, children: group.label }), rows] }, group.id));
        }) }));
}
/** One row: icon, title (and description), then timestamp, trailing,
 *  shortcut and a submenu's chevron on the right. */
function CommandRow({ id, item, active, onPoint, onRun, }) {
    const title = _jsx("span", { className: "truncate text-foreground", children: item.title ?? item.label });
    return (_jsxs(CommandItem, { id: id, active: active, disabled: item.disabled, onPointerMove: onPoint ? (e) => onPoint(e.clientX, e.clientY) : undefined, 
        // Keep focus in the field: a mousedown on a row would blur it.
        onMouseDown: (e) => e.preventDefault(), onClick: () => {
            if (!item.disabled)
                onRun(item);
        }, children: [item.icon && _jsx(CommandItemIcon, { children: item.icon }), item.description ? (_jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [title, _jsx("span", { className: "min-w-0 truncate text-sm text-muted-foreground", children: item.description })] })) : (_jsx("span", { className: "flex min-w-0 flex-1 items-center", children: title })), item.trailing, item.timestamp && (_jsx("span", { className: "ms-auto min-w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground", children: item.timestamp })), item.shortcut && _jsx(CommandShortcut, { children: item.shortcut }), item.groups && _jsx(CommandSubmenuChevron, {})] }));
}
/** The key legend: Navigate, then Enter, Backspace and Esc as they apply,
 *  and `trailing` at the far end. */
function CommandHints({ actionLabel, backLabel, escapeLabel = "Close", extra, trailing, }) {
    return (_jsxs(CommandFooter, { children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(CommandFooterHint, { children: [_jsxs(KbdGroup, { children: [_jsx(Kbd, { variant: "soft", size: "sm", children: _jsx(Icon, { icon: ArrowUp, size: "sm" }) }), _jsx(Kbd, { variant: "soft", size: "sm", children: _jsx(Icon, { icon: ArrowDown, size: "sm" }) })] }), _jsx("span", { children: "Navigate" })] }), actionLabel !== undefined && (_jsxs(CommandFooterHint, { children: [_jsx(Kbd, { variant: "soft", size: "sm", children: "Enter" }), _jsx("span", { children: actionLabel })] })), backLabel !== undefined && (_jsxs(CommandFooterHint, { children: [_jsx(Kbd, { variant: "soft", size: "sm", children: "Backspace" }), _jsx("span", { children: backLabel })] })), extra, _jsxs(CommandFooterHint, { children: [_jsx(Kbd, { variant: "soft", size: "sm", children: "Esc" }), _jsx("span", { children: escapeLabel })] })] }), trailing] }));
}
/** True while an IME is composing: Enter and the arrows belong to it. */
function isComposing(e) {
    return e.nativeEvent.isComposing || e.keyCode === 229;
}
/** Takes focus once on mount, and again after the frames in which a host
 *  dialog's focus trap reacts to the previous view's field unmounting. */
function useClaimFocus(ref, enabled) {
    useEffect(() => {
        if (!enabled)
            return;
        ref.current?.focus();
        let inner = 0;
        const outer = requestAnimationFrame(() => {
            ref.current?.focus();
            inner = requestAnimationFrame(() => ref.current?.focus());
        });
        return () => {
            cancelAnimationFrame(outer);
            cancelAnimationFrame(inner);
        };
    }, [ref, enabled]);
}
/** The field, the list and the legend, with the keyboard model. */
function CommandPaletteView(props) {
    const { groups, query, onQueryChange, onRun, onBack, onSubmit, loading = false } = props;
    const generatedId = useId();
    const listId = props.listId ?? generatedId;
    const inputRef = useRef(null);
    const panelRef = useRef(null);
    const ids = selectableIds(groups);
    const highlight = useListHighlight(ids, query);
    const hasRows = groups.some((g) => g.items.length > 0);
    // A new query starts at the top of the list.
    useLayoutEffect(() => {
        panelRef.current?.scrollTo?.({ top: 0 });
    }, [query]);
    useClaimFocus(inputRef, props.claimFocus ?? true);
    const findActive = () => groups.flatMap((g) => g.items).find((i) => i.id === highlight.active && !i.disabled);
    const onKeyDown = (e) => {
        if (isComposing(e))
            return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
                return;
            e.preventDefault();
            highlight.step(e.key === "ArrowDown" ? 1 : -1);
            return;
        }
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && onSubmit) {
            e.preventDefault();
            onSubmit({ mod: true });
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            const item = findActive();
            if (item)
                onRun(item);
            else
                onSubmit?.({ mod: false });
            return;
        }
        if (e.key === "Backspace" && query === "" && onBack) {
            e.preventDefault();
            onBack();
        }
    };
    return (_jsxs("div", { "data-slot": "command-palette-view", className: "flex min-h-0 flex-1 flex-col", children: [_jsx(CommandInput, { ref: inputRef, value: query, onChange: (e) => onQueryChange(e.target.value), onKeyDown: onKeyDown, placeholder: props.placeholder, disabled: props.disabled, "aria-expanded": hasRows, "aria-controls": hasRows ? listId : undefined, "aria-activedescendant": hasRows && highlight.active !== null ? optionId(listId, highlight.active) : undefined, startAddon: props.startAddon, endAddon: (loading || props.endAddon) && (_jsxs(_Fragment, { children: [loading && _jsx(Spinner, { size: "lg", label: "Loading" }), props.endAddon] })) }), _jsx(CommandList, { ref: panelRef, id: listId, groups: groups, activeId: highlight.active, onPoint: highlight.pointTo, onRun: onRun, emptyMessage: props.emptyMessage, loading: loading, size: props.size }), (props.hints ?? true) && (_jsx(CommandHints, { actionLabel: props.actionLabel, backLabel: onBack ? "Back" : undefined, escapeLabel: props.escapeLabel, trailing: props.footerTrailing }))] }));
}
/**
 * ⌘K: the dialog, the filter and the submenu stack, over `CommandPaletteView`.
 *
 * Running a row: a disabled row does nothing; a submenu row drills in, its
 * query starting empty (Backspace or Escape restores the parent's); any other row asks to close (unless `keepOpen`), then calls
 * `onRun` and its own `onSelect`. Escape and Backspace-on-empty go back out
 * of a submenu; Escape at the root closes. The query and the stack live in
 * the dialog's popup, which unmounts on close, so every open starts fresh.
 */
function CommandPalette({ open, onOpenChange, title = "Command palette", ...props }) {
    // Escape is the dialog's (Base UI dismisses before a keydown on the field
    // could stop it), so the open view registers its way back here, and the
    // dismissal is cancelled while there is somewhere to go back to.
    const back = useRef(null);
    return (_jsx(CommandDialog, { open: open, onOpenChange: (next, details) => {
            if (!next && details.reason === "escape-key" && back.current) {
                details.cancel();
                back.current();
                return;
            }
            onOpenChange(next);
        }, children: _jsx(CommandDialogPopup, { title: title, "data-slot": "command-palette", children: _jsx(CommandPaletteStack, { ...props, backRef: back, onClose: () => onOpenChange(false) }) }) }));
}
function CommandPaletteStack({ groups, placeholder = "Search commands…", submenuPlaceholder = "Search…", emptyMessage = (q) => (q ? `No results for “${q}”` : "No commands"), actionLabel = "Select", filter = true, onQueryChange, loading, onRun, hints, size, backRef, onClose, }) {
    const [query, setQueryState] = useState("");
    const [stack, setStack] = useState([]);
    const setQuery = (next) => {
        setQueryState(next);
        onQueryChange?.(next);
    };
    const top = stack[stack.length - 1];
    const pop = () => {
        if (!top)
            return;
        setStack(stack.slice(0, -1));
        setQuery(top.query);
    };
    // Only a submenu has somewhere to go back to.
    useLayoutEffect(() => {
        backRef.current = top ? pop : null;
        return () => {
            backRef.current = null;
        };
    });
    const current = top?.item.groups ?? groups;
    const shown = filter ? filterCommandGroups(current, query) : current;
    const run = (item) => {
        if (item.disabled)
            return;
        if (item.groups) {
            setStack([...stack, { item, query }]);
            setQuery("");
            return;
        }
        if (!item.keepOpen)
            onClose();
        onRun?.(item);
        item.onSelect?.();
    };
    return (_jsx(CommandPaletteView
    // A new view is a new list: its highlight starts at its top.
    , { groups: shown, query: query, onQueryChange: setQuery, onRun: run, placeholder: top ? (top.item.placeholder ?? submenuPlaceholder) : placeholder, emptyMessage: typeof emptyMessage === "function" ? emptyMessage(query) : emptyMessage, loading: loading, actionLabel: actionLabel, onBack: top ? pop : undefined, startAddon: top ? (_jsx("button", { type: "button", "aria-label": "Back", onMouseDown: (e) => e.preventDefault(), onClick: pop, className: "flex cursor-pointer items-center text-muted-foreground hover:text-foreground", children: _jsx(Icon, { icon: ArrowLeft, size: "lg" }) })) : undefined, hints: hints, size: size }, `${stack.length}:${top?.item.id ?? "root"}`));
}
export { CommandHints, CommandList, CommandPalette, CommandPaletteView, CommandRow };
//# sourceMappingURL=command-palette.js.map
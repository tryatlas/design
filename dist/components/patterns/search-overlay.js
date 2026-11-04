"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useRef } from "react";
import { History, X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { CommandDialog, CommandDialogPopup, CommandEmpty, CommandFooterHint, CommandInput, CommandItem, CommandItemIcon, CommandPanel, } from "../../ui/command.js";
import { Icon } from "../../ui/icon.js";
import { Kbd } from "../../ui/kbd.js";
import { Spinner } from "../ui/spinner.js";
import { optionId, splitHighlights, useListHighlight } from "./command-list.js";
import { CommandHints } from "./command-palette.js";
const RECENT_LIMIT = 8;
const RECENT_PREFIX = "recent:";
function SearchOverlay(props) {
    const inputRef = useRef(null);
    return (_jsx(CommandDialog, { open: props.open, onOpenChange: props.onOpenChange, children: _jsx(CommandDialogPopup, { title: props.title, "data-slot": "search-overlay", initialFocus: inputRef, children: _jsx(SearchOverlayBody, { ...props, inputRef: inputRef }) }) }));
}
function SearchOverlayBody({ onOpenChange, placeholder, query, onQueryChange, mode = "live", onSubmit, status, error, results, onOpen, count, recent = [], onPickRecent, onForgetRecent, onClearRecent, idleHint, emptyMessage = "No results", notice, endAddon, hints = true, inputRef, }) {
    const listId = useId();
    const recentLabelId = `${listId}-recent-label`.replace(/[^A-Za-z0-9_-]/g, "_");
    const panelRef = useRef(null);
    // Submit mode: the query was edited since the last search, so Enter
    // searches rather than opening a result of the old one. The popup unmounts
    // on close, so every open starts clean.
    const dirty = useRef(false);
    const empty = query.trim() === "";
    const shownRecent = recent.slice(0, RECENT_LIMIT);
    const showingRecent = status !== "error" && empty && status === "idle" && shownRecent.length > 0;
    const showingResults = status !== "error" && !showingRecent && results.length > 0;
    const ids = showingRecent
        ? shownRecent.map((q) => RECENT_PREFIX + q)
        : showingResults
            ? results.map((r) => r.id)
            : [];
    const highlight = useListHighlight(ids, `${query}|${mode}|${showingRecent ? "r" : "q"}`);
    const hasList = ids.length > 0;
    useLayoutEffect(() => {
        panelRef.current?.scrollTo?.({ top: 0 });
    }, [query]);
    useLayoutEffect(() => {
        if (highlight.active === null)
            return;
        document
            .getElementById(optionId(listId, highlight.active))
            ?.scrollIntoView?.({ block: "nearest" });
    }, [listId, highlight.active]);
    const open = (result) => {
        onOpenChange(false);
        onOpen(result);
    };
    const submit = (q) => {
        const trimmed = q.trim();
        if (!trimmed)
            return;
        dirty.current = false;
        onSubmit?.(trimmed);
    };
    const pickRecent = (q) => {
        onPickRecent?.(q);
        onQueryChange(q);
        if (mode === "submit")
            submit(q);
    };
    const activeRecent = showingRecent && highlight.active?.startsWith(RECENT_PREFIX)
        ? highlight.active.slice(RECENT_PREFIX.length)
        : null;
    const activeResult = showingResults ? results.find((r) => r.id === highlight.active) : undefined;
    const onKeyDown = (e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229)
            return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
                return;
            e.preventDefault();
            highlight.step(e.key === "ArrowDown" ? 1 : -1);
            return;
        }
        if (e.key === "Delete" && activeRecent !== null) {
            e.preventDefault();
            onForgetRecent?.(activeRecent);
            return;
        }
        if (e.key !== "Enter")
            return;
        e.preventDefault();
        if (activeRecent !== null)
            return pickRecent(activeRecent);
        if (mode === "submit" && (dirty.current || results.length === 0))
            return submit(query);
        if (activeResult)
            open(activeResult);
    };
    const enterLabel = showingRecent
        ? "Search"
        : mode === "submit" && (dirty.current || results.length === 0)
            ? "Search"
            : "Open";
    let body = null;
    if (status === "error") {
        body = _jsx("p", { className: "px-5 py-10 text-center text-sm text-destructive", children: error });
    }
    else if (showingRecent) {
        body = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex shrink-0 items-center justify-between px-4 pt-1 pb-1.5", children: [_jsx("span", { id: recentLabelId, className: "text-xs font-medium text-muted-foreground", children: "Recent searches" }), onClearRecent && (_jsx("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: onClearRecent, className: "cursor-pointer text-xs text-muted-foreground hover:text-foreground", children: "Clear all" }))] }), _jsx(CommandPanel, { ref: panelRef, id: listId, "aria-labelledby": recentLabelId, children: shownRecent.map((q) => {
                        const key = RECENT_PREFIX + q;
                        return (_jsxs(CommandItem, { id: optionId(listId, key), active: highlight.active === key, className: "group", onPointerMove: (e) => highlight.pointTo(key, e.clientX, e.clientY), onMouseDown: (e) => e.preventDefault(), onClick: () => pickRecent(q), children: [_jsx(CommandItemIcon, { children: _jsx(Icon, { icon: History, size: "lg" }) }), _jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-sm", children: q }), onForgetRecent && (_jsx("span", { "aria-hidden": "true", onMouseDown: (e) => e.preventDefault(), onClick: (e) => {
                                        e.stopPropagation();
                                        onForgetRecent(q);
                                    }, className: "ms-auto flex shrink-0 items-center rounded-sm p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 hover:text-foreground", children: _jsx(Icon, { icon: X, size: "sm" }) }))] }, key));
                    }) })] }));
    }
    else if (empty && status === "idle") {
        body = idleHint ? _jsx(CommandEmpty, { children: idleHint }) : null;
    }
    else if (showingResults) {
        body = (_jsxs(_Fragment, { children: [_jsx(CommandPanel, { ref: panelRef, id: listId, size: "tall", children: results.map((result) => (_jsx(SearchResultRow, { id: optionId(listId, result.id), result: result, active: highlight.active === result.id, onPoint: (x, y) => highlight.pointTo(result.id, x, y), onOpen: open }, result.id))) }), notice && _jsx("p", { className: "shrink-0 px-5 pb-2 text-xs text-muted-foreground", children: notice })] }));
    }
    else if (status === "done") {
        body = _jsx(CommandEmpty, { children: emptyMessage });
    }
    return (_jsxs("div", { "data-slot": "search-overlay-view", className: "flex min-h-0 flex-1 flex-col", children: [_jsx(CommandInput, { ref: inputRef, value: query, onChange: (e) => {
                    dirty.current = true;
                    onQueryChange(e.target.value);
                }, onKeyDown: onKeyDown, placeholder: placeholder, "aria-expanded": hasList, "aria-controls": hasList ? listId : undefined, "aria-activedescendant": hasList && highlight.active !== null ? optionId(listId, highlight.active) : undefined, endAddon: _jsxs(_Fragment, { children: [status === "searching" && _jsx(Spinner, { size: "lg", label: "Searching" }), count !== undefined && (_jsx("span", { className: "shrink-0 text-xs tabular-nums text-muted-foreground", children: count })), endAddon] }) }), body, hints && (_jsx(CommandHints, { actionLabel: hasList || (mode === "submit" && !empty) ? enterLabel : undefined, extra: showingRecent && onForgetRecent ? (_jsxs(CommandFooterHint, { children: [_jsx(Kbd, { variant: "soft", size: "sm", children: "Delete" }), _jsx("span", { children: "Forget" })] })) : undefined }))] }));
}
/** One result: icon, title and meta on the first line; the matching text,
 *  its matches in the foreground colour, on the second. */
function SearchResultRow({ id, result, active, onPoint, onOpen, }) {
    return (_jsxs(CommandItem, { id: id, active: active, onPointerMove: onPoint ? (e) => onPoint(e.clientX, e.clientY) : undefined, onMouseDown: (e) => e.preventDefault(), onClick: () => onOpen(result), children: [result.icon && _jsx(CommandItemIcon, { children: result.icon }), _jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("span", { className: "flex min-w-0 items-baseline gap-2", children: [_jsx("span", { className: cn("min-w-0 truncate", result.mono && "font-mono text-sm"), children: result.title }), result.meta && (_jsx("span", { className: "shrink-0 text-xs tabular-nums text-muted-foreground", children: result.meta }))] }), result.detail && (_jsx("span", { className: cn("min-w-0 truncate text-sm text-muted-foreground", result.mono && "font-mono"), children: _jsx(Highlighted, { text: result.detail, ranges: result.highlights }) }))] })] }));
}
/** Colour alone marks a match, as in desktop's file search: a weight step
 *  would widen only the matched glyphs and set the line unevenly. */
function Highlighted({ text, ranges, }) {
    return splitHighlights(text, ranges).map((segment, i) => segment.match ? (_jsx("mark", { "data-match": "", className: "bg-transparent text-foreground", children: segment.text }, i)) : (segment.text));
}
export { SearchOverlay, SearchResultRow };
//# sourceMappingURL=search-overlay.js.map
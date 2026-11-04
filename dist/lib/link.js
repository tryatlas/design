"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
function PlainLink(props) {
    return _jsx("a", { ...props });
}
const DEFAULT = {
    Link: PlainLink,
    location: { pathname: "" },
    navigate: (href) => window.location.assign(href),
};
const LinkContext = createContext(DEFAULT);
function LinkProvider({ Link = DEFAULT.Link, location = DEFAULT.location, navigate = DEFAULT.navigate, children, }) {
    const value = useMemo(() => ({ Link, location, navigate }), [Link, location, navigate]);
    return _jsx(LinkContext.Provider, { value: value, children: children });
}
function useLinks() {
    return useContext(LinkContext);
}
/** `to` plus its search params, as one href. */
function hrefOf(to, search) {
    const query = new URLSearchParams(search).toString();
    return query ? `${to}?${query}` : to;
}
/** True when `location` is `to` and carries every one of `search`'s params. */
function isAt(location, to, search) {
    if (location.pathname !== to)
        return false;
    const current = new URLSearchParams(location.search ?? "");
    return Object.entries(search ?? {}).every(([k, v]) => current.get(k) === v);
}
export { LinkProvider, hrefOf, isAt, useLinks };
//# sourceMappingURL=link.js.map
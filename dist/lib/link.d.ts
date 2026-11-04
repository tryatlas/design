/**
 * How the shell components link and navigate without depending on a router.
 *
 * The package renders from props alone (ADR-0027's boundary rule), so the
 * sidebar, the settings rail, the command menu and the org switcher never
 * import a router. The app wraps them once in a `LinkProvider` that says how
 * to render a link, where the user is, and how to navigate:
 *
 *   // TanStack Router
 *   <LinkProvider
 *     Link={({ href, ...props }) => <Link to={href} {...props} />}
 *     location={useRouterState({ select: (s) => s.location })}
 *     navigate={(href) => router.navigate({ to: href })}
 *   >
 *
 *   // Next.js
 *   <LinkProvider Link={NextLink} location={{ pathname: usePathname() }}
 *     navigate={router.push}>
 *
 * Without a provider, links are plain `<a href>` and nothing is "active".
 */
export type LinkProps = Omit<React.ComponentProps<"a">, "href"> & {
    href: string;
};
export type LinkComponent = React.ComponentType<LinkProps>;
export type LinkLocation = {
    pathname: string;
    /** The query string, with or without its leading `?`. */
    search?: string;
};
type LinkContextValue = {
    Link: LinkComponent;
    location: LinkLocation;
    navigate: (href: string) => void;
};
declare function LinkProvider({ Link, location, navigate, children, }: Partial<LinkContextValue> & {
    children: React.ReactNode;
}): import("react").JSX.Element;
declare function useLinks(): LinkContextValue;
/** `to` plus its search params, as one href. */
declare function hrefOf(to: string, search?: Record<string, string>): string;
/** True when `location` is `to` and carries every one of `search`'s params. */
declare function isAt(location: LinkLocation, to: string, search?: Record<string, string>): boolean;
export { LinkProvider, hrefOf, isAt, useLinks };
//# sourceMappingURL=link.d.ts.map
/**
 * Stacked-paper: two ghost cards peeking out behind the real one, done
 * with pseudo-elements so it costs no
 * DOM — `before:` is the sheet directly behind, `after:` the one behind
 * that, each inset a little further and a little higher.
 *
 * Wrap the card; the wrapper must not clip. `mask-b-from-65%` fades the
 * stack out at the bottom so it reads as depth rather than three cards.
 */
declare function GhostCards({ className, children, ...props }: React.ComponentProps<"div">): import("react").JSX.Element;
export { GhostCards };
//# sourceMappingURL=ghost-cards.d.ts.map
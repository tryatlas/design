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
declare function AuthSplit({ children, back, aside, proof, }: {
    children: React.ReactNode;
    /** The escape hatch, top-left of the form column. */
    back?: React.ReactNode;
    /** Atmosphere copy, bottom of the aside. */
    aside: React.ReactNode;
    /** Social proof, below the copy. */
    proof?: React.ReactNode;
}): import("react").JSX.Element;
/** One line of atmosphere copy, sized to sit under the field. */
declare function AuthAsideCopy({ className, ...props }: React.ComponentProps<"p">): import("react").JSX.Element;
declare function AuthAsideNote({ className, ...props }: React.ComponentProps<"p">): import("react").JSX.Element;
export { AuthAsideCopy, AuthAsideNote, AuthSplit };
//# sourceMappingURL=auth-split.d.ts.map
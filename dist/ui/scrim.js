/**
 * The frosted scrim, shared by `Dialog` and `AlertDialog` so their `blur`
 * options cannot drift apart. Both overlays dim with `scrim`; `blur` adds
 * this, which also frosts what is behind, for the blocking prompts
 * (permission, elicitation, sign-in, a destructive confirm) where the app
 * behind should read as unavailable rather than merely dimmed.
 */
export const SCRIM_BLUR = "backdrop-blur-sm";
//# sourceMappingURL=scrim.js.map
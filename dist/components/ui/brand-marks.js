"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { cn } from "../../lib/utils.js";
/**
 * Third-party brand marks.
 *
 * These are the only colour literals in the component tree, and they are not
 * theme colours — they are somebody else's trademark. Google's four-colour G
 * is specified by their brand guidelines and must not be recoloured, tinted
 * or reduced to a monochrome glyph on a sign-in button; doing so is both a
 * guideline violation and a recognisability problem, since the colour IS the
 * mark. GitHub's Octocat is authorised in a single colour, so it takes
 * `currentColor` and inherits the button's ink.
 *
 * The model marks below follow the same rule: Claude's spark and Gemini's
 * star keep their brand colours; OpenAI's knot, Cursor's cube and OpenCode's
 * frame are monochrome marks, so they take the ink they sit in. They are the
 * marks desktop draws (Lobe Icons, MIT — THIRD_PARTY_NOTICES.md), inlined so
 * a consumer needs no asset files.
 *
 * The ratchet exempts this file by name for exactly that reason.
 *
 * Sized at 16px to match `ICON_SIZES.md`, so a brand mark and a Lucide glyph
 * sit on the same optical line inside a button.
 */
function GoogleMark({ className, ...props }) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: [_jsx("path", { fill: "#4285F4", d: "M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z" }), _jsx("path", { fill: "#34A853", d: "M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0 0 12 24Z" }), _jsx("path", { fill: "#FBBC05", d: "M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.26a12 12 0 0 0 0 10.78l4.01-3.11Z" }), _jsx("path", { fill: "#EA4335", d: "M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.75 12 4.75Z" })] }));
}
function GitHubMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M12 .5C5.73.5.67 5.58.67 11.85c0 5.02 3.24 9.27 7.74 10.77.57.11.78-.24.78-.54v-2.1c-3.15.69-3.81-1.33-3.81-1.33-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.18 1.74 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .95-.31 3.12 1.17a10.7 10.7 0 0 1 5.68 0c2.17-1.48 3.12-1.17 3.12-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.33-5.19 5.61.41.36.78 1.06.78 2.13v3.16c0 .3.2.66.79.54a11.36 11.36 0 0 0 7.73-10.77C23.33 5.58 18.27.5 12 .5Z" }) }));
}
function XMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) }));
}
function DiscordMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.79.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.32.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .79.009c.12.099.246.198.373.292a.077.077 0 0 1-.6.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.41.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .84.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028M8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418m7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418" }) }));
}
/** Claude's spark, in Anthropic's terracotta. */
function ClaudeMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { fill: "#D97757", fillRule: "nonzero", d: "M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" }) }));
}
const GEMINI_STAR = "M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z";
/** Gemini's star: a blue ground under three fading washes. The gradients
 *  need ids unique to this instance, so two stars on a page stay apart. */
function GeminiMark({ className, ...props }) {
    const id = useId();
    const [green, red, yellow] = [`${id}-g`, `${id}-r`, `${id}-y`];
    return (_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: [_jsx("path", { d: GEMINI_STAR, fill: "#3186FF" }), _jsx("path", { d: GEMINI_STAR, fill: `url(#${green})` }), _jsx("path", { d: GEMINI_STAR, fill: `url(#${red})` }), _jsx("path", { d: GEMINI_STAR, fill: `url(#${yellow})` }), _jsxs("defs", { children: [_jsxs("linearGradient", { gradientUnits: "userSpaceOnUse", id: green, x1: "7", x2: "11", y1: "15.5", y2: "12", children: [_jsx("stop", { stopColor: "#08B962" }), _jsx("stop", { offset: "1", stopColor: "#08B962", stopOpacity: "0" })] }), _jsxs("linearGradient", { gradientUnits: "userSpaceOnUse", id: red, x1: "8", x2: "11.5", y1: "5.5", y2: "11", children: [_jsx("stop", { stopColor: "#F94543" }), _jsx("stop", { offset: "1", stopColor: "#F94543", stopOpacity: "0" })] }), _jsxs("linearGradient", { gradientUnits: "userSpaceOnUse", id: yellow, x1: "3.5", x2: "17.5", y1: "13.5", y2: "12", children: [_jsx("stop", { stopColor: "#FABC12" }), _jsx("stop", { offset: ".46", stopColor: "#FABC12", stopOpacity: "0" })] })] })] }));
}
/** OpenAI's knot. Monochrome: takes `currentColor`. */
function OpenAIMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", fillRule: "evenodd", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" }) }));
}
/** Cursor's cube, monochrome: takes `currentColor`. */
function CursorMark({ className, ...props }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", fillRule: "evenodd", "aria-hidden": "true", className: cn("shrink-0", className), ...props, children: _jsx("path", { d: "M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" }) }));
}
/**
 * OpenCode's mark: a frame with a block set in its lower half. Its brand
 * files are the same geometry in two colourings — light frame and dim block
 * on dark, the reverse on light — so it is drawn on theme tokens and takes
 * the right one in ANY theme scope.
 */
function OpenCodeMark({ className, ...props }) {
    return (_jsxs("svg", { viewBox: "0 0 240 300", height: "16", "aria-hidden": "true", className: cn("w-auto shrink-0", className), ...props, children: [_jsx("path", { d: "M180 240H60V120H180V240Z", className: "fill-foreground/25" }), _jsx("path", { d: "M180 60H60V240H180V60ZM240 300H0V0H240V300Z", className: "fill-foreground" })] }));
}
export { ClaudeMark, CursorMark, DiscordMark, GeminiMark, GitHubMark, GoogleMark, OpenAIMark, OpenCodeMark, XMark, };
//# sourceMappingURL=brand-marks.js.map
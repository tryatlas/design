/**
 * An agent's icon from a registry manifest, as an SVG data URL.
 *
 * Two rendering paths, chosen by what the SVG itself asks for:
 *
 * - **`currentColor` (monochrome)** → a CSS mask filled with `currentColor`,
 *   so the glyph takes the surrounding ink exactly as its author meant, in any
 *   theme. A mask also cannot execute script, which matters for artwork
 *   fetched from a third-party registry.
 * - **anything else (real brand colours)** → an image, untouched. Masking
 *   one of these would flatten a multicolour logo to one tone.
 *
 * Neither path injects the SVG's markup into the DOM, and nothing here should.
 */
declare function ExternalAgentMark({ dataUrl, size, className, }: {
    dataUrl: string;
    size?: number;
    className?: string;
}): import("react").JSX.Element;
/**
 * The type step for a monogram in a `size`px box: the initial sits at about
 * 70% of the box, rounded to the scale (9, 10, 11, 13, 16, 24px).
 */
declare function monogramTextClass(size: number): string;
/**
 * The last-resort agent glyph: the label's initial, for an agent with no
 * icon. Decorative: the caller shows the agent's name as text.
 */
declare function AgentMonogram({ label, size, className, }: {
    label: string;
    size?: number;
    className?: string;
}): import("react").JSX.Element;
export { AgentMonogram, ExternalAgentMark, monogramTextClass };
//# sourceMappingURL=agent-icon.d.ts.map
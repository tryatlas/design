import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../../src/lib/utils.ts";
import { HUD } from "../../src/ui/hud.ts";
import { Kbd } from "../../src/ui/kbd.tsx";
import { Page, Section, TokenTable } from "./kit.tsx";

const LEVELS = [
  ["shadow-sm", "--elevation-raised", "raised off the surface"],
  ["shadow-md", "--elevation-menu", "menus and popovers"],
  ["shadow-lg", "--elevation-dialog", "dialogs"],
] as const;

function ElevationPage() {
  return (
    <Page
      title="Elevation"
      lede="Three levels, and they read as three. The shadow colour and weight come from the theme, so a light appearance gets a light shadow. Most raised things in content use a hairline, not a shadow; only what floats over content casts one."
    >
      <Section title="The three levels">
        <TokenTable
          columns={["Utility", "Variable", "Use", "Sample"]}
          rows={LEVELS.map(([utility, v, use]) => ({
            name: utility,
            value: v,
            use,
            sample: (
              <div className={cn(utility, "h-12 w-24 rounded-md border border-border bg-card")} />
            ),
          }))}
        />
      </Section>
      <Section title="Side by side" intro="On the page's own ground.">
        <div className="flex flex-wrap gap-10 rounded-xl bg-muted p-10">
          {LEVELS.map(([utility]) => (
            <div
              key={utility}
              className={cn(
                utility,
                "label flex h-24 w-40 items-center justify-center rounded-lg border border-border bg-popover",
              )}
            >
              {utility}
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Glass"
        intro={
          <>
            <code className="code">inset-highlight</code> is the 1px top edge on raised glass.{" "}
            <code className="code">HUD</code> is the frosted recipe for keycaps floating over
            content.
          </>
        }
      >
        <div className="flex items-center gap-6 rounded-xl bg-gradient-to-br from-chart-2 via-chart-4 to-chart-5 p-10">
          <div className={cn(HUD, "flex items-center gap-1 rounded-lg p-1.5")}>
            <Kbd>⌘</Kbd>
            <Kbd>⌥</Kbd>
            <Kbd>Space</Kbd>
          </div>
          <div className="label inset-highlight rounded-lg border border-border bg-card px-3 py-2 shadow-md">
            inset-highlight shadow-md
          </div>
          <div className="label rounded-lg glass-bar px-3 py-2 text-foreground">glass-bar</div>
          <div className="label rounded-lg glass px-3 py-2 text-foreground">glass</div>
        </div>
        <p className="caption">
          <code className="code">glass-bar</code> is the one floating material: a bar or a control
          over the page (a call dock, a composer), blurred, bordered and lifted.{" "}
          <code className="code">glass</code> is the fill alone, for a popover over a busy page.
          Both turn opaque under prefers-reduced-transparency.
        </p>
      </Section>
      <Section
        title="Card"
        intro={
          <>
            <code className="code">surface-card</code> is every card's edge and fill: the large
            radius, a 1px element-selected border and the card fill. Panel, StatGrid, KpiStrip,
            DataTable and SettingCard all draw it. An app can hold its own code to it with the
            opt-in SURFACE_CARD_RULE from @tryatlas/design/ratchet.
          </>
        }
      >
        <div className="flex gap-4">
          <div className="surface-card w-48 p-4">
            <p className="heading">Seats</p>
            <p className="caption">12 of 20 in use</p>
          </div>
        </div>
      </Section>
      <Section
        title="Scrim"
        intro="Not a theme key, on purpose: only darkening pushes the app away, in either appearance. scrim for a dialog, scrim-soft for an in-panel drawer."
      >
        <div className="flex gap-4">
          {["scrim", "scrim-soft"].map((s) => (
            <div
              key={s}
              className="relative h-28 w-56 overflow-hidden rounded-lg border border-border bg-card p-3"
            >
              <span className="body">Content behind</span>
              <div className={cn(s, "absolute inset-0 flex items-center justify-center")}>
                <code className="code rounded-sm bg-popover px-2 py-1">{s}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Elevation",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
export const Page_: StoryObj = { name: "Page", render: () => <ElevationPage /> };

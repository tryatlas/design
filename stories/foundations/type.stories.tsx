import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../../src/lib/utils.ts";
import { Page, Section, TokenTable, cssVar } from "./kit.tsx";

const STEPS = [
  ["text-3xs", "--text-3xs", "a badge on a dense row"],
  ["text-2xs", "--text-2xs", "eyebrows, captions, keycaps"],
  ["text-xs", "--text-xs", "control text; the most common size"],
  ["text-sm", "--text-sm", "list rows, secondary chrome"],
  ["text-base", "--text-base", "body text, messages"],
  ["text-md", "--text-md", "panel and dialog titles"],
  ["text-lg", "--text-lg", "page headings"],
  ["text-xl", "--text-xl", "empty-state headlines"],
  ["text-2xl", "--text-2xl", "the largest thing in the app"],
] as const;

const STYLES = [
  ["eyebrow", "Section header above a group of rows", "10px · 600 · uppercase · tracked · muted"],
  ["label", "Text on and beside a control", "11px · 500"],
  ["body", "Running prose: a description, a message", "13px · 500"],
  ["caption", "The dimmed second line under something", "10px · 500 · muted"],
  ["code", "Any monospace run: a path, a hash, a command", "12px · 500 · Geist Mono"],
  ["heading", "A panel or dialog title", "14px · 600 · -0.01em"],
  ["page-title", "A page's own title, the one h1", "20px · 500 · no extra tracking"],
] as const;

function TypePage() {
  return (
    <Page
      title="Type"
      lede="Nine sizes, two weights, two families. Half-pixel sizes round up to the next step. Reach for a named text style before a size, a weight and a colour."
    >
      <Section
        title="The scale"
        intro="Each size carries its own line height, and from 16px up its own tracking: Geist reads loose as it grows, so the display steps tighten."
      >
        <TokenTable
          columns={["Utility", "Size / line / tracking", "Use", "Sample"]}
          rows={STEPS.map(([utility, v, use]) => ({
            name: utility,
            value: [
              cssVar(v),
              cssVar(`${v}--line-height`),
              cssVar(`${v}--letter-spacing`) || "0",
            ].join(" / "),
            use,
            sample: <span className={cn(utility, "font-medium")}>Session timeline</span>,
          }))}
        />
      </Section>
      <Section
        title="Two weights"
        intro="500 for text, 600 for emphasis. Nothing lighter: 400 disappears in a dense monochrome UI. Nothing heavier."
      >
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium">font-medium · 500 · The quick brown fox</span>
          <span className="text-lg font-semibold">font-semibold · 600 · The quick brown fox</span>
        </div>
      </Section>
      <Section
        title="Named text styles"
        intro="Seven utilities that cover the panel chrome and the page's title."
      >
        <TokenTable
          columns={["Utility", "Recipe", "Use", "Sample"]}
          rows={STYLES.map(([name, use, recipe]) => ({
            name,
            value: recipe,
            use,
            sample: (
              <span className={name}>
                {name === "code" ? "src/ui/button.tsx" : "Recent sessions"}
              </span>
            ),
          }))}
        />
      </Section>
      <Section title="Together" intro="A settings row, built only from the named styles.">
        <div className="flex max-w-md flex-col gap-3 rounded-md border border-border p-4">
          <span className="eyebrow">Telemetry</span>
          <div className="flex flex-col gap-0.5">
            <span className="heading">Share usage data</span>
            <span className="body text-secondary-foreground">
              Coarse counts of which features you use. Never prompts, paths or code.
            </span>
            <span className="caption">
              Written to <code className="code">config.toml</code> as share_telemetry.
            </span>
          </div>
        </div>
      </Section>
      <Section title="Families">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-medium">Geist · {cssVar("--font-sans").split(",")[0]}</span>
          <span className="font-mono text-xl font-medium">Geist Mono · 0123456789 → {"{}"}</span>
        </div>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Type",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
export const Page_: StoryObj = { name: "Page", render: () => <TypePage /> };

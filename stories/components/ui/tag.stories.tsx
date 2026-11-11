import type { Meta, StoryObj } from "@storybook/react-vite";
import { HueDot, LabelMark, Tag } from "../../../src/components/ui/tag.tsx";
import { HUES } from "../../../src/lib/hue.ts";
import { BUILT_IN_THEMES } from "../../lib/themes.ts";
import { contrastExempt } from "../../lib/a11y.ts";

const meta = {
  title: "Components/Tag",
  component: Tag,
  args: { children: "design", hue: "purple", dot: false },
  argTypes: { hue: { control: "select", options: HUES } },
  parameters: {
    docs: {
      description: {
        component:
          "The hue-coded identity chip, shaped like a `Badge`. A hue is an identity (the Design label), never a status; for status use `Badge`. `LabelMark` is the same identity inside a dense row — a `HueDot` and the name, no chip.",
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDot: Story = { args: { dot: true } };
export const NoHue: Story = { args: { hue: "grey", children: "unlabelled" } };

export const AllHues: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {HUES.map((hue) => (
        <Tag key={hue} {...args} hue={hue}>
          {hue}
        </Tag>
      ))}
    </div>
  ),
};

/**
 * Every hue under every built-in theme, ignoring the toolbar: each row sets
 * its own `data-theme`/`data-appearance`. A hue is its theme's palette hue of
 * that name (`hue.<name>` in keys.toml), so "orange" should read as orange in
 * every row a palette has one.
 */
export const EveryTheme: Story = {
  parameters: contrastExempt("every-theme"),
  render: (args) => (
    <div className="flex flex-col gap-1">
      {BUILT_IN_THEMES.flatMap((theme) =>
        (["dark", "light"] as const).map((appearance) => (
          <div
            key={`${theme.id}-${appearance}`}
            data-theme={theme.id}
            data-appearance={appearance}
            className="flex flex-wrap items-center gap-1.5 rounded-md bg-background px-3 py-2"
          >
            <span className="w-44 text-xs text-muted-foreground">
              {theme.name} · {appearance}
            </span>
            {HUES.map((hue) => (
              <Tag key={hue} {...args} hue={hue}>
                {hue}
              </Tag>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};

/** In a row: the dot carries identity and the chip stays out of the way. */
export const LabelMarks: Story = {
  render: () => (
    <div className="flex w-72 flex-col">
      {(
        [
          ["Refactor settings", "purple", "design"],
          ["Fix flaky terminal test", "red", "bug"],
          ["Port the timeline", "blue", "desktop"],
          ["Theme import", "green", "themes"],
        ] as const
      ).map(([title, hue, label]) => (
        <div
          key={title}
          className="flex items-center justify-between gap-2 border-b border-border-subtle px-2 py-1.5 last:border-0"
        >
          <span className="label truncate">{title}</span>
          <LabelMark hue={hue}>{label}</LabelMark>
        </div>
      ))}
    </div>
  ),
};

export const Dots: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {HUES.map((hue) => (
        <HueDot key={hue} hue={hue} />
      ))}
    </div>
  ),
};

export const LongText: Story = {
  args: { children: "design-system-and-every-theme-built-from-it" },
};

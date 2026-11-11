import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../src/ui/button.tsx";
import { Icon } from "../../src/ui/icon.tsx";
import { Kbd, KbdKeys } from "../../src/ui/kbd.tsx";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "ghost-destructive",
  "link",
  "destructive",
  "destructive-outline",
  "warning-outline",
] as const;
const SIZES = ["xs", "sm", "md", "lg"] as const;

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Continue", variant: "default", size: "md", disabled: false },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A control with a visible text label. `md` (26px) is the default. For a glyph alone, use `IconButton`.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
};

export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
/** Ghost at rest; the error tone only under the pointer. For discard and drop. */
export const GhostDestructive: Story = {
  args: { variant: "ghost-destructive", children: "Discard" },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Buttons carry no loading prop: a spinner glyph and `disabled` are the pattern. */
export const Loading: Story = {
  args: { disabled: true },
  render: (args) => (
    <Button {...args}>
      <Icon icon={Loader2} size="sm" className="animate-spin" />
      Saving…
    </Button>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <Icon icon={Plus} size="sm" />
        New session
      </Button>
      <Button {...args} variant="outline">
        Open
        <Icon icon={ArrowRight} size="sm" />
      </Button>
      <Button {...args} variant="destructive-outline">
        <Icon icon={Trash2} size="sm" />
        Discard changes
      </Button>
      <Button {...args} variant="default">
        Send
        <Kbd>↵</Kbd>
      </Button>
    </div>
  ),
};

/**
 * Keycaps inside a button. On a colour-filled variant (default, destructive)
 * the caps take their ink from the button: its text colour at full strength,
 * thinned for the fill and edge. The other variants keep the plain cap, which
 * already matches a card fill or the surface around the button.
 */
export const WithKeycaps: Story = {
  args: { size: "sm" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
          <KbdKeys keys={["⌘", "↵"]} platform="mac" />
        </Button>
      ))}
    </div>
  ),
};

/** Reached by Tab: the one keyboard ring, 2px of `--ring`, 2px out (decision 31). */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const button = within(canvasElement).getByRole("button");
    await expect(button).toHaveFocus();
    const style = getComputedStyle(button);
    await expect(style.outlineStyle).toBe("solid");
    await expect(style.outlineWidth).toBe("2px");
    await expect(style.outlineOffset).toBe("2px");
  },
};

/** `aria-pressed` reads as selected in every variant. */
export const Pressed: Story = {
  args: { variant: "ghost", "aria-pressed": true, children: "Wrap lines" },
};

export const LongText: Story = {
  args: {
    children: "Approve every pending tool call in this session and continue the run",
  },
  render: (args) => (
    <div className="flex w-64 flex-col items-start gap-2">
      <Button {...args} />
      <p className="caption">Buttons never wrap: give them room, or shorten the label.</p>
    </div>
  ),
};

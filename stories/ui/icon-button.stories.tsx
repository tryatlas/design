import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Filter,
  MicOff,
  Minus,
  PhoneOff,
  Video,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { RailGlyph } from "../../src/ui/animated-icon.tsx";
import { IconButton } from "../../src/ui/icon-button.tsx";
import { Icon } from "../../src/ui/icon.tsx";
import { Hint } from "../../src/ui/tooltip.tsx";

const VARIANTS = [
  "ghost",
  "default",
  "secondary",
  "outline",
  "hairline",
  "destructive",
  "ghost-destructive",
  "floating",
  "alert",
  "glass",
] as const;
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Primitives/IconButton",
  component: IconButton,
  args: {
    icon: Settings,
    label: "Settings",
    variant: "ghost",
    size: "md",
    shape: "square",
    active: false,
    disabled: false,
  },
  argTypes: {
    icon: { control: false },
    variant: { control: "select", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    shape: { control: "inline-radio", options: ["square", "round"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A square, icon-only button. `label` is required and becomes the `aria-label`; wrap it in `Hint` to show the same string.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {VARIANTS.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} label={variant} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {SIZES.map((size) => (
        <IconButton key={size} {...args} size={size} label={`Size ${size}`} />
      ))}
    </div>
  ),
};

/** Ghost at rest; the error tone only under the pointer. The row affordance for discard and delete. */
export const GhostDestructive: Story = {
  args: { icon: Trash2, label: "Delete", variant: "ghost-destructive" },
};

/** `active`: a setting that is on at rest, such as a filter narrowing a list. */
export const Active: Story = { args: { icon: Filter, label: "Filter", active: true } };

export const Pressed: Story = { args: { "aria-pressed": true } };

/** The stepper's shape: a pair of circles reads as one control. */
export const RoundStepper: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <IconButton {...args} icon={Minus} label="Smaller" shape="round" variant="outline" />
      <span className="label tnum w-10 text-center">100%</span>
      <IconButton {...args} icon={Plus} label="Larger" shape="round" variant="outline" />
    </div>
  ),
};

/**
 * Three disabled states. Only the last can reach its hint by keyboard,
 * because it opts into `focusableWhenDisabled`.
 */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <IconButton {...args} icon={RefreshCw} label="Refresh" disabled />
      <Hint label="Nothing to refresh yet">
        <IconButton {...args} icon={RefreshCw} label="Refresh" disabled />
      </Hint>
      <Hint label="Nothing to refresh yet">
        <IconButton {...args} icon={RefreshCw} label="Refresh" disabled focusableWhenDisabled />
      </Hint>
    </div>
  ),
};

export const WithHint: Story = {
  render: (args) => (
    <div className="flex items-center gap-1">
      <Hint label="More actions">
        <IconButton {...args} icon={MoreHorizontal} label="More actions" />
      </Hint>
      <Hint label="Close" shortcut="Esc">
        <IconButton {...args} icon={X} label="Close" />
      </Hint>
    </div>
  ),
};

/** `icon` as an element, for a glyph that is not a plain Lucide icon: a
 *  spinning refresh while a read is in flight, and the package's rail glyph.
 *  At `xs`, the 20px square of a dock or row toolbar. */
export const ElementIcon: Story = {
  args: { size: "xs" },
  render: (args) => (
    <div className="flex items-center gap-1">
      <IconButton
        {...args}
        label="Refreshing"
        icon={<Icon icon={RefreshCw} size="xs" className="animate-spin" />}
      />
      <IconButton {...args} label="Show sidebar" aria-pressed icon={<RailGlyph open size="xs" />} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const refresh = canvas.getByRole("button", { name: "Refreshing" });
    await expect(refresh.querySelector("svg")?.getAttribute("class")).toContain("animate-spin");
    await expect(refresh.getBoundingClientRect().height).toBe(
      canvas.getByRole("button", { name: "Show sidebar" }).getBoundingClientRect().height,
    );
  },
};

/** `size="2xs"`: the 16px remove button pinned to the corner of an image tile,
 *  round and outlined. */
export const TileRemove: Story = {
  args: { icon: X, label: "Remove image", size: "2xs", shape: "round", variant: "outline" },
  render: (args) => (
    <div className="relative size-16 rounded-lg border border-border bg-muted">
      <IconButton {...args} className="absolute -top-1.5 -right-1.5" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Remove image" });
    const box = button.getBoundingClientRect();
    await expect(box.width).toBe(16);
    await expect(box.height).toBe(16);
    const glyph = button.querySelector("svg")!;
    await expect(glyph.getAttribute("width")).toBe("10");
  },
};

/**
 * `variant="floating"`: desktop's image-tile remove button. Opaque and
 * bordered, so it reads over the image rather than through it.
 */
export const Floating: Story = {
  args: { icon: X, label: "Remove image", size: "2xs", shape: "round", variant: "floating" },
  render: (args) => (
    <div className="relative size-16 rounded-lg border border-border bg-linear-to-br from-primary to-success">
      <IconButton {...args} className="absolute -top-1.5 -right-1.5" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Remove image" });
    const style = getComputedStyle(button);
    // Opaque: the tile's gradient must not show through.
    // ratchet-allow: the computed value of a transparent fill, asserted against, not drawn.
    await expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(style.borderTopWidth).toBe("1px");
    await expect(style.borderTopLeftRadius).not.toBe("0px");
  },
};

/**
 * `loading`: the button's own glyph turns while its work runs, and the button
 * is `aria-busy`. It stays pressable unless you also pass `disabled`.
 */
export const Loading: Story = {
  args: { icon: RefreshCw, label: "Refresh models", loading: true, size: "xs" },
  render: (args) => (
    <div className="flex items-center gap-1">
      <IconButton {...args} />
      <IconButton {...args} label="Sync" icon={<RailGlyph open size="xs" />} />
      <IconButton {...args} label="Refresh models, idle" loading={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const busy = canvas.getByRole("button", { name: "Refresh models" });
    await expect(busy).toHaveAttribute("aria-busy", "true");
    await expect(busy.querySelector(".animate-spin svg")).not.toBeNull();
    // An element glyph turns too.
    const sync = canvas.getByRole("button", { name: "Sync" });
    await expect(sync.querySelector(".animate-spin svg")).not.toBeNull();
    const idle = canvas.getByRole("button", { name: "Refresh models, idle" });
    await expect(idle).not.toHaveAttribute("aria-busy");
    await expect(idle.querySelector(".animate-spin")).toBeNull();
  },
};

/** `variant="alert"`: a control that is on and says so (a muted microphone in a call). */
export const Alert: Story = {
  args: { icon: MicOff, label: "Unmute", variant: "alert", size: "xl", shape: "round" },
};

/**
 * `size="xl"` and `variant="glass"`: the call dock's 48px controls, floating
 * over the page in the one floating material (`glass-bar`).
 */
export const Glass: Story = {
  args: { variant: "glass", size: "xl" },
  render: (args) => (
    <div className="relative h-40 w-96 overflow-hidden rounded-lg border border-border">
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 6 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            Someone is sharing their screen, row {i + 1}
          </p>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        <IconButton {...args} icon={MicOff} label="Unmute" variant="alert" />
        <IconButton {...args} icon={Video} label="Turn camera off" />
        <IconButton {...args} icon={PhoneOff} label="Leave call" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Leave call" });
    const style = getComputedStyle(button);
    await expect(style.backdropFilter).toContain("blur");
    await expect(style.width).toBe("48px");
  },
};

/**
 * `reveal`: a row affordance that waits for its row (the nearest `group`).
 * Hidden by opacity, so it stays in the tab order: Tab reaches it, and it
 * shows while focused. Always shown on a touch screen.
 */
export const Reveal: Story = {
  args: { icon: MoreHorizontal, label: "More actions", reveal: true, size: "sm" },
  render: (args) => (
    <ul className="flex w-72 flex-col">
      {["Design review", "Launch notes", "Weekly sync"].map((title) => (
        <li
          key={title}
          className="group flex items-center justify-between rounded-md px-2 py-1 hover:bg-element-hover"
        >
          <span className="text-sm text-foreground">{title}</span>
          <IconButton {...args} label={`More actions for ${title}`} />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "More actions for Design review",
    });
    await expect(getComputedStyle(button).opacity).toBe("0");
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(button).opacity).toBe("1"));
  },
};

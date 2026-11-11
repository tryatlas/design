import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Skeleton } from "../../../src/components/ui/skeleton.tsx";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: { className: "h-3 w-48" },
  parameters: {
    docs: {
      description: {
        component:
          "A loading placeholder. Pulses opacity only; a moving shimmer repaints the whole list every frame.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A session row while it loads: the shapes of the real row, not a grey block. */
export const Loading: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  ),
};

/**
 * A whole panel standing in while its code loads: `animated={false}` holds it
 * still, so a block of rows does not pulse at the person, and `radius="md"`
 * matches the rows it stands in for.
 */
export const StaticPanel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Skeleton data-testid="default" className="h-6 w-24" />
      <div data-testid="panel" className="flex flex-col gap-2 p-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton
            key={i}
            animated={false}
            radius="md"
            className="h-6"
            style={{ width: `${78 + ((i * 13) % 22)}%` }}
          />
        ))}
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const rows = canvas
      .getByTestId("panel")
      .querySelectorAll<HTMLElement>('[data-slot="skeleton"]');
    await expect(rows).toHaveLength(6);
    const pulsing = canvas.getByTestId("default");
    await expect(getComputedStyle(pulsing).animationName).not.toBe("none");
    const sm = parseFloat(getComputedStyle(pulsing).borderTopLeftRadius);
    for (const row of rows) {
      await expect(getComputedStyle(row).animationName).toBe("none");
      await expect(parseFloat(getComputedStyle(row).borderTopLeftRadius)).toBeGreaterThan(sm);
    }
  },
};

export const Card: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2 rounded-md border border-border p-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  ),
};

/** `inline`: a `span`, for a value still loading inside a line of text. */
export const Inline: Story = {
  render: () => (
    <p className="text-sm text-secondary-foreground">
      <Skeleton inline className="h-3 w-8" /> sessions this week, across{" "}
      <Skeleton inline className="h-3 w-6" /> projects.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const placeholders = canvasElement.querySelectorAll('[data-slot="skeleton"]');
    await expect([...placeholders].map((el) => el.tagName)).toEqual(["SPAN", "SPAN"]);
  },
};

/** `radius="xl"`: stands in for something on the dialog step, a whole panel or a sheet. */
export const RadiusXl: Story = { args: { radius: "xl", className: "h-24 w-64" } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Textarea } from "../../../src/components/ui/textarea.tsx";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { placeholder: "Describe what the agent should do", disabled: false },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Multi-line text, in the same border and focus language as `Input`. It grows with its content (`field-sizing-content`) from a 4rem floor.",
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Locked while the run is going" },
};
export const Error: Story = { args: { "aria-invalid": true, defaultValue: "" } };
export const LongText: Story = {
  args: {
    defaultValue:
      "Refactor the settings panel so every row reads from one store selector. Keep the existing keyboard shortcuts, and don't touch the theme editor — it has its own store. Run the contract suites before you finish, and leave a checkpoint after each file you change so I can roll back one step at a time.",
  },
};

/** Clicked into: no outline (decision 31), the border in the ring's colour. */
export const Clicked: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("textbox");
    await userEvent.click(field);
    await expect(field).toHaveFocus();
    // Past the border's colour transition (`duration-fast`).
    await new Promise((resolve) => setTimeout(resolve, 250));
    const style = getComputedStyle(field);
    await expect(style.outlineStyle).toBe("none");
    const ring = canvasElement.ownerDocument.createElement("div");
    ring.className = "border border-ring";
    canvasElement.append(ring);
    await expect(style.borderTopColor).toBe(getComputedStyle(ring).borderTopColor);
    ring.remove();
  },
};

/** `sm`, `md` (the default) and `lg`, in step with `Input`'s sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Textarea key={size} {...args} size={size} aria-label={`Size ${size}`} />
      ))}
    </div>
  ),
};

/** `readOnly`: no field fill, secondary ink, and no focus border. */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    "aria-label": "Webhook payload",
    defaultValue: "The event body Atlas sent, kept for reference.",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CopyField } from "../../../src/components/ui/copy-field.tsx";

const meta = {
  title: "Components/CopyField",
  component: CopyField,
  args: {
    value: "https://app.tryatlas.dev/join/7f3c9a2e-41b8-4d0f-9e6a-2c5d8b1f0a47",
    onCopy: fn(async () => true),
  },
  render: (args) => (
    <div className="w-96">
      <CopyField {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "A value to hand on (an invite link, a token) with a copy button at its end. The glyph draws a check once the value is on the clipboard, and only then. `onCopy` puts it there for an app with its own bridge; without it, the browser's clipboard.",
      },
    },
  },
} satisfies Meta<typeof CopyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Copy" });
    await userEvent.click(button);
    await expect(args.onCopy).toHaveBeenCalledWith(args.value);
    await waitFor(() => expect(button).toHaveAccessibleName("Copied"));
  },
};

/** A refused copy leaves the button as it was. */
export const Refused: Story = {
  args: { onCopy: fn(async () => false) },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Copy" });
    await userEvent.click(button);
    await expect(button).toHaveAccessibleName("Copy");
  },
};

export const ShortValue: Story = { args: { value: "acme-labs" } };

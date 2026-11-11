import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import { Icon } from "../../src/ui/icon.tsx";
import { Input } from "../../src/ui/input.tsx";

const SIZES = ["xs", "sm", "md", "lg"] as const;

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { placeholder: "Search sessions", size: "md", disabled: false },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          "A single-line text field. It draws no focus outline, however it was focused: its border lifts to the ring's colour instead.",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = { args: { defaultValue: "atlas/design" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      {SIZES.map((size) => (
        <Input key={size} {...args} size={size} placeholder={`Size ${size}`} />
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Managed by your org" } };

/** `aria-invalid` turns the border to the destructive token. */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      <Input {...args} aria-invalid defaultValue="not a url" />
      <span className="caption text-error">Enter a full URL, starting with https://</span>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    defaultValue:
      "/Users/someone/Developer/work/a-very-long-project-name/src/features/settings/components/index.tsx",
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="relative">
      <Icon
        icon={Search}
        size="sm"
        className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
      />
      <Input {...args} className="pl-6" />
    </div>
  ),
};

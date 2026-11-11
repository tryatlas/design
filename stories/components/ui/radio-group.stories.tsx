import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../../../src/components/ui/label.tsx";
import { RadioCard, RadioGroup, RadioGroupItem } from "../../../src/components/ui/radio-group.tsx";
import { expect, userEvent, within } from "storybook/test";
import { contrastExempt } from "../../lib/a11y.ts";

const OPTIONS = [
  { value: "read", label: "Read-only" },
  { value: "ask", label: "Ask before writing" },
  { value: "write", label: "Read and write" },
];

interface DemoProps {
  disabled?: boolean;
  invalid?: boolean;
  options?: { value: string; label: string }[];
}

function Demo({ disabled, invalid, options = OPTIONS }: DemoProps) {
  return (
    <RadioGroup defaultValue={options[0]?.value} disabled={disabled} aria-label="Project access">
      {options.map((o) => (
        <Label key={o.value}>
          <RadioGroupItem value={o.value} aria-invalid={invalid || undefined} />
          {o.label}
        </Label>
      ))}
    </RadioGroup>
  );
}

const meta = {
  title: "Components/RadioGroup",
  component: Demo,
  args: { disabled: false, invalid: false },
  parameters: {
    docs: {
      description: {
        component:
          "One choice from a short, visible list. A 14px ring that fills with the `primary` ink when chosen; the hit area is widened invisibly.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { invalid: true } };
export const LongText: Story = {
  args: {
    options: [
      {
        value: "a",
        label: "Read every project attached to the session, including ones added later",
      },
      { value: "b", label: "Only the project the session started in" },
    ],
  },
  render: (args) => (
    <div className="w-64">
      <Demo {...args} />
    </div>
  ),
};
export const ManyItems: Story = {
  args: {
    options: ["Fast", "Balanced", "Deep", "Custom", "Inherit from project", "Inherit from org"].map(
      (label) => ({ value: label, label }),
    ),
  },
};

const PLANS = [
  { value: "auto", title: "Automatic", description: "Atlas picks the model for each turn." },
  { value: "fast", title: "Fast", description: "The quickest model, for short questions." },
  { value: "deep", title: "Deep", description: "The strongest model, for long refactors." },
];

/**
 * `RadioCard`: an option that needs a sentence. The whole card is the radio,
 * so the arrow keys move between cards.
 */
export const RadioCards: Story = {
  render: () => (
    <RadioGroup defaultValue="auto" aria-label="Model" className="w-96">
      {PLANS.map((p) => (
        <RadioCard key={p.value} value={p.value} title={p.title} description={p.description} />
      ))}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole("radio");
    await userEvent.click(radios[0]!);
    await userEvent.keyboard("{ArrowDown}");
    await expect(radios[1]).toHaveAttribute("aria-checked", "true");
  },
};

/** `density="compact"`: cards 4px apart, for a stack inside a dialog. */
export const Compact: Story = {
  render: () => (
    <RadioGroup defaultValue="read" density="compact" aria-label="Role" className="w-80">
      <RadioCard value="read" title="Viewer" description="Sees shared sessions." />
      <RadioCard value="write" title="Member" description="Runs agents and shares sessions." />
      <RadioCard value="admin" title="Admin" description="Manages members and billing." disabled />
    </RadioGroup>
  ),
  parameters: contrastExempt("disabled"),
};

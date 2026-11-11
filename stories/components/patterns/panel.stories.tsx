import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download } from "lucide-react";
import { fn } from "storybook/test";
import { DotMatrix } from "../../../src/components/patterns/dot-matrix.tsx";
import { Panel } from "../../../src/components/patterns/panel.tsx";
import { IconButton } from "../../../src/ui/icon-button.tsx";

const SERIES = [8, 14, 9, 22, 30, 14, 4, 26, 31, 19, 24, 40, 12, 8, 33, 37, 28, 45, 20, 11];

const meta = {
  title: "Patterns/Panel",
  component: Panel,
  args: {
    title: "Tokens by day",
    subtitle: "Last 20 days, every project",
    onExpand: fn(),
    onFilter: fn(),
    children: <DotMatrix values={SERIES} />,
    className: "w-96",
  },
  argTypes: { children: { control: false }, actions: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "The card of this system: `rounded-lg`, an `element-selected` hairline on `bg-card`, never a shadow. An optional top-right cluster of round ghost icon buttons (filter, expand). Settles in with `animate-card-rise` (180ms, 4px up and a fade; a fade alone under reduced motion); pass `index` to stagger a page, 30ms a panel.",
      },
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Untitled: Story = {
  args: { title: undefined, subtitle: undefined, onExpand: undefined, onFilter: undefined },
};
export const WithActions: Story = {
  args: { actions: <IconButton icon={Download} label="Export CSV" size="sm" shape="round" /> },
};
export const Empty: Story = {
  args: {
    children: (
      <div className="flex h-24 items-center justify-center">
        <span className="caption">No sessions in this period</span>
      </div>
    ),
  },
};
export const LongText: Story = {
  args: {
    title: "Tokens by day across every attached project and every agent in this workspace",
    subtitle:
      "Includes cached input, which is billed at a tenth of the rate, and excludes sessions still running",
  },
};
/**
 * `animate-card-rise`: panels settle in 4px and fade, staggered 30ms apart by
 * `index` (capped at 5). Remount the story to replay it.
 */
export const CardRise: Story = {
  render: (args) => (
    <div className="grid w-200 grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <Panel key={i} {...args} className="" index={i} title={["Tokens", "Sessions", "Spend"][i]}>
          <DotMatrix values={SERIES.slice(i * 2)} />
        </Panel>
      ))}
    </div>
  ),
};

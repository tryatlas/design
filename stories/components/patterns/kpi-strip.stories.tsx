import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DeltaChip, type KpiCell, KpiStrip } from "../../../src/components/patterns/kpi-strip.tsx";

const spark = (seed: number) =>
  Array.from({ length: 28 }, (_, i) =>
    Math.round(Math.abs(Math.sin((i + seed) / 3)) * 40 + (i % 4) * 3),
  );

const CELLS: KpiCell[] = [
  { id: "tokens", label: "Tokens", value: "1.24M", delta: 0.08, spark: spark(1) },
  { id: "sessions", label: "Sessions", value: "48", delta: -0.03, spark: spark(4) },
  { id: "cost", label: "Spend", value: "$182.40", delta: 0, detail: "Estimated from list prices" },
  { id: "agents", label: "Active agents", value: "6", delta: null, spark: spark(9) },
];

const meta = {
  title: "Patterns/KpiStrip",
  component: KpiStrip,
  args: { cells: CELLS },
  argTypes: { cells: { control: "object" } },
  parameters: {
    docs: {
      description: {
        component:
          "A headline band: figures separated by hairlines inside one card, each with an eyebrow, the number, a `DeltaChip` and an optional dot-matrix trend. More tokens is neither good nor bad, so the chip is neutral by default and informs without colour; a cell whose figure has a good direction sets `tone` (`up-good`, `down-good`).",
      },
    },
  },
} satisfies Meta<typeof KpiStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** No previous period: every chip renders nothing. */
export const NoPreviousPeriod: Story = {
  args: { cells: CELLS.map((c) => ({ ...c, delta: null })) },
};
export const Single: Story = {
  args: { cells: [CELLS[0]!] },
  decorators: [(S) => <div className="w-64">{S()}</div>],
};
export const ManyItems: Story = {
  args: {
    cells: [
      ...CELLS,
      { id: "added", label: "Lines added", value: "12,408", delta: 0.21, spark: spark(2) },
      { id: "removed", label: "Lines removed", value: "4,117", delta: 0.12, spark: spark(6) },
    ],
  },
};
export const LongText: Story = {
  args: {
    cells: [
      {
        id: "a",
        label: "Tokens across every attached project this billing period",
        value: "1,240,118,442",
        delta: 1.42,
        spark: spark(3),
      },
      ...CELLS.slice(1, 3),
    ],
  },
  decorators: [(S) => <div className="w-150">{S()}</div>],
};

export const Chips: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <DeltaChip delta={0.08} />
      <DeltaChip delta={-0.31} />
      <DeltaChip delta={0} />
      <DeltaChip delta={2.4} />
      <span className="caption">(null renders nothing:</span>
      <DeltaChip delta={null} />
      <span className="caption">)</span>
    </div>
  ),
};

/** `tone` says which way is good news; the arrow still carries direction. */
export const Tones: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-[auto_repeat(3,auto)] items-center gap-x-3 gap-y-2">
      {(["neutral", "up-good", "down-good"] as const).map((tone) => (
        <div key={tone} className="contents">
          <span className="caption">{tone}</span>
          <DeltaChip delta={0.08} tone={tone} />
          <DeltaChip delta={-0.12} tone={tone} />
          <DeltaChip delta={0} tone={tone} />
        </div>
      ))}
    </div>
  ),
};

/** A report's strip, where some figures have a good direction. */
export const WithTones: Story = {
  args: {
    cells: [
      { id: "merged", label: "Merged", value: "31", delta: 0.18, tone: "up-good", spark: spark(2) },
      {
        id: "cost",
        label: "Cost per session",
        value: "$3.80",
        delta: 0.06,
        tone: "down-good",
        spark: spark(5),
      },
      {
        id: "spend",
        label: "Spend",
        value: "$182.40",
        delta: 0.12,
        detail: "Neither good nor bad",
      },
    ],
  },
};

/**
 * In a narrow strip (a phone, a dock) the figures run two a row, and the
 * hairlines between them survive the wrap; four a row from 36rem.
 */
export const Phone: Story = {
  render: (args) => (
    <div className="w-80">
      <KpiStrip {...args} />
    </div>
  ),
};

/** Three figures: one row when wide; on a phone the odd one out takes the full row. */
export const ThreeCells: Story = {
  args: { cells: CELLS.slice(0, 3) },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <KpiStrip {...args} />
      <div className="w-80">
        <KpiStrip {...args} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [wide, narrow] = canvasElement.querySelectorAll<HTMLElement>('[data-slot="kpi-strip"]');
    const cols = (strip: HTMLElement) =>
      getComputedStyle(strip.firstElementChild!).gridTemplateColumns.split(" ").length;
    await expect(cols(wide!)).toBe(3);
    await expect(cols(narrow!)).toBe(2);
    const last = narrow!.firstElementChild!.lastElementChild!;
    await expect(getComputedStyle(last).gridColumnEnd).toBe("span 2");
  },
};

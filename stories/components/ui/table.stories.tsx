import type { Meta, StoryObj } from "@storybook/react-vite";
import { contrastExempt } from "../../lib/a11y.ts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/components/ui/table.tsx";

interface Row {
  name: string;
  sessions: number;
  tokens: string;
  cost: string;
}

const ROWS: Row[] = [
  { name: "atlas", sessions: 48, tokens: "1.2M", cost: "$18.40" },
  { name: "design", sessions: 21, tokens: "640K", cost: "$9.10" },
  { name: "server", sessions: 17, tokens: "512K", cost: "$7.75" },
  { name: "docs", sessions: 6, tokens: "88K", cost: "$1.20" },
];

interface DemoProps {
  rows?: Row[];
  caption?: string;
  footer?: boolean;
  selected?: number;
  muted?: number;
}

function Demo({ rows = ROWS, caption, footer = false, selected, muted }: DemoProps) {
  return (
    <div className="w-full max-w-xl">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead className="text-right">Sessions</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                No sessions this week.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, i) => (
              <TableRow
                key={`${r.name}-${i}`}
                data-selected={i === selected || undefined}
                data-muted={i === muted || undefined}
              >
                <TableCell className="max-w-48 truncate font-medium">{r.name}</TableCell>
                <TableCell className="text-right tabular-nums">{r.sessions}</TableCell>
                <TableCell className="text-right tabular-nums">{r.tokens}</TableCell>
                <TableCell className="text-right tabular-nums">{r.cost}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-right tabular-nums">92</TableCell>
              <TableCell className="text-right tabular-nums">2.4M</TableCell>
              <TableCell className="text-right tabular-nums">$36.45</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

const meta = {
  title: "Components/Table",
  component: Demo,
  args: { footer: false },
  argTypes: { rows: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "A data table: one hairline under the header, `eyebrow` column heads, 2rem rows that highlight whole on hover, no zebra and no vertical rules. The grid is implied by alignment.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFooter: Story = { args: { footer: true, caption: "Usage, last 7 days" } };
export const Selected: Story = { args: { selected: 1 } };
export const Empty: Story = { args: { rows: [] } };
export const LongText: Story = {
  args: {
    rows: [
      {
        name: "atlas-desktop-and-every-fork-made-from-it-by-the-team",
        sessions: 1204,
        tokens: "120.4M",
        cost: "$1,840.00",
      },
      ...ROWS,
    ],
  },
};
export const ManyItems: Story = {
  args: {
    rows: Array.from({ length: 24 }, (_, i) => ({
      ...ROWS[i % ROWS.length]!,
      name: `${ROWS[i % ROWS.length]!.name}-${i + 1}`,
    })),
  },
};

/** `data-muted`: a row shown but not in play, its cells at 50% (the one disabled look). */
export const Muted: Story = { args: { muted: 2 }, parameters: contrastExempt("disabled") };

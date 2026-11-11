import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { contrastExempt } from "../../lib/a11y.ts";
import { useState } from "react";
import { Bell, CreditCard, KeyRound, Palette, Shield, Users } from "lucide-react";
import {
  DrillInRow,
  SettingCard,
  SettingRow,
} from "../../../src/components/patterns/setting-card.tsx";
import { Badge } from "../../../src/ui/badge.tsx";
import { Button } from "../../../src/ui/button.tsx";
import { Switch } from "../../../src/ui/switch.tsx";

function LiveSwitch({
  initial,
  disabled,
  label,
}: {
  initial: boolean;
  disabled: boolean;
  label: string;
}) {
  const [on, setOn] = useState(initial);
  return <Switch checked={on} onCheckedChange={setOn} disabled={disabled} aria-label={label} />;
}

interface DemoProps {
  disabled?: boolean;
  longText?: boolean;
  many?: boolean;
  narrow?: boolean;
}

function Demo({ disabled = false, longText = false, many = false, narrow = false }: DemoProps) {
  return (
    <div className={narrow ? "w-64" : "w-120"}>
      <SettingCard>
        <SettingRow
          icon={Bell}
          label="Notify when a session finishes"
          description={
            longText
              ? "Sends a system notification when an agent finishes a turn, fails, or stops to ask for approval, but only while the window is not focused, so you are not interrupted while you watch it work"
              : "Only while the window is not focused"
          }
          control={<LiveSwitch initial disabled={disabled} label="Notify" />}
        />
        <SettingRow
          icon={Shield}
          label="Share telemetry"
          description="Coarse metadata only"
          control={<LiveSwitch initial={false} disabled={disabled} label="Telemetry" />}
        />
        <SettingRow
          icon={KeyRound}
          label="API key"
          control={
            <Button variant="outline" size="sm" disabled={disabled}>
              Replace
            </Button>
          }
        />
        <SettingRow icon={CreditCard} label="Plan" control={<Badge>Team</Badge>} />
        <DrillInRow icon={Palette} label="Theme" value="Atlas dark" disabled={disabled} />
        <DrillInRow
          icon={Users}
          label="Members"
          description="Invite teammates and set roles"
          value="12"
          disabled={disabled}
        />
        {many &&
          ["Keybindings", "Agents", "Models", "Memory", "Projects", "Billing"].map((label) => (
            <DrillInRow key={label} label={label} disabled={disabled} />
          ))}
      </SettingCard>
    </div>
  );
}

const meta = {
  title: "Patterns/SettingCard",
  component: Demo,
  args: { disabled: false, longText: false, many: false, narrow: false },
  parameters: {
    docs: {
      description: {
        component:
          "The atom of every settings surface: a hairline card of divided rows. `SettingRow` is a label, optional description and exactly one control hard-right; `DrillInRow` navigates, and the whole row is the target. Rows are `min-h`, so a long description grows the row, and on a narrow screen the control wraps under its label.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { longText: true } };
export const ManyItems: Story = { args: { many: true } };
/** At a phone's width the control drops under its label rather than crushing it. */
export const Narrow: Story = { args: { narrow: true } };

/**
 * `SettingRow disabled` with a `disabledReason`: the words at 50%, the
 * control inert at 50% (once each, never 25%), and the reason in a hint on
 * the control, which keeps one tab stop for it.
 */
export const DisabledRow: Story = {
  render: () => (
    <div className="w-120">
      <SettingCard>
        <SettingRow
          label="Email me a daily summary"
          description="One message at 9am with what your agents did."
          control={<LiveSwitch initial={false} disabled={false} label="Daily summary" />}
        />
        <SettingRow
          label="Include sessions shared with me"
          description="Adds your teammates' shared sessions to the summary."
          disabled
          disabledReason="Turn on the daily summary first"
          control={<LiveSwitch initial disabled={false} label="Include shared sessions" />}
        />
      </SettingCard>
    </div>
  ),
  parameters: contrastExempt("disabled"),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector<HTMLElement>(
      '[data-slot="setting-row"][data-disabled]',
    )!;
    await expect(row.querySelector("[inert]")).not.toBeNull();
    await userEvent.tab();
    await userEvent.tab();
    await expect(row.contains(document.activeElement)).toBe(true);
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCardIcon, KeyIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { expect } from "storybook/test";
import {
  DrillInRow,
  SettingCard,
  SettingRow,
} from "../../../src/components/patterns/setting-card.tsx";
import { PageHeader, SectionHeader } from "../../../src/components/patterns/section-header.tsx";
import {
  RailGroup,
  RailLink,
  type SettingsNavGroup,
  SettingsShell,
} from "../../../src/components/shell/settings-shell.tsx";
import { Input } from "../../../src/ui/input.tsx";
import { Switch } from "../../../src/ui/switch.tsx";
import { LONG_ORG, ORGS, SETTINGS_GROUPS, StoryLinks } from "./fixtures.tsx";

function Toggle({ label, initial }: { label: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return <Switch checked={on} onCheckedChange={setOn} aria-label={label} />;
}

/** A settings page as an app fills it: a header, then cards of rows. */
function GeneralPage({ long }: { long?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="General" description="How the workspace looks to everyone in it." />
      <section>
        <SectionHeader title="Workspace" />
        <SettingCard>
          <SettingRow
            label="Name"
            description="Shown in the switcher and on invites."
            control={<Input defaultValue={long ? LONG_ORG.name : "Atlas"} aria-label="Name" />}
          />
          <SettingRow
            label="Share sessions with the team by default"
            description={
              long
                ? "New sessions are visible to every member of the workspace as soon as they start, including their transcript, tool calls, checkpoints and any files the agent reads. You can still make a single session private from its header."
                : "Members see new sessions as they start."
            }
            control={<Toggle label="Share by default" initial />}
          />
          <SettingRow
            label="Share telemetry"
            description="Coarse usage metadata only."
            control={<Toggle label="Share telemetry" initial={false} />}
          />
        </SettingCard>
      </section>
      <section>
        <SectionHeader title="Manage" />
        <SettingCard>
          <DrillInRow icon={UsersIcon} label="Members" value="14" />
          <DrillInRow icon={KeyIcon} label="API keys" value="3 active" />
          <DrillInRow icon={CreditCardIcon} label="Billing" description="Team plan, renews 1 Dec" />
        </SettingCard>
      </section>
    </div>
  );
}

interface DemoProps {
  groups: SettingsNavGroup[];
  pathname?: string;
  long?: boolean;
  wide?: boolean;
}

function Demo({ groups, pathname = "/settings", long = false, wide = false }: DemoProps) {
  return (
    <StoryLinks pathname={pathname}>
      <SettingsShell
        org={long ? LONG_ORG : ORGS[0]!}
        groups={groups}
        backHref="/sessions"
        wide={wide}
      >
        <GeneralPage long={long} />
      </SettingsShell>
    </StoryLinks>
  );
}

const MANY_GROUPS: SettingsNavGroup[] = [
  ...SETTINGS_GROUPS,
  ...["Agents", "Developer", "Danger zone"].map((label) => ({
    label,
    items: SETTINGS_GROUPS[0]!.items.map((i) => ({ ...i, to: `${i.to}/${label}` })),
  })),
];

const meta = {
  title: "Shell/SettingsShell",
  component: Demo,
  args: { groups: SETTINGS_GROUPS, pathname: "/settings", long: false, wide: false },
  argTypes: { groups: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Settings as a mode: a back link and the workspace on the canvas, the sections in a curved rail (`RailGroup`s of `RailLink`s), and the page in a curved panel beside it, capped at a reading width.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { groups: [] } };
export const LongText: Story = { args: { long: true } };
/** The rail scrolls under fades. */
export const ManyItems: Story = { args: { groups: MANY_GROUPS } };

/** The rail's parts alone. */
export const Rail: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <StoryLinks pathname="/settings/members">
      <div className="w-56">
        <RailLink to="/sessions">Back to app</RailLink>
        <RailGroup {...SETTINGS_GROUPS[0]!} />
      </div>
    </StoryLinks>
  ),
};

/** `wide`: a page that lays plans or columns side by side gets 72rem, not 40rem. */
export const Wide: Story = { args: { wide: true } };

/**
 * On a page under a section (Billing → Plans), the section stays lit: the
 * row is the longest one the path sits under, so General (`/settings`) does
 * not light for every page.
 */
export const SubPage: Story = {
  args: { pathname: "/settings/billing/plans" },
  play: async ({ canvasElement }) => {
    // Both rails, the phone row and the column, whichever is showing.
    const lit = canvasElement.querySelectorAll('nav[aria-label="Settings"] [aria-current="page"]');
    await expect([...lit].map((a) => a.textContent)).toEqual(["Billing", "Billing"]);
  },
};

/** Below `md` the sections run across the top in a line that scrolls sideways. */
export const Phone: Story = {
  args: { pathname: "/settings/members" },
  globals: { viewport: { value: "phone" } },
};

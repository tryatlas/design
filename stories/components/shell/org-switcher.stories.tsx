import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { OrgMark, OrgSwitcher } from "../../../src/components/shell/org-switcher.tsx";
import type { Organisation } from "../../../src/lib/types.ts";
import { LONG_ORG, MANY_ORGS, ORGS, StoryLinks, USER } from "./fixtures.tsx";

/** A logo as a data URI, so the story never reaches the network. */
const LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    // ratchet-allow: the fixture logo is an image file, and an image carries its own colours.
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3b5bdb"/><path d="M5 14 10 5l5 9z" fill="#fff"/></svg>`,
  );

interface DemoProps {
  org: Organisation;
  orgs: Organisation[];
  email: string;
  collapsed?: boolean;
  plan?: string;
  loading?: boolean;
  numberKeys?: boolean;
  shortcuts?: boolean;
  onOrgChange: (id: string) => void;
  onLogOut?: () => void;
  onCreateOrg?: () => void;
  onInvite?: () => void;
}

function Demo({ org, orgs, onOrgChange, ...props }: DemoProps) {
  const [active, setActive] = useState(org);
  return (
    <StoryLinks>
      <div className="min-h-96 w-56 rounded-lg bg-sidebar p-2">
        <OrgSwitcher
          {...props}
          org={active}
          orgs={orgs}
          settingsHref="/settings"
          onOrgChange={(id) => {
            setActive(orgs.find((o) => o.id === id) ?? active);
            onOrgChange(id);
          }}
        />
      </div>
    </StoryLinks>
  );
}

const open: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button"));
  // Wait for the menu, so the axe run sees it open rather than racing the click.
  await screen.findByRole("menu");
};

/** Open the menu, then the workspace submenu. */
const openSubmenu: Story["play"] = async (context) => {
  await open(context);
  const item = await within(document.body).findByText("Switch workspace");
  await userEvent.click(item);
  await screen.findByRole("menuitem", { name: /Create or join a workspace/ });
};

const meta = {
  title: "Shell/OrgSwitcher",
  component: Demo,
  args: {
    org: ORGS[0]!,
    orgs: ORGS,
    email: USER.email,
    collapsed: false,
    onOrgChange: fn(),
    onLogOut: fn(),
    onCreateOrg: fn(),
  },
  argTypes: { org: { control: false }, orgs: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "The workspace switcher at the top of the rail. The menu carries Settings, members and Log out; switching is a submenu headed by the account email. `OrgMark` is the workspace's initials tile, also used by `SettingsShell`.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { play: open, tags: ["!autodocs"] };
export const SwitchWorkspace: Story = { play: openSubmenu, tags: ["!autodocs"] };
export const Collapsed: Story = {
  args: { collapsed: true },
};
export const LongText: Story = { args: { org: LONG_ORG, orgs: [LONG_ORG, ...ORGS] } };
export const ManyItems: Story = {
  args: { orgs: MANY_ORGS },
  play: openSubmenu,
  tags: ["!autodocs"],
};

/** Each workspace's own logo in place of its initials. */
export const Logos: Story = {
  args: (() => {
    const orgs = ORGS.map((o, i) => (i === 0 ? { ...o, logo: LOGO } : o));
    return { org: orgs[0]!, orgs };
  })(),
  play: openSubmenu,
  tags: ["!autodocs"],
};
/** The plan's name after the member count. */
export const Plan: Story = { args: { plan: "Team" } };
/** The member count is still loading: a placeholder holds its line. */
export const Loading: Story = { args: { loading: true } };
/** `onInvite` opens the host's dialog; Manage members stays a link. */
export const InviteDialog: Story = {
  args: { onInvite: fn() },
  play: async (context) => {
    await open(context);
    await userEvent.click(await screen.findByRole("menuitem", { name: /Invite people/ }));
    await expect(context.args.onInvite).toHaveBeenCalled();
    // Let the menu finish closing, so the axe run sees the page at rest.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
  tags: ["!autodocs"],
};
/** A host with no keyboard shortcuts hides the hints. */
export const NoShortcuts: Story = { args: { shortcuts: false }, play: open, tags: ["!autodocs"] };
/** With the list open, a number switches to that workspace. */
export const NumberKeys: Story = {
  args: { numberKeys: true },
  play: async (context) => {
    await openSubmenu(context);
    // Focus inside the workspace list, where the number keys listen.
    (await screen.findByRole("menuitem", { name: /Create or join a workspace/ })).focus();
    await userEvent.keyboard("2");
    await expect(context.args.onOrgChange).toHaveBeenCalledWith(ORGS[1]!.id);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
  tags: ["!autodocs"],
};

/** The mark alone, at its two sizes, with initials and with a logo. */
export const Mark: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <OrgMark initials="AT" />
      <OrgMark initials="NL" className="size-6 rounded-md text-3xs" />
      <OrgMark initials="AT" logo={LOGO} />
      <OrgMark initials="AT" logo={LOGO} className="size-6 rounded-md" />
    </div>
  ),
};

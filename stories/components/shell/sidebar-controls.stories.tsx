import type { Meta, StoryObj } from "@storybook/react-vite";
import { MonitorIcon } from "lucide-react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../../src/ui/dropdown-menu.tsx";
import { Icon } from "../../../src/ui/icon.tsx";
import {
  InfoMenu,
  type InfoLinks,
  ProfileMenu,
} from "../../../src/components/shell/sidebar-controls.tsx";
import { StoryLinks, USER } from "./fixtures.tsx";

const ALL_LINKS: InfoLinks = {
  docs: "#",
  feedback: "#",
  github: "#",
  discord: "#",
  x: "#",
  download: "#",
  website: "#",
};

interface DemoProps {
  user: { name: string; email: string; image?: string | null };
  links: InfoLinks;
  privacy?: boolean;
  shortcuts?: boolean;
  onLogOut: () => void;
  onFeedback?: () => void;
  /** Show the host's own submenus (theme, interface size). */
  extras?: boolean;
}

/** A host submenu: the shape a theme or interface-size picker takes. */
function HostSub({ label, options }: { label: string; options: string[] }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Icon icon={MonitorIcon} size="sm" />
        {label}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup defaultValue={options[0]}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o} value={o}>
              {o}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/** The rail footer: you on the left, the help menu on the right. Menus open upward. */
function Demo({
  user,
  links,
  privacy = true,
  shortcuts = true,
  onLogOut,
  onFeedback,
  extras = false,
}: DemoProps) {
  return (
    <StoryLinks>
      <div className="flex min-h-96 items-end">
        <div className="flex w-56 items-center justify-between rounded-xl border border-border bg-background p-2">
          <ProfileMenu
            user={user}
            accountHref="/settings/profile"
            privacyHref={privacy ? "/settings/privacy" : undefined}
            onLogOut={onLogOut}
          >
            {extras && <HostSub label="Theme" options={["System", "Light", "Dark"]} />}
          </ProfileMenu>
          <InfoMenu
            links={links}
            settingsHref="/settings"
            onShortcuts={shortcuts ? () => {} : undefined}
            onFeedback={onFeedback}
          >
            {extras && <HostSub label="Interface size" options={["Default", "Large"]} />}
          </InfoMenu>
        </div>
      </div>
    </StoryLinks>
  );
}

const openProfile: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: /account/ }));
  // Wait for the menu, so the axe run sees it open rather than racing the click.
  await screen.findByRole("menu");
};
const openInfo: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Help and links" }));
  await screen.findByRole("menu");
};

const meta = {
  title: "Shell/SidebarControls",
  component: Demo,
  args: { user: USER, links: ALL_LINKS, privacy: true, shortcuts: true, onLogOut: fn() },
  argTypes: { links: { control: "object" } },
  parameters: {
    docs: {
      description: {
        component:
          "The rail footer's two menus. `ProfileMenu` is you: your avatar, account settings, privacy, log out. `InfoMenu` is help and the community; a link the caller leaves out is left out of the menu.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ProfileOpen: Story = {
  play: openProfile,
  tags: ["!autodocs"],
};
export const InfoOpen: Story = {
  play: openInfo,
  tags: ["!autodocs"],
};
/** Only docs and feedback: the community and download groups drop out. */
export const InfoFewLinks: Story = {
  args: { links: { docs: "#", feedback: "#" }, shortcuts: false },
  play: openInfo,
  tags: ["!autodocs"],
};
export const LongText: Story = {
  args: {
    user: {
      name: "Maximiliana Alexandrovna Konstantinopoulou",
      email: "maximiliana.konstantinopoulou@infrastructure-working-group.example.com",
    },
  },
  play: openProfile,
  tags: ["!autodocs"],
};
/** The host's own submenus, passed as children: Theme in the profile menu. */
export const HostSubmenus: Story = {
  args: { extras: true },
  play: async (context) => {
    await openProfile(context);
    await screen.findByRole("menuitem", { name: /Theme/ });
  },
  tags: ["!autodocs"],
};
/** Interface size in the help menu. */
export const InfoHostSubmenus: Story = {
  args: { extras: true },
  play: async (context) => {
    await openInfo(context);
    await screen.findByRole("menuitem", { name: /Interface size/ });
  },
  tags: ["!autodocs"],
};
/** Send feedback opens the host's own form instead of following a link. */
export const FeedbackDialog: Story = {
  args: { onFeedback: fn() },
  play: async (context) => {
    await openInfo(context);
    await userEvent.click(await screen.findByRole("menuitem", { name: /Send feedback/ }));
    await expect(context.args.onFeedback).toHaveBeenCalled();
    // Let the menu finish closing, so the axe run sees the page at rest.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
  tags: ["!autodocs"],
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FileText, MessageSquare, Plus, Settings } from "lucide-react";
import {
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandFooterHint,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandPanel,
  CommandShortcut,
  CommandSubmenuChevron,
} from "../../src/ui/command.tsx";
import { Button } from "../../src/ui/button.tsx";
import { DialogTrigger } from "../../src/ui/dialog.tsx";
import { Icon } from "../../src/ui/icon.tsx";
import { Kbd } from "../../src/ui/kbd.tsx";
import { contrastExempt } from "../lib/a11y.ts";

const ROWS = [
  { icon: Plus, label: "New session", shortcut: "⌘N" },
  { icon: MessageSquare, label: "Open session…", submenu: true },
  { icon: FileText, label: "Open file…", shortcut: "⌘P" },
  { icon: Settings, label: "Settings", shortcut: "⌘,", disabled: false },
];

interface DemoProps {
  defaultOpen?: boolean;
  query?: string;
  active?: number;
  empty?: boolean;
  disabledRow?: boolean;
}

function Demo({ defaultOpen, query = "", active = 0, empty, disabledRow }: DemoProps) {
  return (
    <CommandDialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Open palette <Kbd>⌘K</Kbd>
      </DialogTrigger>
      <CommandDialogPopup title="Command palette">
        <CommandInput
          placeholder="Type a command or search…"
          defaultValue={query}
          aria-label="Command"
          aria-controls="command-demo-list"
        />
        <CommandPanel id="command-demo-list" aria-label="Commands">
          {empty ? (
            <CommandEmpty>No results for “{query}”</CommandEmpty>
          ) : (
            <>
              <CommandGroupLabel>Actions</CommandGroupLabel>
              {ROWS.map((row, i) => (
                <CommandItem
                  key={row.label}
                  active={i === active}
                  disabled={disabledRow && i === ROWS.length - 1}
                >
                  <CommandItemIcon>
                    <Icon icon={row.icon} size="lg" />
                  </CommandItemIcon>
                  {row.label}
                  {row.shortcut && <CommandShortcut>{row.shortcut}</CommandShortcut>}
                  {row.submenu && <CommandSubmenuChevron />}
                </CommandItem>
              ))}
            </>
          )}
        </CommandPanel>
        <CommandFooter>
          <CommandFooterHint>
            <Kbd variant="soft">↑</Kbd>
            <Kbd variant="soft">↓</Kbd>
            Navigate
          </CommandFooterHint>
          <span className="flex items-center gap-4">
            <CommandFooterHint>
              <Kbd variant="soft">↵</Kbd>
              Select
            </CommandFooterHint>
            <CommandFooterHint>
              <Kbd variant="soft">Esc</Kbd>
              Close
            </CommandFooterHint>
          </span>
        </CommandFooter>
      </CommandDialogPopup>
    </CommandDialog>
  );
}

const meta = {
  title: "Primitives/Command",
  component: Demo,
  args: { defaultOpen: false, query: "", active: 0, empty: false, disabledRow: false },
  argTypes: { active: { control: { type: "number", min: 0, max: 3 } } },
  parameters: {
    docs: {
      description: {
        component:
          "The command shell ⌘K, ⌘P and the new-tab palette open. No open animation on purpose: it opens hundreds of times a day. The caller owns the keyboard model and passes `active` to the highlighted row.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] };
export const Empty: Story = {
  args: { defaultOpen: true, empty: true, query: "deploy to prod" },
  tags: ["!autodocs"],
};
export const DisabledRow: Story = {
  args: { defaultOpen: true, disabledRow: true },
  tags: ["!autodocs"],
};

const SLASH_ROWS = [
  { name: "compact", description: "Summarise the session so far and start fresh" },
  { name: "review", description: "Review the changes on this branch" },
  { name: "init", description: "Write an AGENTS.md for this project" },
  { name: "login", description: "Sign in to the agent's provider" },
];

/** The inline picker's panel, as desktop draws it under the caret. */
function InlinePicker({ listbox, active = 1 }: { listbox: boolean; active?: number }) {
  return (
    <div className="flex w-[420px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div
        role={listbox ? "listbox" : undefined}
        aria-label={listbox ? "Slash commands" : undefined}
        className="py-1"
      >
        <CommandGroupLabel size="compact">Commands</CommandGroupLabel>
        {SLASH_ROWS.map((row, i) => (
          <CommandItem
            key={row.name}
            size="compact"
            listbox={listbox}
            active={i === active}
            disabled={row.name === "login"}
          >
            <span className="min-w-20 shrink-0 font-mono text-foreground">/{row.name}</span>
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {row.description}
            </span>
          </CommandItem>
        ))}
      </div>
      <CommandFooter size="compact">
        <span className="flex items-center gap-1.5">
          <Kbd>↑↓</Kbd>
          navigate
          <Kbd>↵</Kbd>
          select
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd>
          close
        </span>
      </CommandFooter>
    </div>
  );
}

/** `size="compact"` on `CommandGroupLabel`, `CommandItem` and `CommandFooter`:
 *  the inline slash and @-mention pickers. 26px rows, flush to the panel's
 *  edges, lit on hover as well as by `active`. Roles are unchanged: each row is
 *  still an `option`. */
export const Compact: Story = {
  render: () => <InlinePicker listbox />,
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    const options = canvasElement.querySelectorAll('[role="option"]');
    await expect(options).toHaveLength(SLASH_ROWS.length);
    for (const option of options) {
      await expect(option.getBoundingClientRect().height).toBe(26);
    }
    await expect(options[1]).toHaveAttribute("aria-selected", "true");
    await expect(options[3]).toHaveAttribute("aria-disabled", "true");
    const footer = canvasElement.querySelector('[data-slot="command-footer"]')!;
    await expect(footer.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
  },
};

/** `listbox={false}`: the same rows with no `option` role and no
 *  `aria-selected`, for a picker that is not a listbox yet (ATL-718).
 *  `data-active` and `data-disabled` still mark the rows. */
export const CompactWithoutRoles: Story = {
  parameters: contrastExempt("disabled"),
  render: () => <InlinePicker listbox={false} />,
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[role="option"]')).toHaveLength(0);
    await expect(canvasElement.querySelectorAll("[aria-selected]")).toHaveLength(0);
    const rows = canvasElement.querySelectorAll('[data-slot="command-item"]');
    await expect(rows[1]).toHaveAttribute("data-active", "true");
    await expect(rows[3]).toHaveAttribute("data-disabled", "true");
    await expect(rows[3]).not.toHaveAttribute("aria-disabled");
  },
};

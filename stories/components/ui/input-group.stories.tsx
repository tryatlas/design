import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUp, Copy, Search, X } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../../src/components/ui/input-group.tsx";
import { Icon } from "../../../src/ui/icon.tsx";
import { Kbd } from "../../../src/ui/kbd.tsx";
import { contrastExempt } from "../../lib/a11y.ts";

interface DemoProps {
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}

function Demo({
  placeholder = "Search sessions",
  defaultValue,
  disabled,
  invalid,
  autoFocus,
}: DemoProps) {
  return (
    <div className="w-80">
      <InputGroup data-disabled={disabled || undefined}>
        <InputGroupAddon>
          <Icon icon={Search} size="sm" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          autoFocus={autoFocus}
        />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const meta = {
  title: "Components/InputGroup",
  component: Demo,
  args: { placeholder: "Search sessions", disabled: false, invalid: false },
  parameters: {
    docs: {
      description: {
        component:
          "An input with things attached: a leading glyph, a trailing shortcut or button, a block of text above or below. One border around the lot, which strengthens while the control inside has focus.",
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: { disabled: true },
  parameters: contrastExempt("disabled"),
};

/** One ring around the group, the input drawing none and the border at rest. */
async function expectOneRing(canvasElement: HTMLElement, input: HTMLElement) {
  // Past the border's colour transition (`duration-fast`), so the check
  // reads where the border settles, not where it started.
  await new Promise((resolve) => setTimeout(resolve, 250));
  const group = canvasElement.querySelector<HTMLElement>('[data-slot="input-group"]')!;
  const groupStyle = getComputedStyle(group);
  // The ring: the group's outline.
  await expect(groupStyle.outlineStyle).toBe("solid");
  // Not a second ring: the input draws none, and the group's border stays at rest.
  await expect(getComputedStyle(input).outlineStyle).toBe("none");
  const rest = canvasElement.ownerDocument.createElement("div");
  rest.className = "border border-border";
  canvasElement.append(rest);
  await expect(groupStyle.borderTopColor).toBe(getComputedStyle(rest).borderTopColor);
  rest.remove();
}

/**
 * Focused on mount, as a search field in a menu or a dialog is: one ring
 * around the whole field, and no second edge from the border lifting inside it.
 */
export const Autofocused: Story = {
  args: { autoFocus: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox");
    await waitFor(() => expect(input).toHaveFocus());
    await expectOneRing(canvasElement, input);
  },
};

/** Focused by a click: a text field is `:focus-visible` this way too, so it is the same one ring. */
export const Clicked: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expectOneRing(canvasElement, input);
  },
};
export const Error: Story = { args: { invalid: true, defaultValue: "status:unknown" } };
export const LongText: Story = {
  args: {
    defaultValue:
      "sessions where the agent touched src/features/settings and the run failed after a checkpoint",
  },
};

export const WithButton: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput readOnly defaultValue="https://atlas.dev/s/7f3a9c" aria-label="Link" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput defaultValue="atlas.dev" aria-label="Domain" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear">
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/** A composer: the textarea grows; the actions sit in a block-end addon. */
export const Textarea: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupTextarea placeholder="Ask the agent to…" aria-label="Message" />
        <InputGroupAddon align="block-end">
          <InputGroupText>Balanced · 3 projects</InputGroupText>
          <InputGroupButton variant="default" size="icon-xs" className="ml-auto" aria-label="Send">
            <ArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

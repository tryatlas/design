import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, GitBranch, Sparkles, TriangleAlert } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "../../src/lib/utils.ts";
import { Badge } from "../../src/ui/badge.tsx";
import { Button } from "../../src/ui/button.tsx";
import { Icon } from "../../src/ui/icon.tsx";
import { FoundationLink, Page, Section } from "./kit.tsx";

/**
 * Atlas's design language, drafted from desktop's design-system reference,
 * its `src/ui` primitives and tokens, the session timeline and usage panels,
 * and the old standards README. Every do/don't pair is drawn with live tokens,
 * so it holds in every theme on the toolbar.
 */

interface Principle {
  /** The heading anchor a story cites (`Principles#rings-not-shadows`). Stable: never rename one. */
  id: string;
  title: string;
  rule: string;
  why: string;
  good: ReactNode;
  bad: ReactNode;
  roles: string[];
  /** The foundations pages that hold the scales and roles, by title. */
  pages: string[];
  /** Set when desktop does not do this yet: what is missing. */
  proposed?: string;
}

/** A small session card, the thing most principles are shown on. */
function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex w-56 flex-col gap-1 rounded-md p-3", className)}>{children}</div>;
}

const PRINCIPLES: Principle[] = [
  {
    id: "achromatic-surfaces",
    title: "Achromatic surfaces",
    pages: ["Colour"],
    rule: "Surfaces are greys from the theme's own ground. Colour never fills a panel.",
    why: "Atlas shows other people's code, diffs and output all day. Neutral surfaces keep that content the loudest thing on screen, and let one theme seed recolour everything.",
    good: (
      <Card className="border border-border bg-card">
        <span className="label">Refactor settings</span>
        <span className="caption">atlas · 2h ago</span>
      </Card>
    ),
    bad: (
      <Card className="border border-info bg-info-muted">
        <span className="label text-info">Refactor settings</span>
        <span className="caption text-info">atlas · 2h ago</span>
      </Card>
    ),
    roles: ["background", "card", "popover", "muted", "sidebar", "panel.background"],
  },
  {
    id: "hairline-rules",
    title: "Hairline rules",
    pages: ["Colour"],
    rule: "Edges and dividers are one pixel, in the border roles. Never thicker.",
    why: "A dense UI has many edges. At 1px they group things without competing with the text inside them. Three strengths are enough: subtle, border, strong.",
    good: (
      <div className="w-56 rounded-md border border-border">
        {["Tokens", "Cost", "Sessions"].map((r) => (
          <div key={r} className="label border-b border-border-subtle px-3 py-1.5 last:border-b-0">
            {r}
          </div>
        ))}
      </div>
    ),
    bad: (
      <div className="w-56 rounded-md border-2 border-border-strong">
        {["Tokens", "Cost", "Sessions"].map((r) => (
          <div
            key={r}
            className="label border-b-2 border-border-strong px-3 py-1.5 last:border-b-0"
          >
            {r}
          </div>
        ))}
      </div>
    ),
    roles: ["border", "border.subtle", "border.strong", "sidebar-border"],
  },
  {
    id: "rings-not-shadows",
    title: "Rings instead of shadows",
    pages: ["Elevation"],
    rule: "Something raised inside content gets a hairline. Only what floats over content casts a shadow.",
    why: "A shadow says 'this is above the page'. Spent on every card, it stops meaning anything, and on near-black it is invisible anyway. Menus and popovers cast shadow-md; dialogs and the command palette cast shadow-lg. shadow-sm is for small things that sit just off a surface, like a slider thumb.",
    good: (
      <Card className="border border-border bg-card">
        <span className="label">Checkpoint 3</span>
        <span className="caption">12 files changed</span>
      </Card>
    ),
    bad: (
      <Card className="bg-card shadow-lg">
        <span className="label">Checkpoint 3</span>
        <span className="caption">12 files changed</span>
      </Card>
    ),
    roles: [
      "border",
      "shadow-sm (raised)",
      "shadow-md (menu)",
      "shadow-lg (dialog)",
      "element.highlight",
    ],
  },
  {
    id: "hue-means-identity",
    title: "Hue only where something has an identity",
    pages: ["Colour"],
    rule: "Colour carries status or identity: a failed run, a project, a chart series. Nothing else.",
    why: "If colour only ever means something, people learn to read it. The primary is the theme's ink unless a theme says otherwise, so the loudest button is still monochrome.",
    good: (
      <div className="flex flex-col items-start gap-2">
        <Badge variant="success">
          <Icon icon={CircleCheck} size="xs" />
          Passed
        </Badge>
        <span className="label inline-flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-chart-4" />
          design
        </span>
        <Button size="sm">Continue</Button>
      </div>
    ),
    bad: (
      <div className="flex flex-col items-start gap-2">
        <Badge variant="info">
          <Icon icon={Sparkles} size="xs" />
          New
        </Badge>
        <span className="label inline-flex items-center gap-1.5 text-chart-3">
          <Icon icon={GitBranch} size="sm" />
          main
        </span>
        <Button size="sm" variant="warning-outline">
          Continue
        </Button>
      </div>
    ),
    roles: ["status.*.foreground", "status.*.background", "chart-1…5", "primary", "destructive"],
  },
  {
    id: "dense-type",
    title: "Dense type in two weights",
    pages: ["Type"],
    rule: "Text is small and set in 500 or 600. Controls are 11px; body is 13px. Tracking follows size: headings tighten, eyebrows open up.",
    why: "Atlas is a tool people keep open next to their work, so it fits a lot on screen. 400 vanishes at these sizes and 700 shouts; two weights give hierarchy without either. One letter-spacing can't be right at every size: large text reads loose unless it is tightened, small caps read cramped unless they are opened.",
    good: (
      <div className="flex w-56 flex-col gap-0.5">
        <span className="text-sm font-semibold">Usage this week</span>
        <span className="text-xs font-medium text-secondary-foreground">
          1.2M tokens across 48 sessions
        </span>
      </div>
    ),
    bad: (
      <div className="flex w-56 flex-col gap-0.5">
        <span className="text-xl font-bold">Usage this week</span>
        <span className="text-md font-light text-secondary-foreground">
          1.2M tokens across 48 sessions
        </span>
      </div>
    ),
    roles: ["text-xs", "text-sm", "text-base", "font-medium (500)", "font-semibold (600)"],
  },
  {
    id: "named-text-styles",
    title: "Named text styles before ad-hoc combos",
    pages: ["Type"],
    rule: "Reach for eyebrow, label, body, caption, code or heading before a size, a weight and a colour.",
    why: "Three classes picked at each call site is how an app ends up with a thousand slightly different labels. A name keeps the same thing looking the same everywhere.",
    good: (
      <div className="flex w-56 flex-col gap-1">
        <span className="eyebrow">Recent</span>
        <span className="label">Refactor settings</span>
        <span className="caption">atlas · 2h ago</span>
      </div>
    ),
    bad: (
      <div className="flex w-56 flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-secondary-foreground">
          RECENT
        </span>
        <span className="text-sm font-semibold">Refactor settings</span>
        <span className="text-xs text-disabled">atlas · 2h ago</span>
      </div>
    ),
    roles: ["eyebrow", "label", "body", "caption", "code", "heading"],
  },
  {
    id: "scales-not-measurements",
    title: "Scales, never measurements",
    pages: ["Control heights", "Spacing", "Type", "Radius", "Z-index", "Motion"],
    rule: "Write the step's name: h-control-md, rounded-lg, z-popover. The number lives in one file.",
    why: "A measurement typed at a call site drifts by a pixel at a time and cannot follow a theme. A named step moves with the system, and the ratchet can see it.",
    good: (
      <div className="flex flex-col items-start gap-2">
        <code className="code">h-control-md rounded-sm</code>
        <div className="flex h-control-md items-center rounded-sm border border-border px-2.5">
          <span className="label">26px control</span>
        </div>
      </div>
    ),
    bad: (
      <div className="flex flex-col items-start gap-2">
        {/* ratchet-allow: this is the don't half of a do/don't pair, so it spells out the arbitrary radius the rule forbids. */}
        <code className="code">h-[27px] rounded-[5px]</code>
        {/* ratchet-allow: the anti-pattern rendered on purpose, so a reader sees the one-pixel drift it causes. */}
        <div className="flex h-[27px] items-center rounded-[5px] border border-border px-[11px]">
          <span className="label">27px control</span>
        </div>
      </div>
    ),
    roles: ["--control-*", "--radius-*", "--z-*", "--text-*", "--duration-*"],
  },
  {
    id: "animate-by-frequency",
    title: "Animate by how often it's seen",
    pages: ["Motion"],
    rule: "What people do many times a day doesn't move. What they see now and then gets a short ease-out, under 300ms. Nothing appears from nothing.",
    why: "An animation on a frequent action stops reading as motion and starts reading as latency. The command palette and every keyboard-initiated action open instantly. Menus, popovers and dialogs scale in from 0.95 with opacity over 150ms, because something that grows out of scale(0) looks like it came from nowhere. When a shortcut opens a dialog, popover or sheet, pass `instant` and it skips its entrance and exit.",
    good: <PaletteDemo instant />,
    bad: <PaletteDemo />,
    roles: [
      "duration-instant",
      "duration-fast",
      "duration-base",
      "ease-out-strong",
      "animate-scale-in",
    ],
  },
  {
    id: "interruptible-motion",
    title: "Motion that can be interrupted",
    pages: ["Motion"],
    rule: "Anything that moves between positions can be caught mid-flight and sent back. It starts from where it is, never from where it was going.",
    why: "People change their minds faster than an animation finishes. A transition or a spring retargets from the current value; a keyframe restarts from zero and jumps. Popovers grow out of their trigger and leave the way they came, so a menu always looks attached to what opened it. Springs settle without bouncing unless the user threw something.",
    good: <SwitchDemo interruptible />,
    bad: <SwitchDemo />,
    roles: ["SPRING_INDICATOR", "SPRING_RAIL", "--transform-origin", "ease-drawer"],
  },
  {
    id: "transform-and-opacity",
    title: "Only transform and opacity move",
    pages: ["Motion"],
    // ratchet-allow: prose that names the anti-pattern this principle forbids.
    rule: "What moves, moves by transform; what appears, by opacity. Colour may ease on hover. Name each property you transition; never transition: all. Reduced motion swaps movement for a short crossfade. The one exception is an accordion, whose height has to push the rows below it: it animates height, briefly.",
    // ratchet-allow: prose that names the anti-pattern this principle forbids.
    why: "Those two properties skip layout and paint, so they hold the frame on a busy main thread, which Atlas often has while a session streams. Width or padding re-lay out the page every frame and push their neighbours around; a shadow repaints every frame. transition: all animates whatever changes next, including the layout property nobody meant to animate.",
    good: <BarDemo cheap />,
    bad: <BarDemo />,
    roles: ["transition-[transform,opacity]", "transition-colors", "prefers-reduced-motion"],
  },
  {
    id: "respond-on-press",
    title: "Respond on press",
    pages: ["Motion"],
    rule: "A control answers the moment it's pressed, not when it's released. Pressable things dip to scale(0.97) on press.",
    why: "Feedback that waits for the click to finish feels dead, even when the work behind it is instant. A small dip on press tells people the app heard them, and it costs one composited transform.",
    good: <Button size="sm">Press and hold</Button>,
    bad: (
      // Button dips by default now, so the don't pins its scale to switch it off.
      <Button size="sm" className="scale-100!">
        Press and hold
      </Button>
    ),
    roles: ["active:scale-97", "duration-instant", "ease-out-strong"],
  },
  {
    id: "one-interface-scale",
    title: "One interface scale",
    rule: "The interface scale zooms the whole window. Type, controls, spacing and icons grow together; nothing scales on its own.",
    why: "Atlas's type and control scales are in px, so scaling by the root font size would move only the rem-based spacing: the gaps and paddings would grow around text and controls that stay the same size. One zoom, the WebView's own, keeps every proportion the design was drawn at. The presets are Compact (0.9), Default (1), Large (1.15) and Larger (1.3). The one exception is desktop's window bar, which holds its height on screen because the macOS traffic lights it centres never zoom.",
    good: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" style={{ zoom: 1.3 }}>
          <Button size="sm">Run</Button>
          <span className="label">Refactor settings</span>
        </div>
        <span className="caption">Larger, as a zoom: everything grew</span>
      </div>
    ),
    bad: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5">
          <Button size="sm" className="px-2.5">
            Run
          </Button>
          <span className="label">Refactor settings</span>
        </div>
        <span className="caption">Larger, as a root font size: only the gaps grew</span>
      </div>
    ),
    roles: ["zoom", "--ui-zoom", "rem spacing", "px type and controls"],
    pages: ["Spacing", "Control heights", "Type"],
  },
];

/** A palette-like panel. `instant` opens it with no motion, as the real one does. */
function PaletteDemo({ instant = false }: { instant?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Open"} ⌘K
      </Button>
      <div
        className={cn(
          "flex w-48 flex-col gap-1 rounded-md border border-border bg-popover p-2 shadow-md",
          instant
            ? open
              ? "visible"
              : "invisible"
            : cn(
                "transition-[opacity,transform] duration-slow ease-in",
                open ? "scale-100 opacity-100" : "scale-0 opacity-0",
              ),
        )}
      >
        <span className="label">Open session…</span>
        <span className="caption">Instant: it opens many times a day</span>
      </div>
    </div>
  );
}

/** A switch knob. Click it quickly: the interruptible one turns around mid-way. */
function SwitchDemo({ interruptible = false }: { interruptible?: boolean }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        aria-pressed={on}
        aria-label="Example switch"
        onClick={() => setOn((v) => !v)}
        className="relative h-control-md w-24 rounded-full border border-border bg-muted"
      >
        {interruptible ? (
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-5 rounded-full bg-foreground transition-transform duration-base ease-out-strong",
              on && "translate-x-17.5",
            )}
          />
        ) : (
          <span
            key={String(on)}
            className={cn(
              "absolute top-0.5 size-5 animate-slide-in-left rounded-full bg-foreground",
              on ? "right-0.5" : "left-0.5",
            )}
          />
        )}
      </button>
      <span className="caption">Click it twice, fast</span>
    </div>
  );
}

/** A progress bar slid in by translateX (scaleX would squash its round ends), or grown by width. */
function BarDemo({ cheap = false }: { cheap?: boolean }) {
  const [full, setFull] = useState(false);
  return (
    <div className="flex w-56 flex-col gap-2">
      <Button size="sm" variant="outline" onClick={() => setFull((v) => !v)}>
        {full ? "Reset" : "Fill"}
      </Button>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-foreground",
            cheap
              ? cn(
                  "w-full transition-transform duration-slow ease-out-strong",
                  full ? "translate-x-0" : "-translate-x-4/5",
                )
              : cn(
                  // ratchet-allow: the don't half of a do/don't pair, animating width on purpose.
                  "transition-all duration-slow ease-out-strong",
                  full ? "w-full" : "w-1/5",
                ),
          )}
        />
      </div>
      <code className="code">
        {/* ratchet-allow: the label of the don't demo, naming what it does wrong. */}
        {cheap ? "transition-transform translate-x" : "transition-all width"}
      </code>
    </div>
  );
}

function Example({ kind, children }: { kind: "do" | "dont"; children: ReactNode }) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-border">
      <div className="flex min-h-36 items-center justify-center bg-background p-5">{children}</div>
      <figcaption
        className={cn(
          "label flex items-center gap-1.5 border-t border-border bg-card px-3 py-1.5",
          kind === "do" ? "text-success" : "text-error",
        )}
      >
        <Icon icon={kind === "do" ? CircleCheck : TriangleAlert} size="sm" />
        {kind === "do" ? "Do" : "Don't"}
      </figcaption>
    </figure>
  );
}

function PrinciplesPage() {
  // Storybook renders the page after the iframe has loaded, so the browser's
  // own jump to `#anchor` finds nothing; make it once the headings exist.
  // A citation link puts the anchor on the manager's URL, so read that too.
  useEffect(() => {
    let hash = window.location.hash;
    try {
      hash ||= window.parent.location.hash;
    } catch {
      // A cross-origin embed: only the iframe's own hash is readable.
    }
    const id = decodeURIComponent(hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <Page
      title="Principles"
      status={
        <span className="label inline-flex w-fit items-center gap-1.5 rounded-full border border-warning px-2.5 py-0.5 text-warning">
          <Icon icon={TriangleAlert} size="sm" />
          Draft — awaiting sign-off
        </span>
      }
      lede="How Atlas looks and moves. Each rule has the reason behind it, an example of getting it right and wrong, and the tokens that carry it. The examples use live tokens, so try them in another theme from the toolbar."
    >
      <ol className="flex flex-col gap-12">
        {PRINCIPLES.map((p, i) => (
          <li key={p.id} id={p.id} className="flex scroll-mt-6 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow">Principle {i + 1}</span>
              <h2 className="text-xl font-semibold">
                <a href={`#${p.id}`} className="hover:underline focus-visible:underline">
                  {p.title}
                </a>
              </h2>
              <p className="text-md font-medium">{p.rule}</p>
              <p className="body max-w-2xl text-secondary-foreground">{p.why}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Example kind="do">{p.good}</Example>
              <Example kind="dont">{p.bad}</Example>
            </div>
            {p.proposed && (
              <p className="caption flex max-w-2xl items-start gap-1.5 text-warning">
                <Icon icon={TriangleAlert} size="sm" className="mt-px shrink-0" />
                <span>
                  <span className="font-semibold">Not in desktop yet.</span> {p.proposed}
                </span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="caption mr-1">Roles</span>
              {p.roles.map((r) => (
                <code
                  key={r}
                  className="code rounded-sm bg-muted px-1.5 py-0.5 text-secondary-foreground"
                >
                  {r}
                </code>
              ))}
              <span className="caption ml-auto pl-2">
                See{" "}
                {p.pages.map((page, j) => (
                  <span key={page}>
                    {j > 0 && (j === p.pages.length - 1 ? " and " : ", ")}
                    <FoundationLink page={page} />
                  </span>
                ))}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <Section
        title="Using this"
        intro={
          <>
            When a story or a redesign makes a judgment call, cite the principle it follows by its
            anchor, for example <code className="code">Principles#rings-not-shadows</code>. Every
            heading above links to its own anchor. Anchors never change, so a citation keeps working
            when a principle is reworded.
          </>
        }
      />
    </Page>
  );
}

const meta = {
  title: "Foundations/Principles",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
export const Page_: StoryObj = { name: "Page", render: () => <PrinciplesPage /> };

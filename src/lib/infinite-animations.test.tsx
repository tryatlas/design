// @vitest-environment happy-dom
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { planSession } from "../../stories/components/session/fixtures.ts";
import { CheckpointTrace } from "../components/blocks/checkpoint-trace.tsx";
import { Globe } from "../components/blocks/globe.tsx";
import { SessionPipeline } from "../components/session/session-pipeline.tsx";
import { StreamingMarkdown } from "../components/session/streaming-markdown.tsx";
import { ThemeProvider } from "./theme.tsx";
import { Skeleton } from "../components/ui/skeleton.tsx";
import { Spinner } from "../components/ui/spinner.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { RefreshCw } from "lucide-react";
import {
  INFINITE_ANIMATIONS,
  INFINITE_ANIMATION_FPS_VAR,
  infiniteAnimationFps,
} from "./infinite-animations.ts";

/**
 * `INFINITE_ANIMATIONS` is how a consumer caps the package's endless
 * animations (desktop steps them on Linux, where WebKitGTK pays for every
 * frame). An animation missing from it is one the consumer cannot cap, and
 * nothing renders differently, so these hold the list to the source.
 */

const ROOT = path.join(import.meta.dirname, "../..");

/** What starts an animation that never ends. */
const ENDLESS =
  /\banimate-(?:spin|pulse|ping|bounce)\b|\bstream-caret\b|repeat:\s*Infinity|requestAnimationFrame\(tick\)/;

/** A row that is a utility in a stylesheet rather than a component's. */
const isUtility = (a: (typeof INFINITE_ANIMATIONS)[number]) => a.source.endsWith(".css");

function sources(dir: string): string[] {
  return readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return sources(rel);
    return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name) ? [rel] : [];
  });
}

afterEach(cleanup);

// happy-dom lays nothing out, so the trace's virtualizer would mount no lane
// (and no live edge) in a scroller 0px tall. Give that scroller a viewport.
beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.slot === "checkpoint-trace-scroller" ? 600 : 0;
  });
});
afterAll(() => vi.restoreAllMocks());

describe("INFINITE_ANIMATIONS", () => {
  it("lists every source file that runs an endless animation", () => {
    // The list itself names the classes it describes.
    const running = sources("src").filter(
      (file) =>
        file !== "src/lib/infinite-animations.ts" &&
        ENDLESS.test(readFileSync(path.join(ROOT, file), "utf8")),
    );
    const listed = new Set(INFINITE_ANIMATIONS.filter((a) => !isUtility(a)).map((a) => a.source));
    expect(running.filter((file) => !listed.has(file))).toEqual([]);
    expect([...listed].filter((file) => !running.includes(file))).toEqual([]);
  });

  it("finds each utility's endless animation in its stylesheet", () => {
    for (const animation of INFINITE_ANIMATIONS.filter(isUtility)) {
      if (animation.driver !== "css") throw new Error(`${animation.id}: a utility is css`);
      expect(animation.components, animation.id).toEqual([]);
      const css = readFileSync(path.join(ROOT, animation.source), "utf8");
      const name = animation.selector.match(/[a-z]+(?:-[a-z]+)+/)![0];
      const utility = name.replace(/^animate-/, "");
      // The `@utility` itself, or the `--animate-*` token that defines it.
      const definition = css.match(
        new RegExp(`(?:@utility ${utility} \\{[^}]*|--animate-${utility}:[^;]*)`),
      );
      expect(definition?.[0], animation.id).toMatch(/infinite/);
      expect(Math.round(animation.steps / animation.duration), animation.id).toBe(12);
    }
  });

  it("caps every js loop through the variable", () => {
    for (const animation of INFINITE_ANIMATIONS.filter((a) => a.driver === "js")) {
      expect(readFileSync(path.join(ROOT, animation.source), "utf8"), animation.id).toMatch(
        /infiniteAnimationFps\(/,
      );
    }
  });

  it("gives every css animation a selector that matches it as rendered", () => {
    const { container } = render(
      <div>
        <Spinner />
        <IconButton icon={RefreshCw} label="Refresh" loading />
        <Skeleton />
        <SessionPipeline session={planSession()} />
        <StreamingMarkdown source="hi" streaming />
        <ThemeProvider>
          <Globe />
        </ThemeProvider>
        <CheckpointTrace
          now="2026-11-04T15:00:00Z"
          sessions={[
            {
              id: "live",
              title: "Live",
              startedAt: "2026-11-04T14:00:00Z",
              participants: [],
              checkpoints: [],
            },
          ]}
        />
      </div>,
    );
    for (const animation of INFINITE_ANIMATIONS) {
      if (animation.driver !== "css" || animation.id === "toast-loading" || isUtility(animation))
        continue;
      const found = container.querySelector(animation.selector);
      expect(found, `${animation.id}: ${animation.selector}`).not.toBeNull();
      expect(found!.getAttribute("class"), animation.id).toMatch(
        /animate-(?:spin|pulse|ping)|stream-caret/,
      );
      expect(animation.steps / animation.duration, animation.id).toBe(12);
    }
  });

  it("reads the cap from the cascade, and ignores it when unset or nonsense", () => {
    const element = document.createElement("div");
    document.body.append(element);
    expect(infiniteAnimationFps(element)).toBeUndefined();
    element.style.setProperty(INFINITE_ANIMATION_FPS_VAR, "12");
    expect(infiniteAnimationFps(element)).toBe(12);
    element.style.setProperty(INFINITE_ANIMATION_FPS_VAR, "fast");
    expect(infiniteAnimationFps(element)).toBeUndefined();
    element.remove();
  });
});

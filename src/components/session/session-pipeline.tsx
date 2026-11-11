"use client";

import { CheckCircle2Icon, CircleDashedIcon, PlayIcon, XCircleIcon } from "lucide-react";
import { useMemo } from "react";

import { cn } from "../../lib/utils.ts";
import { Icon } from "../../ui/icon.tsx";
import { Tag } from "../ui/tag.tsx";
import type { SessionView } from "./session-view.ts";

/**
 * A session as a pipeline of steps: the agent's plan when it keeps one,
 * otherwise every tool call in order.
 *
 * Three states, read by silhouette before colour: done is a filled check with
 * the title struck through and dimmed; the running step is the one ringed row
 * with a slow dashed spinner; everything still to come sits at 40%. Only the
 * running row gets the ring, so the eye lands there first. A failed call is
 * done, in the error ink.
 */

export interface SessionPipelineProps {
  session: SessionView;
  className?: string;
}

type StepState = "done" | "failed" | "running" | "upcoming";

interface Step {
  key: string;
  title: string;
  detail?: string;
  state: StepState;
}

/** The state in words, for a screen reader: the silhouettes are shapes only. */
const STATE_LABEL: Record<StepState, string> = {
  done: "Done",
  failed: "Failed",
  running: "Running",
  upcoming: "Upcoming",
};

function stepsOf(session: SessionView): Step[] {
  if (session.plan && session.plan.length > 0) {
    return session.plan.map((item, i) => ({
      key: `plan:${i}`,
      title: item.content,
      state:
        item.status === "completed"
          ? "done"
          : item.status === "in_progress"
            ? "running"
            : "upcoming",
    }));
  }
  return session.turns.flatMap((turn) =>
    turn.items.flatMap((item) =>
      item.kind === "tool"
        ? [
            {
              key: item.call.id,
              title: item.call.title ?? item.call.name,
              detail: item.call.title ? undefined : item.call.paths?.[0],
              state: (item.call.status === "completed"
                ? "done"
                : item.call.status === "failed"
                  ? "failed"
                  : item.call.status === "running"
                    ? "running"
                    : "upcoming") satisfies StepState,
            },
          ]
        : [],
    ),
  );
}

export function SessionPipeline({ session, className }: SessionPipelineProps) {
  const steps = useMemo(() => stepsOf(session), [session]);
  const done = steps.filter((s) => s.state === "done" || s.state === "failed").length;
  const live = session.phase === "running" || session.phase === "waiting";
  const { meta } = session;
  const heading = meta.ref ?? meta.title;

  return (
    <div
      data-slot="session-pipeline"
      className={cn("rounded-lg border border-border bg-card p-4", className)}
    >
      <div className="flex items-center gap-2">
        {heading && <div className="truncate text-sm font-medium text-foreground">{heading}</div>}
        {meta.agent && (
          <Tag hue={live ? "green" : "grey"} dot className="ml-auto shrink-0">
            {live ? `${meta.agent} running` : meta.agent}
          </Tag>
        )}
      </div>
      {meta.ref && meta.title && (
        <div className="mt-1 truncate text-xs text-secondary-foreground">{meta.title}</div>
      )}

      {steps.length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">No steps yet</p>
      ) : (
        <div className="mt-4 space-y-2">
          {steps.map((step) => (
            <div
              key={step.key}
              data-state={step.state}
              className={cn(
                "flex items-start gap-2",
                step.state === "running" &&
                  "-mx-2 rounded-md border border-border-strong bg-element-selected p-2",
              )}
            >
              <div className="relative mt-0.5 shrink-0">
                {step.state === "done" && (
                  <Icon icon={CheckCircle2Icon} size="md" className="text-foreground" />
                )}
                {step.state === "failed" && (
                  <Icon icon={XCircleIcon} size="md" className="text-error" />
                )}
                {step.state === "running" && (
                  <>
                    <Icon
                      icon={CircleDashedIcon}
                      size="md"
                      data-slot="session-pipeline-running"
                      className="animate-spin text-foreground [animation-duration:3s]"
                    />
                    <PlayIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current text-foreground" />
                  </>
                )}
                {step.state === "upcoming" && (
                  <Icon icon={CircleDashedIcon} size="md" className="text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "truncate text-xs font-medium",
                    step.state === "done" && "line-through opacity-50",
                    step.state === "running" && "text-foreground",
                    step.state === "failed" && "text-error",
                    // Dimmed by the text ladder, not opacity: opacity took it
                    // under 4.5:1.
                    step.state === "upcoming" && "text-muted-foreground",
                  )}
                >
                  <span className="sr-only">{STATE_LABEL[step.state]}: </span>
                  {step.title}
                </div>
                {step.detail && <div className="truncate caption">{step.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-3 text-2xs text-muted-foreground tabular-nums">
          {done}/{steps.length} steps
        </div>
      )}
    </div>
  );
}

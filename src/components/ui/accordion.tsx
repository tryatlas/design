"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "../../lib/utils.ts";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-md border border-border-subtle",
        className,
      )}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b not-last:border-border-subtle", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between gap-6 px-3 py-2 text-left text-xs font-medium text-secondary-foreground",
          // The package's focus ring (the global `:focus-visible` outline, as
          // `Button` gets it), drawn inset: the root's `overflow-hidden`
          // would clip the default 1px outer offset at the edges.
          "focus-visible:-outline-offset-2",
          "transition-colors duration-fast ease-out-strong hover:bg-element-hover hover:text-foreground aria-expanded:text-foreground",
          "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          strokeWidth={1.75}
          className="pointer-events-none size-3.5 shrink-0 text-muted-foreground transition-transform duration-base ease-out-strong group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      // Base UI measures the panel into `--accordion-panel-height` and sets
      // the starting/ending styles; the height transition is the open.
      //
      // Height is a layout property, so this is the one accepted exception to
      // "only transform and opacity move". An accordion has to push the items
      // below it down, and nothing composited can do that: a transform
      // (scaleY) would leave the following items in place and squash the text,
      // and `grid-template-rows` re-lays out every frame just as height does,
      // with a wrapper Base UI doesn't need. So the height animates, but
      // briefly: `duration-fast` (120ms) on ease-out, so the layout cost lasts
      // a handful of frames. Reduced motion opens it at once.
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-xs text-secondary-foreground",
        "transition-[height] duration-fast ease-out-strong motion-reduce:transition-none",
        "data-ending-style:h-0 data-starting-style:h-0",
      )}
      {...props}
    >
      <div
        className={cn(
          "px-3 pt-0 pb-3 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-3",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

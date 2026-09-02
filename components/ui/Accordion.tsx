"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/** Acordeon accesible de Radix, tokenizado. Lo usa la seccion de preguntas. */
export function Accordion({
  items,
  className,
}: {
  items: { q: string; a: string }[]
  className?: string
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("w-full", className)}>
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          className="border-hairline border-b"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="text-ink hover:text-brand group flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium transition-colors">
              {item.q}
              <ChevronDown
                className="text-ink-muted h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none">
            <p className="text-ink-muted pb-4 text-sm leading-relaxed">{item.a}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

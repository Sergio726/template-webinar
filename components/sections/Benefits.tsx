import { Check } from "lucide-react"
import { Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/ui/Reveal"
import { cn } from "@/lib/utils"
import type { SectionOf } from "@/lib/types"

/** Lista de lo que se lleva quien asiste. */
export function Benefits({ section }: { section: SectionOf<"benefits"> }) {
  return (
    <section className="bg-surface relative px-4 pb-16 sm:pb-20">
      <div
        className={cn(
          "rounded-card bg-surface-alt border-hairline relative mx-auto w-full max-w-4xl border p-8 shadow-lg sm:p-10",
          section.overlap && "-mt-12 sm:-mt-16"
        )}
      >
        <Heading
          eyebrow={section.eyebrow}
          title={section.title}
          highlight={section.titleHighlight}
          className="mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {section.items.map((item, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <li className="flex items-start gap-3">
                <span className="bg-brand-wash mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <Check className="text-brand-dark h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-ink text-sm leading-relaxed">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

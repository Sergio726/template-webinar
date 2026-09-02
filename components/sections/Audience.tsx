import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/ui/Reveal"
import { cn } from "@/lib/utils"
import type { SectionOf } from "@/lib/types"

/**
 * Grilla de "esto es para vos si...".
 *
 * Enumerar los rubros a los que sirve el evento hace dos cosas a la vez: quien
 * calza se reconoce en la lista y sigue leyendo, y quien no calza se va antes
 * de dejar un dato que nadie va a poder aprovechar.
 */
export function Audience({ section }: { section: SectionOf<"audience"> }) {
  const columns = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
  } as const

  return (
    <Section background="alt">
      <Heading
        eyebrow={section.eyebrow}
        title={section.title}
        highlight={section.titleHighlight}
        className="mb-10"
      />

      <ul className={cn("mx-auto grid max-w-3xl gap-x-8 gap-y-4", columns[section.columns])}>
        {section.items.map((item, index) => (
          <Reveal key={index} delay={index * 0.04}>
            <li className="flex items-start gap-3">
              <span className="bg-brand mt-2 h-2 w-2 shrink-0 rounded-full" aria-hidden />
              <span className="text-ink text-base leading-snug">{item}</span>
            </li>
          </Reveal>
        ))}
      </ul>

      {section.footnote ? (
        <p className="text-ink-muted mt-10 text-center text-sm font-medium">
          {section.footnote}
        </p>
      ) : null}
    </Section>
  )
}

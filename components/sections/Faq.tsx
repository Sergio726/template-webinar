import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { Accordion } from "@/components/ui/Accordion"
import type { SectionOf } from "@/lib/types"

/** Preguntas frecuentes: baja la friccion antes de pedir los datos. */
export function Faq({ section }: { section: SectionOf<"faq"> }) {
  return (
    <Section>
      <Heading title={section.title} highlight={section.titleHighlight} className="mb-8" />
      <div className="mx-auto max-w-2xl">
        <Accordion items={section.items} />
      </div>
    </Section>
  )
}

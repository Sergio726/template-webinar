import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { RichText } from "@/components/ui/RichText"
import { Reveal } from "@/components/ui/Reveal"
import type { SectionOf } from "@/lib/types"

/** Bloque de texto libre para lo que no encaje en las secciones tipadas. */
export function RichTextBlock({ section }: { section: SectionOf<"richText"> }) {
  return (
    <Section>
      <Reveal className="mx-auto max-w-3xl">
        <Heading title={section.title} highlight={section.titleHighlight} align="left" />
        <div className="mt-5 space-y-4">
          {section.paragraphs.map((paragraph, index) => (
            <RichText key={index} text={paragraph} className="text-ink-muted leading-relaxed" />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { CtaButton } from "@/components/ui/CtaButton"
import { RichText } from "@/components/ui/RichText"
import { Reveal } from "@/components/ui/Reveal"
import { FORM_ANCHOR_ID } from "@/lib/scroll"
import type { SectionOf } from "@/lib/types"

/** Bloque de problema y salida: nombra el dolor y ofrece el evento como respuesta. */
export function Tension({ section }: { section: SectionOf<"tension"> }) {
  return (
    <Section background="alt">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Heading title={section.title} highlight={section.titleHighlight} />
        <div className="mt-6 space-y-4">
          {section.paragraphs.map((paragraph, index) => (
            <RichText
              key={index}
              text={paragraph}
              className="text-ink-muted leading-relaxed"
            />
          ))}
        </div>
        {section.cta ? (
          <div className="mx-auto mt-8 max-w-sm">
            <CtaButton
              label={section.cta.label}
              href={section.cta.href ?? `#${FORM_ANCHOR_ID}`}
              icon={section.cta.icon ?? "ArrowRight"}
              size="lg"
            />
          </div>
        ) : null}
      </Reveal>
    </Section>
  )
}

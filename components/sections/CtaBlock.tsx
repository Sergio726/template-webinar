import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { CtaButton } from "@/components/ui/CtaButton"
import { RichText } from "@/components/ui/RichText"
import { Reveal } from "@/components/ui/Reveal"
import { FORM_ANCHOR_ID } from "@/lib/scroll"
import type { SectionOf } from "@/lib/types"

/** Llamada a la accion suelta, para intercalar entre secciones largas. */
export function CtaBlock({ section }: { section: SectionOf<"cta"> }) {
  return (
    <Section>
      <Reveal className="rounded-card bg-brand-wash mx-auto max-w-3xl p-8 text-center sm:p-10">
        <Heading title={section.title} highlight={section.titleHighlight} />
        {section.body ? (
          <RichText text={section.body} className="text-ink-muted mt-4 leading-relaxed" />
        ) : null}
        {section.cta ? (
          <div className="mx-auto mt-7 max-w-sm">
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

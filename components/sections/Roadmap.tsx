import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { CtaButton } from "@/components/ui/CtaButton"
import { Reveal } from "@/components/ui/Reveal"
import { cn } from "@/lib/utils"
import { FORM_ANCHOR_ID } from "@/lib/scroll"
import type { SectionOf } from "@/lib/types"

/** Ruta de aprendizaje: util cuando el webinar es parte de una serie. */
export function Roadmap({ section }: { section: SectionOf<"roadmap"> }) {
  return (
    <Section>
      <Heading
        eyebrow={section.eyebrow}
        title={section.title}
        highlight={section.titleHighlight}
        className="mb-10"
      />
      <ol className="mx-auto max-w-2xl space-y-3">
        {section.items.map((item, index) => (
          <Reveal key={index} delay={index * 0.05}>
            <li
              className={cn(
                "rounded-control flex items-center gap-4 border p-4 transition-colors",
                item.current
                  ? "border-brand bg-brand-wash"
                  : "border-hairline bg-surface-alt"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  item.current ? "bg-brand text-on-brand" : "bg-elevated text-ink-muted"
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm font-semibold", item.current ? "text-ink" : "text-ink-muted")}>
                  {item.title}
                </span>
                {item.status ? (
                  <span className="text-ink-muted mt-0.5 block text-xs">{item.status}</span>
                ) : null}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
      {section.cta ? (
        <div className="mx-auto mt-10 max-w-sm">
          <CtaButton
            label={section.cta.label}
            href={section.cta.href ?? `#${FORM_ANCHOR_ID}`}
            icon={section.cta.icon ?? "ArrowRight"}
            size="lg"
          />
        </div>
      ) : null}
    </Section>
  )
}

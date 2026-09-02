import Image from "next/image"
import { Quote } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/ui/Reveal"
import type { SectionOf } from "@/lib/types"

/** Prueba social. */
export function Testimonials({ section }: { section: SectionOf<"testimonials"> }) {
  return (
    <Section background="alt">
      <Heading title={section.title} highlight={section.titleHighlight} className="mb-10" />
      <div className="grid gap-6 md:grid-cols-3">
        {section.items.map((item, index) => (
          <Reveal key={index} delay={index * 0.08}>
            <figure className="rounded-card border-hairline bg-surface h-full border p-6">
              <Quote className="text-brand/40 h-6 w-6" aria-hidden />
              <blockquote className="text-ink mt-3 text-sm leading-relaxed">
                {item.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <span>
                  <span className="text-ink block text-sm font-semibold">{item.name}</span>
                  {item.role ? (
                    <span className="text-ink-muted block text-xs">{item.role}</span>
                  ) : null}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

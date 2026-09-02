import Image from "next/image"
import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/ui/Reveal"
import type { SectionOf } from "@/lib/types"

/** Quien presenta. */
export function Speaker({ section }: { section: SectionOf<"speaker"> }) {
  return (
    <Section background="alt">
      <Heading title={section.title} className="mb-10" />
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {section.photo ? (
          <Image
            src={section.photo}
            alt={section.name}
            width={160}
            height={160}
            className="border-brand/30 h-32 w-32 shrink-0 rounded-full border-4 object-cover"
          />
        ) : null}
        <div>
          <p className="font-display text-ink text-xl font-bold">{section.name}</p>
          {section.role ? <p className="text-brand-dark text-sm font-medium">{section.role}</p> : null}
          <p className="text-ink-muted mt-3 text-sm leading-relaxed">{section.bio}</p>
        </div>
      </Reveal>
    </Section>
  )
}

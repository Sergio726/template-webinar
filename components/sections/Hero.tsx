import Image from "next/image"
import { Backdrop } from "@/components/ui/Backdrop"
import { Badge } from "@/components/ui/Badge"
import { CtaButton } from "@/components/ui/CtaButton"
import { Countdown } from "@/components/ui/Countdown"
import { Icon } from "@/components/ui/Icon"
import { RichText } from "@/components/ui/RichText"
import { Reveal } from "@/components/ui/Reveal"
import { FORM_ANCHOR_ID } from "@/lib/scroll"
import type { EventConfig, SectionOf } from "@/lib/types"

/**
 * Portada del evento.
 *
 * Todo lo que en el original estaba escrito a mano — la fecha, el porcentaje de
 * cupos, la cantidad de registrados, el retrato — llega por config. Un evento
 * que no quiera urgencia sencillamente omite `scarcity` y el bloque no existe.
 */
export function Hero({
  section,
  config,
}: {
  section: SectionOf<"hero">
  config: EventConfig
}) {
  const { brand, theme, event, countdownLabels } = config

  return (
    <section className="bg-surface relative flex min-h-[85vh] flex-col justify-center px-4 py-16 sm:py-20">
      <Backdrop variant={theme.backdrop} />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {brand.logo?.light ? (
            <Image
              src={brand.logo.light}
              alt={brand.name}
              width={140}
              height={40}
              className="mb-8 h-9 w-auto object-contain"
              priority
            />
          ) : (
            <p className="text-ink-muted mb-8 text-sm font-semibold tracking-widest uppercase">
              {brand.name}
            </p>
          )}

          <Reveal>
            {section.eyebrow ? (
              <Badge tone="brand" shine className="mb-5">
                {section.eyebrow}
              </Badge>
            ) : null}

            <h1 className="font-display text-ink text-4xl leading-[1.1] font-bold text-balance sm:text-5xl lg:text-6xl">
              {section.headline}
              {section.headlineHighlight ? (
                <>
                  {" "}
                  <span className="text-brand">{section.headlineHighlight}</span>
                </>
              ) : null}
            </h1>

            {section.subheadline ? (
              <p className="text-ink-muted mt-5 max-w-2xl text-lg leading-relaxed">
                {section.subheadline}
              </p>
            ) : null}

            {section.body ? (
              <RichText
                text={section.body}
                className="text-ink-muted mt-4 max-w-2xl leading-relaxed"
              />
            ) : null}
          </Reveal>

          {section.facts.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {section.facts.map((fact, index) => (
                <li key={index} className="text-ink flex items-center gap-2 text-sm font-medium">
                  <Icon name={fact.icon} className="text-brand h-4 w-4 shrink-0" />
                  {fact.label}
                </li>
              ))}
            </ul>
          ) : null}

          {section.cta ? (
            <div className="mt-9 max-w-sm">
              <CtaButton
                label={section.cta.label}
                href={section.cta.href ?? `#${FORM_ANCHOR_ID}`}
                icon={section.cta.icon ?? "CalendarDays"}
                size="lg"
              />
            </div>
          ) : null}

          {section.scarcity ? (
            <div className="mt-7 max-w-sm">
              <div className="text-ink-muted mb-2 flex items-center justify-between text-xs font-medium">
                <span>{section.scarcity.label}</span>
                <span className="text-brand-dark font-semibold">{section.scarcity.percent}%</span>
              </div>
              <div className="bg-elevated h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-brand h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${section.scarcity.percent}%` }}
                  role="progressbar"
                  aria-valuenow={section.scarcity.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={section.scarcity.label}
                />
              </div>
            </div>
          ) : null}

          {section.socialProof ? (
            <p className="text-ink-muted mt-5 text-sm">
              <span className="text-ink font-semibold">
                +{section.socialProof.count.toLocaleString(event.locale)}
              </span>{" "}
              {section.socialProof.label}
            </p>
          ) : null}
        </div>

        {section.portrait ? (
          <Reveal delay={0.15} className="justify-self-center lg:justify-self-end">
            <figure className="text-center">
              <Image
                src={section.portrait.src}
                alt={section.portrait.alt}
                width={260}
                height={260}
                className="border-brand/30 mx-auto h-44 w-44 rounded-full border-4 object-cover sm:h-56 sm:w-56"
                priority
              />
              <figcaption className="mt-4">
                <p className="text-ink font-display text-lg font-bold">{section.portrait.name}</p>
                <p className="text-ink-muted text-sm">{section.portrait.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>

      {section.showCountdown ? (
        <div className="relative mx-auto w-full max-w-5xl">
          <Countdown targetDate={event.date} labels={countdownLabels} className="mt-14" />
        </div>
      ) : null}
    </section>
  )
}

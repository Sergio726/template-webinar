import type { ComponentType } from "react"
import { Hero } from "./Hero"
import { Benefits } from "./Benefits"
import { Tension } from "./Tension"
import { Roadmap } from "./Roadmap"
import { Testimonials } from "./Testimonials"
import { Faq } from "./Faq"
import { Speaker } from "./Speaker"
import { CtaBlock } from "./CtaBlock"
import { RichTextBlock } from "./RichTextBlock"
import { Audience } from "./Audience"
import { RegistrationForm } from "./RegistrationForm"
import { Footer } from "./Footer"
import { isRegistrationClosed } from "@/lib/registration"
import type { EventConfig, SectionConfig, SectionType } from "@/lib/types"

/**
 * Mapa de tipo de sección a componente.
 *
 * El `satisfies` obliga a que exista una entrada por cada tipo declarado en el
 * esquema: si mañana se agrega una sección nueva al config, el proyecto no
 * compila hasta registrarla acá. Es exactamente el olvido que queremos que el
 * compilador atrape.
 */
type SectionProps = {
  section: never
  config: EventConfig
  initiallyClosed: boolean
  isPrimary: boolean
}

const SECTION_COMPONENTS = {
  hero: Hero,
  benefits: Benefits,
  tension: Tension,
  roadmap: Roadmap,
  testimonials: Testimonials,
  faq: Faq,
  speaker: Speaker,
  cta: CtaBlock,
  richText: RichTextBlock,
  audience: Audience,
  form: RegistrationForm,
} satisfies Record<SectionType, ComponentType<SectionProps>>

/**
 * Renderiza las secciones en el orden del config. El orden del array ES el
 * orden de la página: reordenar la landing es mover un bloque de configuración.
 */
export function SectionRenderer({ config }: { config: EventConfig }) {
  // El cierre se evalua aca, en el servidor, y viaja como estado inicial del
  // formulario. Sin esto, una landing ya vencida mostraria el formulario un
  // instante antes de que el navegador descubra la hora y lo reemplace.
  const initiallyClosed = isRegistrationClosed(config)

  // Una landing puede repetir el formulario (arriba y al final). El primero se
  // queda con el ancla #registro, que tiene que ser unica en el documento.
  const firstFormIndex = config.sections.findIndex((section) => section.type === "form")

  return (
    <>
      {config.sections.map((section: SectionConfig, index) => {
        const Component = SECTION_COMPONENTS[section.type] as ComponentType<{
          section: SectionConfig
          config: EventConfig
          initiallyClosed: boolean
          isPrimary: boolean
        }>

        return (
          <Component
            key={`${section.type}-${index}`}
            section={section}
            config={config}
            initiallyClosed={initiallyClosed}
            isPrimary={index === firstFormIndex}
          />
        )
      })}
      <Footer config={config} />
    </>
  )
}

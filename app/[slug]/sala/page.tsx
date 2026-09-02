import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import type { CSSProperties } from "react"
import { getEvent, getPublishedSlugs } from "@/events"
import { WaitingRoom } from "@/components/waiting-room/WaitingRoom"
import { stageCssVars } from "@/lib/theme"

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }))
}

/**
 * Sala de espera, en `/{slug}/sala`.
 *
 * Recurso interno: la abre quien transmite y la comparte en pantalla durante
 * los minutos previos al evento. No se indexa —no es un resultado de búsqueda
 * ni una página que alguien deba encontrar suelta— y por eso tampoco entra en
 * el sitemap.
 *
 * Cuelga del layout del evento, así que ya llega con el tema y las fuentes del
 * config aplicados; acá solo se suman las variables del escenario oscuro.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) return {}

  return {
    title: `Sala de espera · ${config.brand.name}`,
    description: `Cuenta regresiva para el inicio de ${config.seo.title}.`,
    robots: { index: false, follow: false },
  }
}

/** La barra del navegador móvil acompaña al telón, no al fondo de la landing. */
export async function generateViewport({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Viewport> {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) return {}

  const stage = stageCssVars(config.theme) as Record<string, string>
  return { themeColor: stage["--stage-bg"] }
}

export default async function SalaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) notFound()

  return (
    <div style={stageCssVars(config.theme) as CSSProperties}>
      <WaitingRoom
        config={config.waitingRoom}
        theme={config.theme}
        brandName={config.brand.name}
        slug={slug}
      />
    </div>
  )
}

import { notFound } from "next/navigation"
import { getEvent, getPublishedSlugs } from "@/events"
import { themeToCssVars } from "@/lib/theme"
import { resolveFonts } from "@/lib/fonts"
import { ClientBridges } from "@/components/ClientBridges"
import { Analytics } from "@/components/Analytics"
import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }))
}

/**
 * Contenedor del evento.
 *
 * Aca se aplica el tema: los tokens del config se emiten como variables CSS en
 * el elemento raiz de la landing. Como quedan serializados en el HTML estatico,
 * no hay parpadeo ni JavaScript involucrado, y dos eventos con paletas
 * distintas pueden convivir en el mismo deploy sin pisarse.
 */
export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  // En Next 15+ los params son una promesa; olvidar el await devuelve un objeto
  // vacio y todas las rutas responden 404 en silencio.
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) notFound()

  const fonts = resolveFonts(config.theme)
  const style = { ...themeToCssVars(config.theme), ...fonts.vars } as CSSProperties

  return (
    <div className={cn(fonts.className, "bg-surface text-ink font-sans min-h-dvh")} style={style}>
      <Analytics analytics={config.analytics} />
      <ClientBridges analytics={config.analytics} slug={slug} />
      {children}
    </div>
  )
}

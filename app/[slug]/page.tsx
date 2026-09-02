import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getEvent, getPublishedSlugs } from "@/events"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { StickyCta } from "@/components/sections/StickyCta"
import { getSiteUrl } from "@/lib/site"

/** Un slug que no este publicado responde 404 sin invocar al servidor. */
export const dynamicParams = false

/**
 * Se regenera cada hora. La pagina es estatica, pero la cuenta regresiva y el
 * cierre de inscripciones dependen del reloj: sin revalidacion, el HTML podria
 * quedar congelado con datos de la fecha del build.
 */
export const revalidate = 3600

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }))
}

/**
 * Metadatos en el HTML servido.
 *
 * Es la diferencia principal con el proyecto original, que los inyectaba con un
 * efecto sobre document.head: los rastreadores de WhatsApp y Facebook no
 * ejecutan JavaScript, asi que alli nunca veian el titulo ni la imagen.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) return {}

  const { seo, brand, event } = config

  return {
    metadataBase: new URL(getSiteUrl()),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      url: `/${slug}`,
      siteName: brand.name,
      locale: event.locale,
      title: seo.title,
      description: seo.description,
      // Si el config trae una imagen propia, gana sobre la generada.
      ...(seo.ogImage ? { images: [{ url: seo.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) notFound()

  return (
    // El espacio extra abajo evita que la barra fija tape el pie de pagina.
    <main className={config.stickyCta ? "pb-20" : undefined}>
      <SectionRenderer config={config} />
      {config.stickyCta ? <StickyCta label={config.stickyCta.label} /> : null}
    </main>
  )
}

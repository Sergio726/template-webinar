import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getEvent, getPublishedSlugs } from "@/events"
import { SuccessCard } from "@/components/form/SuccessCard"
import { Backdrop } from "@/components/ui/Backdrop"

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }))
}

/**
 * Pagina de agradecimiento.
 *
 * Destino para campanas que capturan el registro fuera del sitio (formularios
 * nativos de Meta, por ejemplo): la persona ya se anoto alli y aca solo recibe
 * el paso siguiente. Va sin indexar, porque no tiene sentido como resultado de
 * busqueda, pero conserva las etiquetas para que el enlace se vea bien al
 * compartirse.
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
    title: config.success.title,
    description: config.seo.description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      title: config.success.title,
      description: config.seo.description,
      siteName: config.brand.name,
    },
  }
}

export default async function RegistroPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getEvent(slug)
  if (!config) notFound()

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-16">
      <Backdrop variant={config.theme.backdrop} />
      <div className="relative w-full">
        <SuccessCard config={config} showLogo />
        <p className="mt-6 text-center">
          <Link
            href={`/${slug}`}
            className="text-ink-muted hover:text-brand text-xs underline underline-offset-4 transition-colors"
          >
            Volver a la pagina del evento
          </Link>
        </p>
      </div>
    </main>
  )
}

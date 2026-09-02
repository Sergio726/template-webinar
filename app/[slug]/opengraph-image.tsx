import { ImageResponse } from "next/og"
import { getEvent, getPublishedSlugs } from "@/events"
import { resolveTokens } from "@/lib/theme"
import { formatEventDate } from "@/lib/utils"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Portada del evento"

/**
 * Sin esto la imagen se generaria bajo demanda, y el primer rastreador que
 * llegue (WhatsApp suele ser el primero) podria encontrarla todavia sin
 * construir.
 */
export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }))
}

/**
 * Imagen para compartir, generada por evento.
 *
 * Usa los mismos hex del tema que el DOM: por eso los presets viven en
 * TypeScript y no solo en CSS, ya que esta imagen se dibuja sin hoja de estilos.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getEvent(slug)

  if (!config) {
    return new ImageResponse(<div style={{ display: "flex" }} />, size)
  }

  const tokens = resolveTokens(config.theme)
  const { date, time } = formatEventDate(
    config.event.date,
    config.event.timeZone,
    config.event.locale
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: tokens.surface,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: tokens.brandWash,
              color: tokens.brandDark,
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {config.brand.name}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 62,
              fontWeight: 700,
              color: tokens.ink,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {config.seo.title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 10, height: 64, backgroundColor: tokens.brand, borderRadius: 999 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: tokens.ink }}>
              {date} · {time}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: tokens.inkMuted, marginTop: 6 }}>
              {config.event.timezoneLabel ?? config.event.timeZone}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}

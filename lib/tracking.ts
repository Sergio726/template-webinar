"use client"

import type { AnalyticsConfig } from "./types"

/**
 * Analítica opcional.
 *
 * Versión reducida del módulo de 598 líneas del proyecto original: se conserva
 * la regla útil (si hay contenedor de GTM, se usa sólo GTM para no duplicar
 * eventos) y se descarta todo lo que dependía de la base de datos.
 *
 * Sin IDs en el config no se carga ni un byte de terceros.
 */

type DataLayerEvent = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

function pushToDataLayer(event: DataLayerEvent) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(event)
}

/** ¿Hay algo configurado? Determina si se inyecta cualquier script. */
export function hasAnalytics(analytics: AnalyticsConfig): boolean {
  if (!analytics.enabled) return false
  return Boolean(analytics.gtmId || analytics.metaPixelId || analytics.ga4Id)
}

/**
 * Si hay GTM, el pixel y GA4 se administran desde el contenedor: cargarlos
 * también acá haría contar cada evento dos veces.
 */
export function shouldLoadDirectTags(analytics: AnalyticsConfig): boolean {
  return analytics.enabled && !analytics.gtmId
}

/** Vista de la landing. Se dispara una vez al montar la página del evento. */
export function trackPageView(analytics: AnalyticsConfig, slug: string) {
  if (!analytics.enabled) return

  pushToDataLayer({ event: "webinar_landing_view", webinar_slug: slug })

  if (analytics.metaPixelId) {
    window.fbq?.("track", "ViewContent", { content_name: slug })
  }
  if (analytics.ga4Id) {
    window.gtag?.("event", "page_view", { page_path: `/${slug}` })
  }
}

/**
 * Registro completado. `eventId` es el mismo identificador que viaja al webhook
 * para que, si del otro lado se envía el evento por Conversions API, Meta pueda
 * unir ambos y no contarlos dos veces.
 */
export function trackRegistration(
  analytics: AnalyticsConfig,
  slug: string,
  eventId: string
) {
  if (!analytics.enabled) return

  pushToDataLayer({
    event: "webinar_registration",
    webinar_slug: slug,
    event_id: eventId,
  })

  if (analytics.metaPixelId) {
    window.fbq?.(
      "track",
      "CompleteRegistration",
      { content_name: slug },
      { eventID: eventId }
    )
  }
  if (analytics.ga4Id) {
    window.gtag?.("event", "sign_up", { method: "webinar_form", event_id: eventId })
  }
}

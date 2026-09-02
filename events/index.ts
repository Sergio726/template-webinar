import { eventConfigSchema, type EventConfig } from "@/lib/types"
import demoMarketing from "./demo-marketing"
import demoSalud from "./demo-salud"

/**
 * Registro de eventos.
 *
 * Para publicar un webinar nuevo:
 *   1. Copiá `_plantilla.ts` a `events/mi-webinar.ts` y editalo.
 *   2. Importalo acá y agregalo al array `RAW`.
 *
 * Eso es todo: la ruta, el sitemap, la imagen de compartir y la generación
 * estática salen solos del slug.
 *
 * La validación corre al importar el módulo, o sea durante `next build`. Un
 * config incoherente rompe la compilación con la ruta exacta del problema, en
 * vez de fallar recién cuando alguien visita la página.
 */
const RAW = [demoMarketing, demoSalud]

const EVENTS = new Map<string, EventConfig>(
  RAW.map((raw) => {
    const parsed = eventConfigSchema.parse(raw)
    return [parsed.slug, parsed] as const
  })
)

/** Slugs publicables. Los eventos con `enabled: false` quedan fuera. */
export function getPublishedSlugs(): string[] {
  return [...EVENTS.values()].filter((event) => event.enabled).map((event) => event.slug)
}

/** Config de un evento, o null si no existe o está apagado. */
export function getEvent(slug: string): EventConfig | null {
  const event = EVENTS.get(slug)
  if (!event || !event.enabled) return null
  return event
}

/** Todos los eventos publicados; lo usa el índice. */
export function getPublishedEvents(): EventConfig[] {
  return [...EVENTS.values()].filter((event) => event.enabled)
}

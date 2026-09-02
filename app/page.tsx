import Link from "next/link"
import { getPublishedEvents } from "@/events"
import { formatEventDate } from "@/lib/utils"
import { resolveTokens } from "@/lib/theme"

/**
 * Indice de eventos publicados.
 *
 * Es una pagina de servicio, pensada para desarrollo y para tener a mano los
 * enlaces. En produccion conviene apuntar el dominio directo al slug del evento
 * activo, o reemplazar esta pagina por la del sitio principal.
 */
export default function HomePage() {
  const events = getPublishedEvents()

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-ink text-3xl font-bold">Eventos publicados</h1>
      <p className="text-ink-muted mt-2 text-sm">
        {events.length === 0
          ? "Todavia no hay eventos activos. Crea uno en events/ y registralo en events/index.ts."
          : "Cada evento vive en su propia ruta y con su propio tema."}
      </p>

      <ul className="mt-8 space-y-3">
        {events.map((event) => {
          const { date, time } = formatEventDate(
            event.event.date,
            event.event.timeZone,
            event.event.locale
          )
          const tokens = resolveTokens(event.theme)

          return (
            <li key={event.slug}>
              <Link
                href={`/${event.slug}`}
                className="border-hairline hover:border-brand flex items-center gap-4 rounded-xl border p-4 transition-colors"
              >
                <span
                  className="h-10 w-10 shrink-0 rounded-full"
                  style={{ backgroundColor: tokens.brand }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="text-ink block font-semibold">{event.seo.title}</span>
                  <span className="text-ink-muted block text-sm">
                    {event.brand.name} · {date}, {time}
                  </span>
                </span>
                <span className="text-ink-muted text-xs">/{event.slug}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

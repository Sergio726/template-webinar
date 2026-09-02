import type { EventConfig } from "./types"

/** Duracion por defecto cuando el config no declara `endsAt`. */
const DEFAULT_DURATION_MIN = 90

function toUtcStamp(iso: string): string {
  // Formato compacto que piden Google Calendar y el estandar iCalendar.
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "")
}

function endOf(config: EventConfig): string {
  if (config.event.endsAt) return config.event.endsAt
  const start = new Date(config.event.date).getTime()
  return new Date(start + DEFAULT_DURATION_MIN * 60_000).toISOString()
}

/** Link de "agregar a Google Calendar" para la tarjeta de exito. */
export function googleCalendarUrl(config: EventConfig, pageUrl?: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: config.seo.title,
    dates: `${toUtcStamp(config.event.date)}/${toUtcStamp(endOf(config))}`,
    details: config.seo.description,
    location: config.event.location ?? pageUrl ?? "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Contenido de un .ics, para quien no use Google Calendar. */
export function buildIcs(config: EventConfig, pageUrl?: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//webinar-landing-template//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${config.slug}@webinar-landing-template`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(config.event.date)}`,
    `DTEND:${toUtcStamp(endOf(config))}`,
    `SUMMARY:${config.seo.title}`,
    `DESCRIPTION:${config.seo.description}`,
    `LOCATION:${config.event.location ?? pageUrl ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Compone clases de Tailwind resolviendo conflictos (la última gana). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte `**texto**` en `<strong>`. Es el único markup que aceptan los
 * campos de copy: alcanza para resaltar una frase sin abrir la puerta a HTML
 * arbitrario dentro de un archivo de configuración.
 */
export function splitBold(text: string): Array<{ text: string; bold: boolean }> {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((chunk) =>
      chunk.startsWith("**") && chunk.endsWith("**")
        ? { text: chunk.slice(2, -2), bold: true }
        : { text: chunk, bold: false }
    )
}

/**
 * Formatea una fecha ISO en español para mostrarla en la landing.
 * `timeZone` acepta un IANA ("America/Bogota") para que la hora mostrada sea la
 * del evento y no la del navegador de quien mira.
 */
export function formatEventDate(
  iso: string,
  timeZone?: string,
  locale = "es-ES"
): { date: string; time: string } {
  const value = new Date(iso)
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone,
  }).format(value)
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(value)
  return { date, time }
}

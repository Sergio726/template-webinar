/**
 * Prefijos telefónicos.
 *
 * Portado del selector de banderas del proyecto original, pero como tabla de
 * datos en vez de dos objetos paralelos. El país no es un campo del formulario:
 * se deriva del prefijo que la persona elige, igual que en el original.
 *
 * La bandera se dibuja con el emoji derivado del código ISO (dos letras →
 * dos "regional indicator symbols"), así no hace falta ninguna dependencia de
 * iconos. En Windows, Chrome no pinta emojis de bandera y muestra las dos
 * letras: es un degradado aceptable y sigue siendo legible.
 */

export type Country = {
  /** ISO 3166-1 alpha-2. */
  iso: string
  /** Prefijo internacional con "+". */
  dial: string
  name: string
}

export const COUNTRIES: Country[] = [
  { iso: "AR", dial: "+54", name: "Argentina" },
  { iso: "BO", dial: "+591", name: "Bolivia" },
  { iso: "BR", dial: "+55", name: "Brasil" },
  { iso: "CL", dial: "+56", name: "Chile" },
  { iso: "CO", dial: "+57", name: "Colombia" },
  { iso: "CR", dial: "+506", name: "Costa Rica" },
  { iso: "CU", dial: "+53", name: "Cuba" },
  { iso: "DO", dial: "+1809", name: "República Dominicana" },
  { iso: "EC", dial: "+593", name: "Ecuador" },
  { iso: "SV", dial: "+503", name: "El Salvador" },
  { iso: "ES", dial: "+34", name: "España" },
  { iso: "US", dial: "+1", name: "Estados Unidos" },
  { iso: "GT", dial: "+502", name: "Guatemala" },
  { iso: "HN", dial: "+504", name: "Honduras" },
  { iso: "MX", dial: "+52", name: "México" },
  { iso: "NI", dial: "+505", name: "Nicaragua" },
  { iso: "PA", dial: "+507", name: "Panamá" },
  { iso: "PY", dial: "+595", name: "Paraguay" },
  { iso: "PE", dial: "+51", name: "Perú" },
  { iso: "PR", dial: "+1787", name: "Puerto Rico" },
  { iso: "UY", dial: "+598", name: "Uruguay" },
  { iso: "VE", dial: "+58", name: "Venezuela" },
]

/** Convierte "CO" en 🇨🇴 sin necesidad de un set de iconos. */
export function isoToFlagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

export function findCountryByDial(dial: string): Country | undefined {
  return COUNTRIES.find((country) => country.dial === dial)
}

/** Nombre del país a partir del prefijo elegido; "Otro" si no está en la tabla. */
export function dialToCountryName(dial: string): string {
  return findCountryByDial(dial)?.name ?? "Otro"
}

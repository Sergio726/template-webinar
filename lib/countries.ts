/**
 * Prefijos telefónicos.
 *
 * Portado del selector de banderas del proyecto original, pero como tabla de
 * datos en vez de dos objetos paralelos. El país no es un campo del formulario:
 * se deriva del prefijo que la persona elige, igual que en el original.
 *
 * El país se identifica con su código ISO en mayúsculas, no con un emoji de
 * bandera: Chrome en Windows no dibuja esos emojis y los muestra como dos
 * letras minúsculas sueltas, que se leen peor que el código. Así se ve igual
 * en todos los sistemas y no hace falta ninguna dependencia de iconos.
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
  // Europa: buena parte de la audiencia latina vive alla.
  { iso: "IT", dial: "+39", name: "Italia" },
  { iso: "PT", dial: "+351", name: "Portugal" },
  { iso: "FR", dial: "+33", name: "Francia" },
  { iso: "DE", dial: "+49", name: "Alemania" },
  { iso: "GB", dial: "+44", name: "Reino Unido" },
]

/** Código de dos letras en mayúsculas, para mostrar junto al prefijo. */
export function isoLabel(iso: string): string {
  return iso.toUpperCase()
}

export function findCountryByDial(dial: string): Country | undefined {
  return COUNTRIES.find((country) => country.dial === dial)
}

/** Nombre del país a partir del prefijo elegido; "Otro" si no está en la tabla. */
export function dialToCountryName(dial: string): string {
  return findCountryByDial(dial)?.name ?? "Otro"
}

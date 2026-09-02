"use client"

/**
 * Atribucion de la visita.
 *
 * Corrige una limitacion del proyecto original: alli las UTM se leian de la URL
 * recien cuando montaba el formulario, asi que si la persona navegaba dentro de
 * la landing antes de llegar al form, la campana se perdia. Aca se capturan
 * apenas carga la pagina y se guardan en sessionStorage con politica
 * "first touch": el primer valor no vacio gana y no se pisa despues.
 */

const STORAGE_KEY = "wlt:attribution"

export type Attribution = {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  gclid: string | null
  fbclid: string | null
  referrer: string | null
  landingPath: string | null
}

const EMPTY: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  gclid: null,
  fbclid: null,
  referrer: null,
  landingPath: null,
}

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const

function readFromUrl(): Attribution {
  if (typeof window === "undefined") return EMPTY
  const params = new URLSearchParams(window.location.search)
  const fromUrl = Object.fromEntries(
    KEYS.map((key) => [key, params.get(key)])
  ) as Pick<Attribution, (typeof KEYS)[number]>

  return {
    ...fromUrl,
    referrer: document.referrer || null,
    landingPath: window.location.pathname,
  }
}

function readStored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    // sessionStorage puede lanzar en modo privado o con cookies bloqueadas.
    return null
  }
}

/** Guarda la atribucion de esta visita sin pisar valores ya capturados. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return

  const current = readFromUrl()
  const stored = readStored()

  const merged: Attribution = { ...EMPTY, ...current }
  if (stored) {
    for (const key of Object.keys(merged) as (keyof Attribution)[]) {
      // First touch: lo guardado gana salvo que este vacio.
      if (stored[key]) merged[key] = stored[key]
    }
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // Si no se puede guardar, la atribucion vive solo en esta pagina.
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY
  return readStored() ?? readFromUrl()
}

/**
 * Cookies del pixel de Meta. Se envian al webhook para que quien procese el
 * lead pueda deduplicar contra el evento del navegador via Conversions API.
 */
export function getFbpFbc(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {}
  const out: { fbp?: string; fbc?: string } = {}
  for (const chunk of document.cookie.split(";")) {
    const cookie = chunk.trim()
    if (cookie.startsWith("_fbp=")) out.fbp = decodeURIComponent(cookie.slice(5))
    if (cookie.startsWith("_fbc=")) out.fbc = decodeURIComponent(cookie.slice(5))
  }
  return out
}

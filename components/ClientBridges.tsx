"use client"

import { useEffect } from "react"
import { captureAttribution } from "@/lib/attribution"
import { trackPageView } from "@/lib/tracking"
import { FORM_ANCHOR_ID, FOCUS_FORM_EVENT } from "@/lib/scroll"
import type { AnalyticsConfig } from "@/lib/types"

/**
 * Tres comportamientos que necesitan navegador, agrupados en un solo
 * componente sin interfaz para que las secciones puedan seguir siendo Server
 * Components:
 *
 * 1. Captura la atribucion apenas carga la pagina (antes de que la persona
 *    navegue y pierda los parametros de campana).
 * 2. Registra la vista si hay analitica configurada.
 * 3. Escucha los clics a `#registro` y le pide al formulario que enfoque su
 *    primer campo. Asi los CTA son anclas normales, que funcionan incluso sin
 *    JavaScript, y no necesitan ser componentes cliente.
 */
export function ClientBridges({
  analytics,
  slug,
}: {
  analytics: AnalyticsConfig
  slug: string
}) {
  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    trackPageView(analytics, slug)
  }, [analytics, slug])

  // Entrar con /evento#registro desde un anuncio: el navegador intenta saltar
  // con el HTML inicial, pero las fuentes y las imagenes todavia estan
  // acomodandose y el destino se corre. Repetimos el salto una vez montados,
  // cuando la pagina ya tiene su altura definitiva.
  useEffect(() => {
    if (window.location.hash !== `#${FORM_ANCHOR_ID}`) return

    const target = document.getElementById(FORM_ANCHOR_ID)
    if (!target) return

    // Sin animacion: quien llega por este enlace espera aterrizar ahi, no ver
    // la pagina entera desfilar.
    target.scrollIntoView({ behavior: "instant", block: "start" })
    window.dispatchEvent(new CustomEvent(FOCUS_FORM_EVENT))
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.(`a[href="#${FORM_ANCHOR_ID}"]`)
      if (!anchor) return

      // El scroll se hace a mano, no se delega al ancla: si la URL ya termina
      // en #registro (porque la persona llego por ese enlace, o ya toco otro
      // CTA), el navegador considera que no hay nada que hacer y el boton
      // queda muerto.
      event.preventDefault()
      document.getElementById(FORM_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth" })
      window.history.replaceState(null, "", `#${FORM_ANCHOR_ID}`)
      window.dispatchEvent(new CustomEvent(FOCUS_FORM_EVENT))
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}

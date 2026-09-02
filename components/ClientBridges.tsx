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

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.(`a[href="#${FORM_ANCHOR_ID}"]`)
      if (!anchor) return
      // El scroll lo hace el navegador con el ancla nativa; aca solo pedimos foco.
      window.dispatchEvent(new CustomEvent(FOCUS_FORM_EVENT))
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}

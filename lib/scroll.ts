/** Ancla del formulario. Todos los CTA internos apuntan aca. */
export const FORM_ANCHOR_ID = "registro"

/** Evento con el que un CTA le pide al formulario que enfoque su primer campo. */
export const FOCUS_FORM_EVENT = "wlt:focus-form"

/**
 * Lleva al formulario con scroll suave y pide foco. Portado del original: el
 * CTA no conoce al formulario, solo grita por `window` y el formulario escucha.
 */
export function scrollToForm(event?: { preventDefault: () => void }) {
  event?.preventDefault()
  const el = document.getElementById(FORM_ANCHOR_ID)
  el?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", `#${FORM_ANCHOR_ID}`)
  window.dispatchEvent(new CustomEvent(FOCUS_FORM_EVENT))
}

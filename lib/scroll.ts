/** Ancla del formulario. Todos los CTA internos apuntan aca. */
export const FORM_ANCHOR_ID = "registro"

/** Marca de cada formulario de la pagina; puede haber mas de uno. */
export const FORM_MARKER = "data-registration-form"

/** Evento que avisa a los demas formularios que ya hubo un registro. */
export const REGISTERED_EVENT = "wlt:registered"

/**
 * Devuelve el formulario mas conveniente para el punto de la pagina en que
 * esta la persona: el primero que quede por debajo de su vista y, si ya los
 * paso todos, el ultimo. Con un solo formulario en la pagina siempre devuelve
 * ese; con dos (uno arriba y otro al final) evita mandar a alguien que esta
 * abajo de vuelta al principio.
 */
export function findNearestForm(): HTMLElement | null {
  if (typeof document === "undefined") return null

  const forms = Array.from(document.querySelectorAll<HTMLElement>(`[${FORM_MARKER}]`))
  if (forms.length === 0) return document.getElementById(FORM_ANCHOR_ID)

  const below = forms.find((el) => el.getBoundingClientRect().top > 8)
  return below ?? forms[forms.length - 1]
}

/** Evento con el que un CTA le pide al formulario que enfoque su primer campo. */
export const FOCUS_FORM_EVENT = "wlt:focus-form"

/**
 * Lleva al formulario con scroll suave y pide foco. Portado del original: el
 * CTA no conoce al formulario, solo grita por `window` y el formulario escucha.
 */
export function scrollToForm(event?: { preventDefault: () => void }) {
  event?.preventDefault()
  const el = findNearestForm()
  el?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", `#${FORM_ANCHOR_ID}`)
  window.dispatchEvent(new CustomEvent(FOCUS_FORM_EVENT))
}

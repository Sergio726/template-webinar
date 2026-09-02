import type { EventConfig } from "./types"

/**
 * Estado de la inscripcion segun el reloj.
 *
 * Vive fuera de los componentes a proposito. Leer la hora es una operacion
 * impura, y React pide que el render no dependa de valores que cambian solos:
 * dentro de un componente, el compilador lo marca. Aca es correcto y explicito
 * — la pagina es estatica y se regenera cada hora, asi que esta funcion se
 * evalua en cada regeneracion, no en cada visita.
 */
export function isRegistrationClosed(config: EventConfig, now = Date.now()): boolean {
  const closesAt = config.event.registrationClosesAt
  if (!closesAt) return false
  return now > new Date(closesAt).getTime()
}

/** Marca temporal de apertura del formulario, para detectar envios de bots. */
export function stamp(): number {
  return Date.now()
}

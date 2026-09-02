import { z } from "zod"
import type { FormField } from "./types"

/**
 * Construye el validador del formulario a partir de los campos declarados en el
 * config.
 *
 * El mismo builder corre en el navegador (para marcar errores mientras se
 * escribe) y en el servidor (para no confiar en lo que llega). En el servidor se
 * reconstruye desde el config del evento, nunca desde lo que mandó el cliente:
 * si alguien manipula el payload, la forma esperada sigue siendo la del config.
 */
export function buildFormSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    let rule: z.ZodTypeAny

    switch (field.type) {
      case "email":
        rule = z.string().trim().email("Ingresá un email válido")
        break

      case "phone":
        // Sólo dígitos, sin el prefijo (que viaja aparte).
        rule = z
          .string()
          .trim()
          .regex(/^\d{6,15}$/, "Ingresá un número válido")
        break

      case "select":
        rule = z.enum(field.options.map((o) => o.value) as [string, ...string[]])
        break

      case "textarea":
      case "text":
      default:
        rule = z.string().trim().min(1, `Completá ${field.label.toLowerCase()}`)
        break
    }

    // Un campo opcional acepta el string vacío y lo normaliza a undefined.
    shape[field.name] = field.required
      ? rule
      : z.union([rule, z.literal("")]).transform((v) => (v === "" ? undefined : v)).optional()
  }

  return z.object(shape)
}

/** Prefijo telefónico: se valida aparte porque no es un campo editable libre. */
export const dialCodeSchema = z.string().regex(/^\+\d{1,4}$/, "Prefijo inválido")

export type FormValues = Record<string, string>

/** Valores iniciales vacíos para todos los campos declarados. */
export function emptyValues(fields: FormField[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, ""]))
}

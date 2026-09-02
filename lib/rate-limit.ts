/**
 * Limitador de envios por ventana fija, en memoria.
 *
 * Alcance real: frena scripts triviales y clics repetidos. En un deploy
 * serverless con varias instancias el contador es POR INSTANCIA, asi que no
 * sirve contra un ataque distribuido. Toda la logica vive en una sola funcion
 * a proposito: para cambiarlo por Redis/Upstash se reemplaza el cuerpo de
 * `checkRateLimit` y nada mas del proyecto se entera.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitRule = { limit: number; windowMs: number }

/** Dos reglas encadenadas: un tope por rafaga y otro por ventana larga. */
export const DEFAULT_RULES: RateLimitRule[] = [
  { limit: 1, windowMs: 30_000 },
  { limit: 5, windowMs: 10 * 60_000 },
]

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number }

function sweep(now: number) {
  // Barrido perezoso: evita que el Map crezca sin limite en procesos largos.
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function checkRateLimit(
  key: string,
  rules: RateLimitRule[] = DEFAULT_RULES
): RateLimitResult {
  const now = Date.now()
  if (buckets.size > 500) sweep(now)

  for (const [index, rule] of rules.entries()) {
    const bucketKey = `${key}:${index}`
    const bucket = buckets.get(bucketKey)

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(bucketKey, { count: 1, resetAt: now + rule.windowMs })
      continue
    }

    if (bucket.count >= rule.limit) {
      return {
        ok: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      }
    }

    bucket.count += 1
  }

  return { ok: true, retryAfterSeconds: 0 }
}

/** Solo para los tests: vacia el estado entre casos. */
export function resetRateLimit() {
  buckets.clear()
}

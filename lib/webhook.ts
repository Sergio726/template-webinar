/**
 * Entrega del lead al webhook configurado.
 *
 * Reemplaza al CRM del proyecto original: en vez de hablar con un proveedor
 * concreto, se hace POST de un JSON estable a una URL que sale de una variable
 * de entorno. Del otro lado puede haber n8n, Make, Zapier, Apps Script o un
 * backend propio.
 */

const DEFAULT_TIMEOUT_MS = 8000

export type WebhookResult =
  | { ok: true; status: number }
  | { ok: false; status: number | null; error: string }

/** Errores transitorios: vale la pena un reintento. Un 4xx no. */
function isRetryable(status: number): boolean {
  return status === 408 || status === 429 || status >= 500
}

async function postOnce(
  url: string,
  payload: unknown,
  requestId: string,
  timeoutMs: number
): Promise<WebhookResult> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "webinar-landing-template/1",
      "X-Request-Id": requestId,
    }

    // Header de autenticacion opcional: n8n y Make lo aceptan, Zapier lo ignora.
    const secret = process.env.WEBHOOK_SECRET
    if (secret) headers.Authorization = `Bearer ${secret}`

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (!res.ok) {
      return { ok: false, status: res.status, error: `El webhook respondio ${res.status}` }
    }
    return { ok: true, status: res.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { ok: false, status: null, error: message }
  }
}

/** Envia el payload con un reintento ante fallos transitorios. */
export async function deliverToWebhook(
  url: string,
  payload: unknown,
  requestId: string
): Promise<WebhookResult> {
  const timeoutMs = Number(process.env.WEBHOOK_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS)

  const first = await postOnce(url, payload, requestId, timeoutMs)
  if (first.ok) return first
  if (first.status !== null && !isRetryable(first.status)) return first

  await new Promise((resolve) => setTimeout(resolve, 400))
  return postOnce(url, payload, requestId, timeoutMs)
}

import { NextResponse } from "next/server"
import { createHash, randomUUID } from "node:crypto"
import { z } from "zod"
import { getEvent } from "@/events"
import { buildFormSchema } from "@/lib/form-schema"
import { dialToCountryName } from "@/lib/countries"
import { checkRateLimit } from "@/lib/rate-limit"
import { deliverToWebhook } from "@/lib/webhook"

/**
 * Recepción del registro.
 *
 * El navegador nunca habla directo con el webhook: postea acá y este handler
 * reenvía. Así la URL de destino y su token no entran nunca al bundle público,
 * no hay que pelear con CORS, y queda un lugar donde validar de verdad — el
 * cliente valida para dar buenos mensajes, el servidor valida para decidir.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Sobre externo. Los campos del lead se validan después, contra el config. */
const envelopeSchema = z.object({
  slug: z.string().min(1),
  values: z.record(z.string(), z.string()),
  dialCode: z.string().regex(/^\+\d{1,4}$/).optional(),
  attribution: z.record(z.string(), z.string().nullable()).optional(),
  meta: z
    .object({
      eventId: z.string().optional(),
      fbp: z.string().optional(),
      fbc: z.string().optional(),
      pageUrl: z.string().optional(),
    })
    .optional(),
  hp: z.object({ website: z.string(), renderedAt: z.number() }).optional(),
})

/** Un formulario completado en menos de esto no lo llenó una persona. */
const MIN_FILL_MS = 2500
const MAX_BODY_BYTES = 8192

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

/** La IP no se guarda en claro para limitar: sólo se necesita su huella. */
function rateLimitKey(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "webinar-landing-template"
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex")
}

export async function POST(request: Request) {
  const requestId = randomUUID()

  const declaredLength = Number(request.headers.get("content-length") ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const envelope = envelopeSchema.safeParse(raw)
  if (!envelope.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 })
  }

  const { slug, values, dialCode, attribution, meta, hp } = envelope.data

  const config = getEvent(slug)
  if (!config) {
    return NextResponse.json({ error: "unknown_event" }, { status: 404 })
  }

  // Trampa antibot. Se responde OK a propósito: si le devolviéramos un error,
  // quien automatiza el envío sabría exactamente qué corregir.
  if (hp && (hp.website !== "" || Date.now() - hp.renderedAt < MIN_FILL_MS)) {
    console.warn("[register] descartado por honeypot", { requestId, slug })
    return NextResponse.json({ ok: true })
  }

  const closesAt = config.event.registrationClosesAt
  if (closesAt && Date.now() > new Date(closesAt).getTime()) {
    return NextResponse.json({ error: "registration_closed" }, { status: 410 })
  }

  // Se revalida con el esquema reconstruido desde el config del servidor, no
  // desde nada que haya mandado el cliente.
  //
  // Va antes del límite de envíos a propósito: un dato mal escrito no debería
  // gastar la cuota y dejar a una persona esperando medio minuto para corregir
  // una letra. Un rechazo por validación es barato y nunca toca el webhook.
  const parsed = buildFormSchema(config.form.fields).safeParse(values)
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 })
  }

  const limit = checkRateLimit(rateLimitKey(clientIp(request)))
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  const webhookUrl = process.env[config.integration.webhookEnvVar]
  if (!webhookUrl) {
    console.error("[register] falta la variable de entorno del webhook", {
      requestId,
      slug,
      envVar: config.integration.webhookEnvVar,
    })
    return NextResponse.json({ error: "not_configured" }, { status: 500 })
  }

  const phoneField = config.form.fields.find((field) => field.type === "phone")
  const phoneRaw = phoneField ? (parsed.data[phoneField.name] as string | undefined) : undefined
  const dial = dialCode ?? (phoneField?.type === "phone" ? phoneField.defaultDialCode : undefined)

  const payload = {
    /** Versión del contrato: permite evolucionar sin romper integraciones. */
    schemaVersion: 1,
    requestId,
    submittedAt: new Date().toISOString(),
    event: {
      slug: config.slug,
      name: config.seo.title,
      organization: config.brand.name,
      startsAt: config.event.date,
      timeZone: config.event.timeZone,
      tag: config.form.leadTag ?? config.slug,
    },
    lead: {
      ...parsed.data,
      ...(phoneRaw && dial
        ? {
            phone: {
              e164: `${dial}${phoneRaw.replace(/\s/g, "")}`,
              dialCode: dial,
              national: phoneRaw.replace(/\s/g, ""),
              country: dialToCountryName(dial),
            },
          }
        : {}),
    },
    attribution: attribution ?? {},
    tracking: {
      eventId: meta?.eventId ?? null,
      fbp: meta?.fbp ?? null,
      fbc: meta?.fbc ?? null,
      pageUrl: meta?.pageUrl ?? null,
      userAgent: request.headers.get("user-agent"),
    },
    tags: config.integration.tags,
    extra: config.integration.extra,
  }

  const delivery = await deliverToWebhook(webhookUrl, payload, requestId)

  if (!delivery.ok) {
    // El detalle queda en el log del servidor; afuera sólo un código genérico.
    console.error("[register] fallo la entrega", {
      requestId,
      slug,
      status: delivery.status,
      error: delivery.error,
    })
    return NextResponse.json({ error: "delivery_failed", requestId }, { status: 502 })
  }

  return NextResponse.json({ ok: true, requestId })
}

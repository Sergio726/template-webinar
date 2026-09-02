"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CtaButton } from "@/components/ui/CtaButton"
import { Badge } from "@/components/ui/Badge"
import { Heading } from "@/components/ui/Heading"
import { TextInput, TextArea, SelectInput, FieldShell } from "@/components/ui/Field"
import { PhoneField } from "@/components/form/PhoneField"
import { SuccessCard } from "@/components/form/SuccessCard"
import { buildFormSchema, emptyValues, type FormValues } from "@/lib/form-schema"
import { readAttribution, getFbpFbc } from "@/lib/attribution"
import { trackRegistration } from "@/lib/tracking"
import { FORM_ANCHOR_ID, FOCUS_FORM_EVENT } from "@/lib/scroll"
import { useOfferWindow } from "@/lib/use-offer-window"
import type { EventConfig, SectionOf } from "@/lib/types"

/**
 * Formulario de registro.
 *
 * Conserva del proyecto original la estructura de tres estados excluyentes
 * —cerrado, enviado, formulario— y cambia el destino: en vez de hablar con un
 * CRM concreto, hace POST a nuestro propio route handler, que reenvía al webhook
 * que cada quien configure.
 */
export function RegistrationForm({
  section,
  config,
  initiallyClosed = false,
}: {
  section: SectionOf<"form">
  config: EventConfig
  /** Estado calculado en el servidor; evita el parpadeo al hidratar. */
  initiallyClosed?: boolean
}) {
  const { form, event, analytics, slug } = config

  const [values, setValues] = useState<FormValues>(() => emptyValues(form.fields))
  const [dialCode, setDialCode] = useState(() => {
    const phoneField = form.fields.find((f) => f.type === "phone")
    return phoneField && phoneField.type === "phone" ? phoneField.defaultDialCode : "+57"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const firstFieldRef = useRef<HTMLInputElement>(null)
  // Marca temporal de renderizado: un envío casi instantáneo delata un bot.
  const renderedAt = useRef(Date.now())
  const [honeypot, setHoneypot] = useState("")

  const { expired, ready } = useOfferWindow(form.closed ? event.registrationClosesAt : null)

  // Un CTA de cualquier sección pide foco gritando por `window`.
  useEffect(() => {
    const onFocusRequest = () => firstFieldRef.current?.focus()
    window.addEventListener(FOCUS_FORM_EVENT, onFocusRequest)
    return () => window.removeEventListener(FOCUS_FORM_EVENT, onFocusRequest)
  }, [])

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleSubmit = useCallback(
    async (submitEvent: React.FormEvent) => {
      submitEvent.preventDefault()

      const parsed = buildFormSchema(form.fields).safeParse(values)
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? "")
          if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
        }
        setErrors(fieldErrors)
        return
      }

      setSubmitting(true)
      setSubmitError(null)

      // Identificador compartido con el píxel: permite que quien procese el
      // lead lo deduplique contra el evento del navegador.
      const eventId = crypto.randomUUID()

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            values,
            dialCode,
            attribution: readAttribution(),
            meta: {
              eventId,
              ...getFbpFbc(),
              pageUrl: window.location.href,
            },
            hp: { website: honeypot, renderedAt: renderedAt.current },
          }),
          signal: AbortSignal.timeout(15000),
        })

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(messageForError(body.error))
        }

        trackRegistration(analytics, slug, eventId)
        setSubmitted(true)
      } catch (error) {
        setSubmitError(
          error instanceof Error && error.message
            ? error.message
            : "No pudimos completar tu registro. Intentá de nuevo."
        )
      } finally {
        setSubmitting(false)
      }
    },
    [analytics, dialCode, form.fields, honeypot, slug, values]
  )

  // Antes de hidratar mandamos lo que decidió el servidor, que es lo que ya
  // está pintado en pantalla; una vez que el reloj del navegador arranca, gana
  // la hora real. Así el primer render coincide y no hay parpadeo ni aviso de
  // hidratación.
  const isClosed = Boolean(form.closed) && (ready ? expired : initiallyClosed)

  return (
    <section id={FORM_ANCHOR_ID} className="bg-surface scroll-mt-8 px-4 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-lg">
        <AnimatePresence mode="wait">
          {isClosed ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-card border-hairline bg-surface-alt border p-8 text-center"
            >
              <h2 className="font-display text-ink text-2xl font-bold">
                {form.closed?.title}
              </h2>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">{form.closed?.body}</p>
              {form.closed?.cta ? (
                <div className="mx-auto mt-6 max-w-xs">
                  <CtaButton
                    label={form.closed.cta.label}
                    href={form.closed.cta.href ?? "/"}
                    variant="secondary"
                  />
                </div>
              ) : null}
            </motion.div>
          ) : submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <SuccessCard config={config} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="mb-7 text-center">
                {section.badge ? (
                  <Badge tone="brand" className="mb-4">
                    {section.badge}
                  </Badge>
                ) : null}
                <Heading
                  eyebrow={section.eyebrow}
                  title={section.headline}
                  highlight={section.headlineHighlight}
                />
                {section.subcopy ? (
                  <p className="text-ink-muted mt-3 text-sm">{section.subcopy}</p>
                ) : null}
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-card border-hairline bg-surface-alt space-y-4 border p-6 shadow-lg sm:p-8"
              >
                {form.fields.map((field, index) => {
                  const id = `field-${field.name}`
                  const error = errors[field.name]

                  return (
                    <FieldShell
                      key={field.name}
                      id={id}
                      label={field.label}
                      required={field.required}
                      error={error}
                    >
                      {field.type === "phone" ? (
                        <PhoneField
                          id={id}
                          value={values[field.name] ?? ""}
                          dialCode={dialCode}
                          placeholder={field.placeholder}
                          invalid={Boolean(error)}
                          onValueChange={(value) => handleChange(field.name, value)}
                          onDialChange={setDialCode}
                        />
                      ) : field.type === "select" ? (
                        <SelectInput
                          id={id}
                          value={values[field.name] ?? ""}
                          invalid={Boolean(error)}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                          <option value="">{field.placeholder ?? "Elegí una opción"}</option>
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectInput>
                      ) : field.type === "textarea" ? (
                        <TextArea
                          id={id}
                          rows={field.rows}
                          value={values[field.name] ?? ""}
                          placeholder={field.placeholder}
                          invalid={Boolean(error)}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                      ) : (
                        <TextInput
                          id={id}
                          ref={index === 0 ? firstFieldRef : undefined}
                          type={field.type === "email" ? "email" : "text"}
                          autoComplete={field.type === "email" ? "email" : undefined}
                          value={values[field.name] ?? ""}
                          placeholder={field.placeholder}
                          invalid={Boolean(error)}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                      )}
                    </FieldShell>
                  )
                })}

                {/*
                  Trampa para bots: invisible y fuera del orden de tabulación,
                  pero presente en el DOM. Un humano nunca la completa.
                */}
                <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">No completar</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {submitError ? (
                  <p role="alert" className="text-center text-sm text-red-500">
                    {submitError}
                  </p>
                ) : null}

                <CtaButton
                  label={section.submitLabel}
                  loadingLabel={section.submittingLabel}
                  loading={submitting}
                  type="submit"
                  size="lg"
                  icon="Send"
                />

                {section.disclaimer ? (
                  <p className="text-ink-muted text-center text-xs">{section.disclaimer}</p>
                ) : null}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** Traduce el código del servidor a algo que la persona pueda entender. */
function messageForError(code?: string): string {
  switch (code) {
    case "rate_limited":
      return "Esperá unos segundos antes de volver a intentar."
    case "registration_closed":
      return "Las inscripciones ya se cerraron."
    case "validation":
      return "Revisá los datos ingresados."
    default:
      return "No pudimos completar tu registro. Intentá de nuevo."
  }
}

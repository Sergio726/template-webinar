import { CheckCircle2 } from "lucide-react"
import { CtaButton } from "@/components/ui/CtaButton"
import { RichText } from "@/components/ui/RichText"
import { googleCalendarUrl } from "@/lib/calendar"
import { cn } from "@/lib/utils"
import type { EventConfig } from "@/lib/types"

/**
 * Qué se ve después de registrarse.
 *
 * En el proyecto original esta tarjeta era, literalmente, "unite al grupo de
 * WhatsApp", con la URL del grupo escrita dentro del componente. Acá el paso
 * siguiente es configurable: puede ser un grupo, un canal, agendar el evento,
 * descargar algo, o simplemente la confirmación.
 */

/** Qué icono y qué estilo corresponden a cada tipo de acción. */
const ACTION_PRESETS = {
  primary: { icon: "ArrowRight", variant: "primary" },
  whatsapp: { icon: "whatsapp", variant: "whatsapp" },
  telegram: { icon: "telegram", variant: "telegram" },
  calendar: { icon: "CalendarPlus", variant: "calendar" },
  download: { icon: "Download", variant: "download" },
} as const

export function SuccessCard({
  config,
  className,
  showLogo = false,
}: {
  config: EventConfig
  className?: string
  showLogo?: boolean
}) {
  const { success } = config
  const preset = success.cta ? ACTION_PRESETS[success.cta.variant] : null

  // "calendar" acepta el marcador `auto` para que el link se arme solo con la
  // fecha del evento, sin que nadie tenga que pegar una URL de Google Calendar.
  const href =
    success.cta?.variant === "calendar" && success.cta.href === "auto"
      ? googleCalendarUrl(config)
      : success.cta?.href

  return (
    <div
      className={cn(
        "rounded-card border-hairline bg-surface-alt mx-auto w-full max-w-lg border p-8 text-center shadow-lg",
        className
      )}
    >
      {showLogo && config.brand.logo?.light ? (
        // eslint-disable-next-line @next/next/no-img-element -- el logo puede ser un SVG externo sin dimensiones conocidas
        <img
          src={config.brand.logo.light}
          alt={config.brand.name}
          className="mx-auto mb-6 h-8 w-auto object-contain"
        />
      ) : null}

      <span className="bg-brand-wash mx-auto flex h-14 w-14 items-center justify-center rounded-full">
        <CheckCircle2 className="text-brand-dark h-7 w-7" aria-hidden />
      </span>

      <h2 className="font-display text-ink mt-5 text-2xl font-bold text-balance">
        {success.title}
      </h2>

      {success.lines.length > 0 ? (
        <div className="mt-4 space-y-2">
          {success.lines.map((line, index) => (
            <RichText
              key={index}
              text={line}
              className="text-ink-muted text-sm leading-relaxed"
            />
          ))}
        </div>
      ) : null}

      {success.cta && preset && href ? (
        <div className="mt-7">
          <CtaButton
            label={success.cta.label}
            href={href}
            icon={preset.icon}
            variant={preset.variant}
            size="lg"
          />
        </div>
      ) : null}

      {success.footnote ? (
        <p className="text-ink-muted mt-5 text-xs">{success.footnote}</p>
      ) : null}
    </div>
  )
}

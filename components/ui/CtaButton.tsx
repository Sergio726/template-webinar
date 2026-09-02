import Link from "next/link"
import type { MouseEventHandler, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Icon, BrandGlyph } from "./Icon"

export type CtaVariant = "primary" | "secondary" | "whatsapp" | "telegram" | "calendar" | "download"
export type CtaSize = "md" | "lg"

type CtaButtonProps = {
  label: string
  /** Enlace externo o ancla. Excluyente con `to` y `onClick`. */
  href?: string | null
  /** Ruta interna. */
  to?: string
  onClick?: MouseEventHandler<HTMLElement>
  variant?: CtaVariant
  size?: CtaSize
  type?: "button" | "submit"
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  /** Nombre de un icono de lucide, o "whatsapp" / "telegram" / "discord". */
  icon?: string | null
  ariaLabel?: string
  className?: string
  children?: ReactNode
}

/**
 * El único botón de acción del proyecto.
 *
 * Es el `CtaButton` del original, con dos deudas saldadas: ya no importa el
 * contexto de settings (que arrastraba la base de datos a todo consumidor) y
 * los colores salen de tokens, así que el mismo botón sirve para cualquier
 * marca. Sigue siendo polimórfico: `Link`, `<a>` o `<button>` según las props.
 */
const VARIANTS: Record<CtaVariant, string> = {
  primary:
    "bg-brand text-on-brand shadow-md hover:bg-brand-dark focus-visible:ring-brand",
  secondary:
    "border border-hairline bg-surface-alt text-ink hover:border-brand hover:text-brand focus-visible:ring-brand",
  whatsapp: "bg-[#25D366] text-white shadow-md hover:bg-[#20BD5A] focus-visible:ring-[#25D366]",
  telegram: "bg-[#229ED9] text-white shadow-md hover:bg-[#1C87BA] focus-visible:ring-[#229ED9]",
  calendar:
    "border border-hairline bg-surface-alt text-ink hover:border-brand hover:text-brand focus-visible:ring-brand",
  download:
    "border border-hairline bg-surface-alt text-ink hover:border-brand hover:text-brand focus-visible:ring-brand",
}

const SIZES: Record<CtaSize, string> = {
  md: "min-h-[44px] px-6 py-3 text-sm",
  lg: "min-h-[52px] px-8 py-3.5 text-base",
}

const BASE =
  "cta-shine rounded-pill inline-flex w-full items-center justify-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"

/** Las marcas se dibujan a mano; el resto sale de lucide. */
const BRAND_GLYPHS = new Set(["whatsapp", "telegram", "discord"])

export function CtaButton({
  label,
  href,
  to,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  loadingLabel,
  icon,
  ariaLabel,
  className,
  children,
}: CtaButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)

  const glyph = icon
    ? BRAND_GLYPHS.has(icon)
      ? <BrandGlyph name={icon} className="h-4 w-4 shrink-0" />
      : <Icon name={icon} className="h-4 w-4 shrink-0" />
    : null

  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        glyph
      )}
      <span>{loading ? (loadingLabel ?? label) : label}</span>
      {children}
    </>
  )

  if (to && !disabled) {
    return (
      <Link href={to} aria-label={ariaLabel ?? label} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (href && !disabled) {
    const isAnchor = href.startsWith("#")
    return (
      <a
        href={href}
        target={isAnchor ? undefined : "_blank"}
        rel={isAnchor ? undefined : "noopener noreferrer"}
        aria-label={ariaLabel ?? label}
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  )
}

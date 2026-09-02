import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/lib/types"

/**
 * Fondo decorativo abstracto.
 *
 * Sustituye al fondo del proyecto original, que dibujaba aviones, pines y rutas
 * punteadas — una narrativa de migración que sólo servía para ese negocio. Estas
 * variantes son geométricas y sin significado, así que funcionan igual para una
 * clínica, una fintech o un curso de cocina. Todas se pintan con el color de
 * marca del evento, de modo que cambian de carácter al cambiar el tema.
 */
export function Backdrop({
  variant,
  className,
}: {
  variant: ThemeConfig["backdrop"]
  className?: string
}) {
  if (variant === "none") return null

  const base = cn("pointer-events-none absolute inset-0 overflow-hidden", className)

  if (variant === "mesh") {
    return (
      <div className={base} aria-hidden>
        <div
          className="absolute -top-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-1/3 -left-1/4 h-[60vh] w-[60vh] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand-light) 0%, transparent 70%)" }}
        />
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={base} aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            // Se desvanece hacia abajo para que no compita con el contenido.
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
        <div
          className="absolute top-0 right-0 h-[50vh] w-[50vh] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />
      </div>
    )
  }

  if (variant === "waves") {
    return (
      <div className={base} aria-hidden>
        <svg
          className="absolute inset-x-0 bottom-0 h-1/2 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--brand)"
            fillOpacity="0.10"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L0,320Z"
          />
          <path
            fill="var(--brand-light)"
            fillOpacity="0.14"
            d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,256C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L0,320Z"
          />
        </svg>
      </div>
    )
  }

  // aurora
  return (
    <div className={base} aria-hidden>
      <div
        className="absolute inset-x-0 top-0 h-[60vh] opacity-25 blur-3xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, var(--brand) 0deg, transparent 90deg, var(--brand-light) 180deg, transparent 270deg, var(--brand) 360deg)",
        }}
      />
    </div>
  )
}

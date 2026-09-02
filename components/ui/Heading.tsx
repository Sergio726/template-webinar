import { cn } from "@/lib/utils"

/**
 * Titular de seccion con una mitad resaltada en el color de marca. Consolida el
 * patron que en el proyecto original estaba copiado a mano en cada seccion.
 */
export function Heading({
  title,
  highlight,
  eyebrow,
  className,
  as: Tag = "h2",
  align = "center",
}: {
  title?: string
  highlight?: string
  eyebrow?: string
  className?: string
  as?: "h1" | "h2" | "h3"
  align?: "center" | "left"
}) {
  if (!title && !highlight && !eyebrow) return null

  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="text-brand-dark mb-3 text-xs font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
      ) : null}
      {title || highlight ? (
        <Tag
          className={cn(
            "font-display text-ink font-bold text-balance",
            Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
          )}
        >
          {title}
          {highlight ? (
            <>
              {title ? " " : ""}
              <span className="text-brand">{highlight}</span>
            </>
          ) : null}
        </Tag>
      ) : null}
    </div>
  )
}

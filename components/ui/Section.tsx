import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Envoltorio de seccion: ancho, aire vertical y fondo por token. */
export function Section({
  children,
  className,
  background = "surface",
  id,
}: {
  children: ReactNode
  className?: string
  background?: "surface" | "alt" | "ink" | "transparent"
  id?: string
}) {
  const backgrounds = {
    surface: "bg-surface",
    alt: "bg-surface-alt",
    ink: "bg-ink text-surface",
    transparent: "",
  } as const

  return (
    <section id={id} className={cn("relative px-4 py-16 sm:py-20", backgrounds[background], className)}>
      <div className="relative mx-auto w-full max-w-5xl">{children}</div>
    </section>
  )
}

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Pildora para eyebrows y avisos de urgencia. */
export function Badge({
  children,
  className,
  tone = "brand",
  shine = false,
}: {
  children: ReactNode
  className?: string
  tone?: "brand" | "neutral" | "solid"
  shine?: boolean
}) {
  const tones = {
    brand: "bg-brand-wash text-brand-dark",
    neutral: "bg-elevated text-ink-muted",
    solid: "bg-brand text-on-brand",
  } as const

  return (
    <span
      className={cn(
        "rounded-pill inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        shine && "badge-shine",
        className
      )}
    >
      {children}
    </span>
  )
}

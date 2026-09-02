"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useOfferWindow } from "@/lib/use-offer-window"
import { cn } from "@/lib/utils"
import type { CountdownLabels } from "@/lib/types"

/**
 * Cuenta regresiva con dígitos que giran.
 *
 * Portada del proyecto original con dos cambios: las etiquetas llegan por props
 * desde el config (antes venían de i18next, que la plantilla no necesita) y los
 * colores son tokens, así que el contador se tiñe solo con el tema del evento.
 */

const FlipDigit = memo(function FlipDigit({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")

  return (
    <div className="relative flex h-9 items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={formatted}
          initial={{ y: -28, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 28, opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-display text-2xl leading-none font-bold tabular-nums sm:text-3xl"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  )
})

type BlockTone = "default" | "accent" | "hot"

const BLOCK_STYLES: Record<BlockTone, string> = {
  default: "border-hairline bg-surface-alt text-ink shadow-sm",
  accent: "border-brand/30 bg-brand-wash text-ink shadow-sm",
  hot: "border-brand bg-brand text-on-brand shadow-md",
}

const LABEL_STYLES: Record<BlockTone, string> = {
  default: "text-ink-muted",
  accent: "text-brand-dark",
  hot: "text-brand-dark font-semibold",
}

const Block = memo(function Block({
  value,
  label,
  tone = "default",
}: {
  value: number
  label: string
  tone?: BlockTone
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "rounded-control flex h-16 w-16 items-center justify-center border sm:h-20 sm:w-20",
          BLOCK_STYLES[tone]
        )}
      >
        <FlipDigit value={value} />
      </div>
      <span className={cn("mt-2 text-[10px] tracking-widest uppercase sm:text-xs", LABEL_STYLES[tone])}>
        {label}
      </span>
    </div>
  )
})

export function Countdown({
  targetDate,
  labels,
  className,
}: {
  targetDate: string
  labels: CountdownLabels
  className?: string
}) {
  const { timeLeft, ready } = useOfferWindow(targetDate)

  // Antes de montar no sabemos la hora real; ver la nota en useOfferWindow.
  if (!ready || !timeLeft) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className ?? "mt-8"}
    >
      <p className="text-ink-muted mb-4 text-center text-xs tracking-widest uppercase sm:text-sm">
        {labels.intro}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label={labels.days} />
        <span className="text-ink-muted -mt-6 text-2xl font-bold">:</span>
        <Block value={timeLeft.hours} label={labels.hours} />
        <span className="text-ink-muted -mt-6 text-2xl font-bold">:</span>
        <Block value={timeLeft.minutes} label={labels.minutes} tone="accent" />
        <span className="text-brand -mt-6 text-xl font-bold">:</span>
        <Block value={timeLeft.seconds} label={labels.seconds} tone="hot" />
      </div>
    </motion.div>
  )
}

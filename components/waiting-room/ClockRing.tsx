"use client"

import { memo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Reloj de la sala: anillo de progreso y dígitos que giran.
 *
 * El anillo se mueve con una transición CSS de un segundo, la misma cadencia
 * con la que llega el dato: animarlo desde JavaScript obligaría a un tick por
 * cuadro para ganar una suavidad que el navegador ya interpola solo.
 */

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Últimos segundos: el reloj se tiñe de marca y late. */
const URGENT_AT = 10

const Segment = memo(function Segment({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")

  return (
    /*
     * Sin máscara de altura fija: a este tamaño cada familia tipográfica tiene
     * sus propias métricas y un recorte en `em` le come los glifos a alguna.
     * El giro se sugiere con un desplazamiento corto y la opacidad, y
     * `popLayout` saca del flujo al dígito que se va para que el que entra no
     * empuje la línea.
     */
    <span className="relative inline-flex items-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={formatted}
          initial={{ y: "-28%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "28%", opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="tabular-nums"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  )
})

export function ClockRing({
  remaining,
  total,
  className,
}: {
  /** Segundos que faltan. */
  remaining: number
  /** Duración completa del conteo, para calcular la fracción del anillo. */
  total: number
  className?: string
}) {
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const fraction = total > 0 ? remaining / total : 0
  const urgent = remaining <= URGENT_AT && remaining > 0

  return (
    <div
      className={cn(
        "relative grid aspect-square w-[min(84vw,30rem)] place-items-center",
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--stage-line)"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE.toFixed(2)}
          strokeDashoffset={(CIRCUMFERENCE * (1 - fraction)).toFixed(2)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>

      <motion.div
        role="timer"
        aria-live="off"
        animate={urgent ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={urgent ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        className={cn(
          // El reloj tiene que caber dentro del anillo: cuatro dígitos tabulares
          // más los dos puntos rondan las 5 em, contra las 30 rem del círculo.
          "font-display flex items-center text-[clamp(2.25rem,8.5vw,4.75rem)] leading-none font-bold",
          urgent ? "text-brand" : "text-stage-fg"
        )}
      >
        <Segment value={minutes} />
        <span className="text-stage-muted px-[0.06em]">:</span>
        <Segment value={seconds} />
      </motion.div>

      {/*
        Lectura para lectores de pantalla, que no siguen dígitos que giran. Sin
        `aria-live`: anunciar cada segundo durante diez minutos no informa, tapa
        todo lo demás.
      */}
      <span className="sr-only">{`Faltan ${minutes} minutos y ${seconds} segundos`}</span>
    </div>
  )
}

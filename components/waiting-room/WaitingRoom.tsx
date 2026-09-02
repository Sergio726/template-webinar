"use client"

import { useCallback, useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Minus, Play, Plus, RotateCcw } from "lucide-react"
import {
  MAX_LAUNCH_MINUTES,
  MIN_LAUNCH_MINUTES,
  useLaunchTimer,
} from "@/lib/use-launch-timer"
import type { ThemeConfig, WaitingRoomConfig } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChatBubbles } from "./ChatBubbles"
import { ClockRing } from "./ClockRing"
import { Confetti } from "./Confetti"

/**
 * Sala de espera del evento.
 *
 * Se proyecta en la transmisión durante los minutos previos: quien opera elige
 * la duración, pulsa Iniciar y el reloj corre hasta cero. Es la única pantalla
 * del proyecto pensada para verse a varios metros, así que todo está en escala
 * grande y sobre fondo oscuro.
 *
 * Vive fuera de la landing a propósito. La landing convence y captura datos; la
 * sala no tiene formulario, ni CTA, ni analítica que perseguir, y su reloj
 * cuenta una duración elegida a mano en vez de la fecha del config.
 */

const PANEL_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const

/** Pantalla completa al iniciar. Silencioso si el navegador la niega. */
function requestFullscreen() {
  const element = document.documentElement
  if (document.fullscreenElement || !element.requestFullscreen) return
  void element.requestFullscreen().catch(() => {})
}

function Panel({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <motion.section
      key={id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98 }}
      transition={PANEL_TRANSITION}
      className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center"
    >
      {children}
    </motion.section>
  )
}

export function WaitingRoom({
  config,
  theme,
  brandName,
  slug,
}: {
  config: WaitingRoomConfig
  theme: ThemeConfig
  brandName: string
  slug: string
}) {
  const timer = useLaunchTimer(config.defaultMinutes, `waiting-room:${slug}`)
  const { phase, minutes, setMinutes, start, reset, restart } = timer

  const launch = useCallback(() => {
    start()
    if (config.fullscreen) requestFullscreen()
  }, [config.fullscreen, start])

  // Atajos para operar sin buscar el mouse en medio de la transmisión.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      // Con el foco en el selector, las teclas son suyas.
      if (target?.tagName === "INPUT") return

      if (event.code === "Space" || event.key === "Enter") {
        if (phase === "idle") {
          event.preventDefault()
          launch()
        } else if (phase === "done") {
          event.preventDefault()
          restart()
        }
        return
      }

      if (event.key === "r" || event.key === "R" || (event.key === "Escape" && phase === "running")) {
        reset()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [launch, phase, reset, restart])

  return (
    <main className="bg-stage text-stage-fg relative grid min-h-dvh place-items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in srgb, var(--brand) 10%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 90%, color-mix(in srgb, var(--brand) 8%, transparent) 0%, transparent 60%)",
        }}
      />
      {phase !== "idle" && <div aria-hidden className="stage-aura z-0" />}

      <Link
        href={`/${slug}`}
        className="text-stage-muted hover:text-stage-fg fixed top-5 left-6 z-30 text-xs font-semibold tracking-widest uppercase transition-colors"
      >
        {brandName}
      </Link>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <Panel id="idle">
            <span className="border-stage-line bg-stage-panel text-stage-muted inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 text-xs tracking-widest uppercase">
              <span className="bg-brand h-2 w-2 animate-pulse rounded-full" aria-hidden />
              {config.intro.eyebrow}
            </span>

            <h1 className="font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-tight font-bold text-balance">
              {config.intro.title} <span className="text-brand">{config.intro.titleHighlight}</span>
            </h1>

            <p className="text-stage-muted max-w-xl text-base text-pretty">{config.intro.body}</p>

            <div className="rounded-card border-stage-line bg-stage-panel mt-2 flex w-full max-w-sm flex-col gap-5 border p-6">
              <div className="flex flex-col gap-3">
                <span className="text-stage-muted text-xs tracking-widest uppercase">
                  {config.intro.durationLabel}
                </span>

                <div className="flex items-center justify-center gap-3">
                  <StepButton
                    label="Restar un minuto"
                    onClick={() => setMinutes(minutes - 1)}
                    disabled={minutes <= MIN_LAUNCH_MINUTES}
                  >
                    <Minus className="h-5 w-5" />
                  </StepButton>

                  <label className="flex items-baseline gap-1.5">
                    <span className="sr-only">Minutos</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={MIN_LAUNCH_MINUTES}
                      max={MAX_LAUNCH_MINUTES}
                      value={minutes}
                      onChange={(event) => setMinutes(Number(event.target.value))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur()
                          launch()
                        }
                      }}
                      className="font-display border-stage-line focus:border-brand w-24 border-b bg-transparent pb-1 text-center text-4xl font-bold tabular-nums outline-none"
                    />
                    <span className="text-stage-muted text-sm">min</span>
                  </label>

                  <StepButton
                    label="Sumar un minuto"
                    onClick={() => setMinutes(minutes + 1)}
                    disabled={minutes >= MAX_LAUNCH_MINUTES}
                  >
                    <Plus className="h-5 w-5" />
                  </StepButton>
                </div>

                {config.presetMinutes.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {config.presetMinutes.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMinutes(preset)}
                        className={cn(
                          "rounded-pill border px-3 py-1 text-xs font-semibold transition-colors",
                          preset === minutes
                            ? "border-brand bg-brand text-on-brand"
                            : "border-stage-line text-stage-muted hover:border-brand hover:text-stage-fg"
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={launch}
                className="cta-shine rounded-pill bg-brand text-on-brand focus-visible:ring-brand inline-flex min-h-[52px] w-full items-center justify-center gap-2 text-base font-semibold focus-visible:ring-2 focus-visible:outline-none"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden />
                {config.intro.startLabel}
              </button>

              <p className="text-stage-muted text-xs">{config.intro.hint}</p>
            </div>
          </Panel>
        )}

        {phase === "running" && (
          <Panel id="running">
            <span className="text-stage-muted text-sm tracking-[0.3em] uppercase">
              {config.counting.label}
            </span>
            <ClockRing remaining={timer.remaining} total={timer.total} />
            <p className="text-stage-muted max-w-md text-sm text-pretty">{config.counting.caption}</p>
          </Panel>
        )}

        {phase === "done" && (
          <Panel id="done">
            <span className="text-brand text-sm font-semibold tracking-[0.3em] uppercase">
              {config.final.eyebrow}
            </span>
            <h2 className="font-display text-[clamp(2.5rem,9vw,6rem)] leading-none font-bold">
              {config.final.title}
            </h2>
            {config.final.body && (
              <p className="text-stage-muted max-w-xl text-lg text-pretty">{config.final.body}</p>
            )}
            <button
              type="button"
              onClick={restart}
              className="rounded-pill border-stage-line text-stage-muted hover:text-stage-fg hover:border-brand mt-2 inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              {config.final.againLabel}
            </button>
          </Panel>
        )}
      </AnimatePresence>

      {/* La capa se monta y se desmonta con el conteo: sin reloj no hay sala. */}
      {phase === "running" && <ChatBubbles messages={config.chat} />}
      {config.confetti && <Confetti theme={theme} fire={phase === "done"} />}
    </main>
  )
}

function StepButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="border-stage-line text-stage-muted hover:border-brand hover:text-stage-fg grid h-11 w-11 place-items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

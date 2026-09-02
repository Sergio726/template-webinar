"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { ChatMessage } from "@/lib/types"

/**
 * Burbujas de chat que aparecen de a una mientras corre el reloj.
 *
 * Una sala vacía se siente vacía, y en los minutos previos nadie escribe todavía.
 * Estos mensajes —los del propio config, de una edición anterior del evento—
 * dan la sensación de sala llena. No se hacen pasar por chat en vivo: la capa
 * es decorativa (`aria-hidden`) y los mensajes son los que el organizador puso
 * a mano.
 */

/** Cuántas burbujas conviven en pantalla antes de que la más vieja se vaya. */
const MAX_VISIBLE = 4
const MIN_DELAY_MS = 2200
const EXTRA_DELAY_MS = 1600
const LIFETIME_MS = 6400

type Bubble = ChatMessage & { id: number }

function initials(name: string): string {
  const parts = name.replace(/·/g, " ").trim().split(/\s+/).filter(Boolean)
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

/** La primera burbuja no aparece de golpe con el reloj. */
const FIRST_DELAY_MS = 600

export function ChatBubbles({ messages }: { messages: ChatMessage[] }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextId = useRef(0)
  const lastIndex = useRef(-1)

  useEffect(() => {
    if (messages.length === 0) return

    // Cada burbuja deja su propio temporizador de vida en vuelo; se guardan
    // todos para que al desmontar no quede ninguno escribiendo estado.
    const timers = new Set<ReturnType<typeof setTimeout>>()

    const pick = () => {
      if (messages.length === 1) return messages[0]
      let index = lastIndex.current
      // Repetir el mismo mensaje dos veces seguidas delata el truco.
      while (index === lastIndex.current) index = Math.floor(Math.random() * messages.length)
      lastIndex.current = index
      return messages[index]
    }

    const spawn = () => {
      const id = nextId.current++
      setBubbles((current) => [...current, { ...pick(), id }].slice(-MAX_VISIBLE))

      timers.add(
        setTimeout(() => {
          setBubbles((current) => current.filter((bubble) => bubble.id !== id))
        }, LIFETIME_MS)
      )
      timers.add(setTimeout(spawn, MIN_DELAY_MS + Math.random() * EXTRA_DELAY_MS))
    }

    // Agendada, no llamada acá: escribir estado en el cuerpo del efecto
    // encadena un render extra apenas monta la capa.
    timers.add(setTimeout(spawn, FIRST_DELAY_MS))

    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [messages])

  if (messages.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-20 hidden w-[min(22rem,28vw)] flex-col gap-2 sm:flex"
    >
      <AnimatePresence initial={false}>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            layout
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-card border-stage-line bg-stage-panel flex gap-2.5 border p-2.5 backdrop-blur-sm"
          >
            <span className="bg-brand text-on-brand grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold">
              {initials(bubble.name)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-stage-fg text-xs font-semibold">{bubble.name}</span>
              <span className="text-stage-muted text-xs leading-snug">{bubble.text}</span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useSyncExternalStore } from "react"

export type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Horas totales sin descontar los días; útil para avisos de "últimas horas". */
  totalHours: number
}

export type OfferWindow = {
  /** Hay fecha configurada y todavía no llegó. */
  active: boolean
  /** Hay fecha configurada y ya pasó. */
  expired: boolean
  timeLeft: TimeLeft | null
  /** false durante el render del servidor. Ver la nota de hidratación. */
  ready: boolean
}

/**
 * Reloj compartido.
 *
 * Un único intervalo alimenta a todos los componentes que muestran tiempo, y el
 * valor queda cacheado entre ticks: `useSyncExternalStore` exige que dos
 * lecturas seguidas devuelvan lo mismo, así que no se puede llamar a
 * `Date.now()` dentro del lector.
 */
let currentTime = 0
let timer: ReturnType<typeof setInterval> | undefined
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  if (!timer) {
    currentTime = Date.now()
    timer = setInterval(() => {
      currentTime = Date.now()
      for (const notify of listeners) notify()
    }, 1000)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

const getSnapshot = () => currentTime

/**
 * En el servidor no hay reloj que valga: la página se genera en el build y no
 * sabe cuándo la van a mirar. Devolver 0 hace que el primer render del cliente
 * coincida exactamente con el HTML servido; recién después el reloj empieza a
 * correr. Sin esto, cualquier evento vencido produciría un error de hidratación.
 */
const getServerSnapshot = () => 0

function computeTimeLeft(deadline: number, now: number): TimeLeft | null {
  const diff = deadline - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalHours: Math.floor(diff / (1000 * 60 * 60)),
  }
}

/**
 * Cuenta regresiva hacia una fecha del config. Sin fecha, la ventana se
 * considera siempre abierta.
 */
export function useOfferWindow(date?: string | null): OfferWindow {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const raw = date?.trim() ?? ""
  const parsed = raw ? new Date(raw).getTime() : Number.NaN
  const deadline = Number.isNaN(parsed) ? null : parsed

  if (!deadline) {
    return { active: false, expired: false, timeLeft: null, ready: true }
  }

  if (now === 0) {
    return { active: false, expired: false, timeLeft: null, ready: false }
  }

  const timeLeft = computeTimeLeft(deadline, now)

  return {
    active: timeLeft !== null,
    expired: timeLeft === null,
    timeLeft,
    ready: true,
  }
}

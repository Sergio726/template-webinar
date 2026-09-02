"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

/**
 * Temporizador de la sala de espera.
 *
 * Hermano de `useOfferWindow`, pero mide otra cosa: aquel cuenta hacia una
 * fecha fija del config y arranca solo; este cuenta una duración que se elige
 * en pantalla y no empieza hasta que alguien lo dispara. Mezclar los dos en un
 * mismo hook obligaría a que cada uno cargue con las ramas del otro.
 *
 * El tiempo restante se recalcula siempre contra un instante final absoluto, no
 * restando de a un segundo: así una pestaña en segundo plano —donde el
 * navegador ralentiza los timers— vuelve al frente con la hora correcta en vez
 * de haberse quedado atrás.
 */

export type LaunchPhase = "idle" | "running" | "done"

export const MIN_LAUNCH_MINUTES = 1
export const MAX_LAUNCH_MINUTES = 180

/** Cada 250 ms alcanza para un reloj de segundos y no cuesta casi nada. */
const TICK_MS = 250

export function clampMinutes(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback
  return Math.min(MAX_LAUNCH_MINUTES, Math.max(MIN_LAUNCH_MINUTES, Math.round(value)))
}

/**
 * Duración elegida, como store externo.
 *
 * El valor vive fuera de React porque su origen también está fuera: la URL y el
 * `localStorage` del navegador, que en el servidor no existen. Leerlos en un
 * efecto y volcarlos con `setState` provocaría el render en cascada que React
 * desaconseja; con `useSyncExternalStore` el primer render usa el default del
 * config —el mismo HTML que sirvió el servidor, sin error de hidratación— y
 * React vuelve a leer el valor real apenas hidrata.
 */
type DurationStore = { seconds: number; listeners: Set<() => void> }

const stores = new Map<string, DurationStore>()

function readInitialSeconds(key: string, defaultMinutes: number): number {
  // Atajos de prueba: `?seg=90` fija segundos exactos, `?min=5` minutos.
  const params = new URLSearchParams(window.location.search)
  const urlSeconds = Number(params.get("seg"))
  if (Number.isFinite(urlSeconds) && urlSeconds > 0) return Math.max(1, Math.round(urlSeconds))

  const urlMinutes = Number(params.get("min"))
  if (Number.isFinite(urlMinutes) && urlMinutes > 0) {
    return clampMinutes(urlMinutes, defaultMinutes) * 60
  }

  try {
    const saved = Number(window.localStorage.getItem(key))
    if (saved && Number.isFinite(saved)) return clampMinutes(saved, defaultMinutes) * 60
  } catch {
    // Modo incógnito o almacenamiento bloqueado: seguimos con el default.
  }

  return defaultMinutes * 60
}

function getStore(key: string, defaultMinutes: number): DurationStore {
  let store = stores.get(key)
  if (!store) {
    store = { seconds: readInitialSeconds(key, defaultMinutes), listeners: new Set() }
    stores.set(key, store)
  }
  return store
}

function writeSeconds(key: string, defaultMinutes: number, seconds: number): void {
  const store = getStore(key, defaultMinutes)
  if (store.seconds === seconds) return
  store.seconds = seconds
  for (const notify of store.listeners) notify()
}

export type LaunchTimer = {
  phase: LaunchPhase
  /** Minutos elegidos, ya recortados al rango válido. */
  minutes: number
  setMinutes: (minutes: number) => void
  /** Segundos que faltan. */
  remaining: number
  /** Duración del conteo en curso, en segundos. Alimenta el anillo de progreso. */
  total: number
  start: () => void
  reset: () => void
  restart: () => void
}

export function useLaunchTimer(defaultMinutes: number, storageKey: string): LaunchTimer {
  const seconds = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        const store = getStore(storageKey, defaultMinutes)
        store.listeners.add(onStoreChange)
        return () => store.listeners.delete(onStoreChange)
      },
      [defaultMinutes, storageKey]
    ),
    () => getStore(storageKey, defaultMinutes).seconds,
    () => defaultMinutes * 60
  )

  const [phase, setPhase] = useState<LaunchPhase>("idle")
  // Solo tiene sentido mientras corre el reloj; en reposo el restante es la
  // duración elegida, así que se deriva en vez de duplicarse en estado.
  const [ticking, setTicking] = useState(0)
  const [total, setTotal] = useState(() => defaultMinutes * 60)

  const endAtRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const stopTicking = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = undefined
  }, [])

  useEffect(() => stopTicking, [stopTicking])

  const setMinutes = useCallback(
    (value: number) => {
      const minutes = clampMinutes(value, defaultMinutes)
      writeSeconds(storageKey, defaultMinutes, minutes * 60)
      try {
        window.localStorage.setItem(storageKey, String(minutes))
      } catch {
        // Sin persistencia el contador funciona igual.
      }
    },
    [defaultMinutes, storageKey]
  )

  const start = useCallback(() => {
    stopTicking()
    // Un cuarto de segundo de gracia para que el primer número que se ve sea la
    // duración completa y no un segundo menos.
    endAtRef.current = Date.now() + seconds * 1000 + 250
    setTotal(seconds)
    setTicking(seconds)
    setPhase("running")

    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      setTicking(left)
      if (left <= 0) {
        stopTicking()
        setPhase("done")
      }
    }, TICK_MS)
  }, [seconds, stopTicking])

  const reset = useCallback(() => {
    stopTicking()
    setPhase("idle")
  }, [stopTicking])

  const restart = useCallback(() => {
    reset()
    start()
  }, [reset, start])

  return {
    phase,
    minutes: Math.max(MIN_LAUNCH_MINUTES, Math.round(seconds / 60)),
    setMinutes,
    remaining: phase === "idle" ? seconds : ticking,
    total: phase === "idle" ? seconds : total,
    start,
    reset,
    restart,
  }
}

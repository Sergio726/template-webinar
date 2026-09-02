"use client"

import { useEffect, useRef } from "react"
import { resolveTokens } from "@/lib/theme"
import type { ThemeConfig } from "@/lib/types"

/**
 * Confeti del momento cero.
 *
 * Canvas a mano en lugar de una librería: son sesenta líneas de física de
 * juguete que corren una sola vez por transmisión, y una dependencia más
 * pesaría en todas las landings del deploy, no solo en esta pantalla.
 *
 * Los colores salen del tema, así que la celebración es de la marca del evento.
 */

const GRAVITY = 0.16
const DRAG = 0.99

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  spin: number
  life: number
  decay: number
  square: boolean
}

export function Confetti({ theme, fire }: { theme: ThemeConfig; fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!fire) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const tokens = resolveTokens(theme)
    const palette = [
      tokens.brand,
      tokens.brandLight,
      tokens.brandDark,
      tokens.surface,
      tokens.surfaceAlt,
    ]

    let particles: Particle[] = []
    let frame = 0
    let running = false
    let waves = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const create = (x: number, y: number, vx: number, vy: number, decay: number): Particle => ({
      x,
      y,
      vx,
      vy,
      size: 6 + Math.random() * 8,
      color: palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay,
      square: Math.random() < 0.5,
    })

    const burst = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 4 + Math.random() * 9
        particles.push(
          create(
            x,
            y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed - (3 + Math.random() * 4),
            0.006 + Math.random() * 0.006
          )
        )
      }
    }

    const rain = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push(
          create(
            Math.random() * window.innerWidth,
            -20 - Math.random() * window.innerHeight * 0.5,
            (Math.random() - 0.5) * 2,
            2 + Math.random() * 4,
            0.0016 + Math.random() * 0.002
          )
        )
      }
    }

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.vy += GRAVITY
        particle.vx *= DRAG
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.spin
        particle.life -= particle.decay

        if (particle.life <= 0 || particle.y > window.innerHeight + 40) {
          particles.splice(i, 1)
          continue
        }

        context.save()
        context.globalAlpha = Math.max(0, Math.min(1, particle.life))
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.fillStyle = particle.color
        if (particle.square) {
          context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)
        } else {
          context.beginPath()
          context.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          context.fill()
        }
        context.restore()
      }

      if (particles.length > 0) {
        frame = requestAnimationFrame(draw)
      } else {
        // El bucle se apaga solo cuando no queda nada que dibujar; la próxima
        // oleada lo vuelve a encender.
        running = false
      }
    }

    const run = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(draw)
    }

    burst(window.innerWidth / 2, window.innerHeight * 0.45, 160)
    burst(window.innerWidth * 0.15, window.innerHeight * 0.5, 70)
    burst(window.innerWidth * 0.85, window.innerHeight * 0.5, 70)
    rain(120)
    run()

    // Cinco oleadas más, para que la celebración dure lo que tarda el saludo.
    const waveTimer = setInterval(() => {
      waves++
      rain(70)
      burst(Math.random() * window.innerWidth, window.innerHeight * (0.3 + Math.random() * 0.2), 50)
      run()
      if (waves >= 5) clearInterval(waveTimer)
    }, 700)

    return () => {
      clearInterval(waveTimer)
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      particles = []
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [fire, theme])

  // Por debajo del panel (z-10): el confeti celebra detrás del mensaje, no lo tapa.
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[5]" />
}

"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CtaButton } from "@/components/ui/CtaButton"
import { FORM_ANCHOR_ID, REGISTERED_EVENT } from "@/lib/scroll"

/**
 * Barra fija que aparece al hacer scroll y se retira sola cuando el formulario
 * entra en pantalla: si ya lo estas viendo, el recordatorio sobra.
 *
 * A diferencia del original, que medía posiciones en cada evento de scroll,
 * acá un IntersectionObserver avisa cuando el formulario es visible. Menos
 * trabajo en el hilo principal y mismo comportamiento.
 */
export function StickyCta({ label }: { label: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Una vez que la persona se registro, seguir insistiendo con "reserva tu
  // lugar" es ruido: ya lo hizo.
  useEffect(() => {
    const onRegistered = () => setRegistered(true)
    window.addEventListener(REGISTERED_EVENT, onRegistered)
    return () => window.removeEventListener(REGISTERED_EVENT, onRegistered)
  }, [])

  useEffect(() => {
    const target = document.getElementById(FORM_ANCHOR_ID)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const visible = scrolled && !formVisible && !registered

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="border-hairline bg-surface/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur-md"
        >
          <div className="mx-auto max-w-md">
            <CtaButton label={label} href={`#${FORM_ANCHOR_ID}`} icon="ArrowUp" />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

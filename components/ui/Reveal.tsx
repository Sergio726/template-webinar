"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * Aparicion al entrar en pantalla.
 *
 * Aisla framer-motion en un unico componente cliente para que las secciones
 * puedan seguir siendo Server Components: el copy nunca cruza el limite y solo
 * este archivo embarca JavaScript de animacion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Variante en cascada para listas. */
export function Stagger({
  children,
  className,
  step = 0.08,
}: {
  children: ReactNode[]
  className?: string
  step?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: index * step }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

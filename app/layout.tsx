import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Landings de webinar",
  description: "Plantilla de landing de webinar multi-evento.",
}

/**
 * Layout raiz. Deliberadamente vacio de marca: el tema, las fuentes y los
 * metadatos los define cada evento en `app/[slug]/layout.tsx`, asi que dos
 * webinars con identidades distintas conviven en el mismo deploy.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}

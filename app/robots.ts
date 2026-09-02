import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Ni las paginas de gracias ni la sala de espera aportan nada como
      // resultado de busqueda: son destinos internos del propio evento.
      disallow: ["/api/", "/*/registro", "/*/sala"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}

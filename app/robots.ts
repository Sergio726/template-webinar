import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Las paginas de gracias no aportan nada como resultado de busqueda.
      disallow: ["/api/", "/*/registro"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}

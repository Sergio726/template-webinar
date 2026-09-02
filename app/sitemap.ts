import type { MetadataRoute } from "next"
import { getPublishedEvents } from "@/events"
import { getSiteUrl } from "@/lib/site"

/** Una entrada por evento publicado. La pagina de gracias va sin indexar. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()

  return getPublishedEvents().map((event) => ({
    url: `${base}/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }))
}

/**
 * URL publica del sitio. La necesitan `metadataBase`, el sitemap y las imagenes
 * Open Graph, que exigen URLs absolutas. En local cae a localhost.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, "")

  // Vercel expone el dominio del deploy sin protocolo.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return "http://localhost:3000"
}

import type { CSSProperties } from "react"
import type { ThemeConfig, ThemeTokens } from "./types"

/**
 * Presets de marca.
 *
 * Cada preset es el juego completo de tokens semánticos. La landing no conoce
 * ningún color literal: pinta con `var(--brand)`, `var(--ink)`, etc. Cambiar de
 * preset recolorea todo, incluido el fondo SVG decorativo.
 *
 * Los valores están en hex por legibilidad al editarlos a mano; el navegador
 * los recibe como variables CSS, así que igual admiten `oklch()` si preferís.
 */
export const THEME_PRESETS: Record<ThemeConfig["preset"], ThemeTokens> = {
  /** Azul y naranja sobrios: consultoría, servicios profesionales, B2B. */
  corporate: {
    brand: "#2563EB",
    brandDark: "#1D4ED8",
    brandLight: "#60A5FA",
    brandWash: "#E6EDFF",
    ink: "#101A2C",
    inkMuted: "#5A6981",
    surface: "#F7F8FB",
    surfaceAlt: "#FFFFFF",
  },
  /** Terracota sobre crema: coaching, bienestar, educación, gastronomía. */
  warm: {
    brand: "#E1683A",
    brandDark: "#C1512A",
    brandLight: "#F79B6E",
    brandWash: "#FDEBE2",
    ink: "#2B211C",
    inkMuted: "#7A6A61",
    surface: "#FDF9F5",
    surfaceAlt: "#FFFFFF",
  },
  /** Violeta saturado: tecnología, producto, startups, creatividad. */
  vibrant: {
    brand: "#7C3AED",
    brandDark: "#6425CE",
    brandLight: "#A78BFA",
    brandWash: "#F0E9FF",
    ink: "#191233",
    inkMuted: "#665C86",
    surface: "#FAF8FF",
    surfaceAlt: "#FFFFFF",
  },
  /** Fondo oscuro con acento lima: cripto, gaming, trading, eventos nocturnos. */
  dark: {
    brand: "#A3E635",
    brandDark: "#84CC16",
    brandLight: "#BEF264",
    brandWash: "#1E2A16",
    ink: "#F2F5EF",
    inkMuted: "#9AA391",
    surface: "#0E1210",
    surfaceAlt: "#171D19",
  },
  /** Verde profundo: sostenibilidad, salud, agro, ONG. */
  nature: {
    brand: "#0E9E6E",
    brandDark: "#0A7D57",
    brandLight: "#4ECBA0",
    brandWash: "#DCF5EC",
    ink: "#0F231D",
    inkMuted: "#587268",
    surface: "#F4FAF7",
    surfaceAlt: "#FFFFFF",
  },
}

const RADIUS_SCALE: Record<ThemeConfig["radius"], { sm: string; md: string; lg: string; pill: string }> = {
  sharp: { sm: "0.125rem", md: "0.25rem", lg: "0.375rem", pill: "0.375rem" },
  soft: { sm: "0.5rem", md: "0.75rem", lg: "1rem", pill: "9999px" },
  round: { sm: "0.75rem", md: "1.25rem", lg: "1.75rem", pill: "9999px" },
}

/**
 * Un tema oscuro necesita que los textos "sobre marca" y los bordes se
 * comporten al revés. En vez de duplicar clases por todo el árbol, derivamos
 * dos tokens más y los componentes los usan sin saber qué preset está activo.
 */
function isDarkSurface(tokens: ThemeTokens): boolean {
  const hex = tokens.surface.replace("#", "")
  if (hex.length !== 6) return false
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  // Luminancia percibida (Rec. 601). Por debajo de 128 tratamos el fondo como oscuro.
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export function resolveTokens(theme: ThemeConfig): ThemeTokens {
  return { ...THEME_PRESETS[theme.preset], ...(theme.tokens ?? {}) }
}

/**
 * Traduce el tema a variables CSS inline. Se aplican en el `<div>` raíz de cada
 * landing, así que dos eventos con temas distintos pueden convivir en el mismo
 * deploy sin pisarse.
 */
export function themeToCssVars(theme: ThemeConfig): CSSProperties {
  const tokens = resolveTokens(theme)
  const radius = RADIUS_SCALE[theme.radius]
  const dark = isDarkSurface(tokens)

  return {
    "--brand": tokens.brand,
    "--brand-dark": tokens.brandDark,
    "--brand-light": tokens.brandLight,
    "--brand-wash": tokens.brandWash,
    "--ink": tokens.ink,
    "--ink-muted": tokens.inkMuted,
    "--surface": tokens.surface,
    "--surface-alt": tokens.surfaceAlt,
    "--radius-sm": radius.sm,
    "--radius-md": radius.md,
    "--radius-lg": radius.lg,
    "--radius-pill": radius.pill,
    // Texto legible encima del color de marca (lima sobre negro pide texto oscuro).
    "--on-brand": dark ? tokens.surface : "#FFFFFF",
    // Borde sutil que funciona en ambos extremos de luminancia.
    "--hairline": dark ? "rgba(255,255,255,0.12)" : "rgba(16,26,44,0.10)",
    "--elevated": dark ? "rgba(255,255,255,0.04)" : "rgba(16,26,44,0.04)",
  } as CSSProperties
}

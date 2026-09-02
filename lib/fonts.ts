import { Inter, Manrope, DM_Sans, Sora, Playfair_Display, Fraunces } from "next/font/google"
import type { ThemeConfig } from "./types"

/**
 * Registro de fuentes.
 *
 * `next/font/google` solo admite llamadas estaticas en el scope del modulo: no
 * se puede hacer `Google[nombre]()` con un nombre que venga del config. Por eso
 * las familias se declaran todas aca y el evento elige una por clave. Next hace
 * tree-shaking por ruta, asi que un evento solo descarga las dos que usa.
 */

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" })
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" })

type FontEntry = { className: string; cssVar: string }

const FONTS: Record<string, FontEntry> = {
  inter: { className: inter.variable, cssVar: "--font-inter" },
  sora: { className: sora.variable, cssVar: "--font-sora" },
  manrope: { className: manrope.variable, cssVar: "--font-manrope" },
  "dm-sans": { className: dmSans.variable, cssVar: "--font-dm-sans" },
  playfair: { className: playfair.variable, cssVar: "--font-playfair" },
  fraunces: { className: fraunces.variable, cssVar: "--font-fraunces" },
}

/** Clases de fuente que necesita el contenedor raiz de cualquier pagina. */
export const ALL_FONT_CLASSES = Object.values(FONTS)
  .map((f) => f.className)
  .join(" ")

/**
 * Devuelve las clases que hay que colgar del contenedor y las variables CSS que
 * apuntan `--font-sans-active` / `--font-display-active` a la familia elegida.
 */
export function resolveFonts(theme: ThemeConfig) {
  const sans = FONTS[theme.fonts.sans] ?? FONTS.inter
  const display = FONTS[theme.fonts.display] ?? FONTS.inter

  return {
    className: [sans.className, display.className].join(" "),
    vars: {
      "--font-sans-active": `var(${sans.cssVar})`,
      "--font-display-active": `var(${display.cssVar})`,
    } as Record<string, string>,
  }
}

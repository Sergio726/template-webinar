import { z } from "zod"

/**
 * Esquema de configuración de un evento.
 *
 * Un webinar entero — copy, fechas, tema, secciones, formulario y analítica —
 * vive en un solo objeto que valida contra este esquema. Agregar un evento
 * nuevo es crear un archivo en `events/` y registrarlo; no se toca ningún
 * componente.
 *
 * Los tipos de TypeScript se infieren del esquema (`z.infer`), así que el
 * autocompletado del editor y la validación en runtime nunca se desincronizan.
 */

// ---------------------------------------------------------------------------
// Piezas reutilizables
// ---------------------------------------------------------------------------

/** Fecha ISO 8601 con offset explícito, ej. "2026-10-15T19:00:00-05:00". */
const isoDate = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Fecha inválida: usá ISO 8601 con offset, ej. 2026-10-15T19:00:00-05:00",
  })

/** Nombre de un icono de lucide-react, ej. "Calendar", "Clock", "Gift". */
const iconName = z.string().min(1)

const ctaSchema = z.object({
  label: z.string().min(1),
  /** Destino externo. Si se omite, el CTA hace scroll al formulario. */
  href: z.string().optional(),
  icon: iconName.nullable().optional(),
})

// ---------------------------------------------------------------------------
// Tema
// ---------------------------------------------------------------------------

/**
 * Tokens semánticos: nunca nombres de color literales. Un preset define estos
 * ocho valores y toda la landing se recolorea, incluido el fondo SVG.
 */
export const themeTokensSchema = z.object({
  /** Color principal de marca: CTAs, acentos, énfasis. */
  brand: z.string(),
  brandDark: z.string(),
  brandLight: z.string(),
  /** Lavado muy claro del color de marca, para fondos de badges y círculos. */
  brandWash: z.string(),
  /** Color de contraste: titulares, footer, fondos oscuros. */
  ink: z.string(),
  inkMuted: z.string(),
  /** Fondo de página y su variante cálida/fría. */
  surface: z.string(),
  surfaceAlt: z.string(),
})

export const themeSchema = z.object({
  /** Preset de arranque; los tokens sueltos lo sobreescriben. */
  preset: z.enum(["corporate", "warm", "vibrant", "dark", "nature"]).default("corporate"),
  tokens: themeTokensSchema.partial().optional(),
  /** Variante del fondo decorativo. "none" lo desactiva por completo. */
  backdrop: z.enum(["mesh", "grid", "waves", "aurora", "none"]).default("mesh"),
  /** Redondeo global de tarjetas y botones. */
  radius: z.enum(["sharp", "soft", "round"]).default("soft"),
  fonts: z
    .object({
      /** Familia para texto corrido. Debe existir en `lib/fonts.ts`. */
      sans: z.enum(["inter", "sora", "dm-sans", "manrope"]).default("inter"),
      /** Familia para titulares. */
      display: z.enum(["inter", "sora", "dm-sans", "manrope", "playfair", "fraunces"]).default("inter"),
    })
    .default({ sans: "inter", display: "inter" }),
})

// ---------------------------------------------------------------------------
// Secciones
// ---------------------------------------------------------------------------

/**
 * El array de secciones define QUÉ se renderiza y EN QUÉ ORDEN. Una sección
 * ausente sencillamente no existe en esa landing: no hay flags booleanos ni
 * componentes que devuelvan null.
 */

const heroSection = z.object({
  type: z.literal("hero"),
  /** Píldora sobre el titular, ej. "Masterclass gratuita". */
  eyebrow: z.string().optional(),
  /** El titular se parte en dos para poder resaltar la segunda mitad. */
  headline: z.string().min(1),
  headlineHighlight: z.string().optional(),
  subheadline: z.string().optional(),
  /** Párrafo de dolor. Acepta **negritas** con doble asterisco. */
  body: z.string().optional(),
  /** Fila de datos con icono: fecha, hora, modalidad, precio, speaker. */
  facts: z
    .array(z.object({ icon: iconName, label: z.string() }))
    .default([]),
  cta: ctaSchema.optional(),
  /** Barra de urgencia. Omitir el bloque entero si no aplica al evento. */
  scarcity: z
    .object({
      /** Porcentaje de cupos ocupados, 0-100. */
      percent: z.number().min(0).max(100),
      label: z.string(),
    })
    .optional(),
  socialProof: z
    .object({ count: z.number().int().positive(), label: z.string() })
    .optional(),
  /** Retrato del presentador, arriba a la derecha. */
  portrait: z
    .object({ src: z.string(), alt: z.string(), name: z.string(), role: z.string() })
    .optional(),
  showCountdown: z.boolean().default(true),
})

const benefitsSection = z.object({
  type: z.literal("benefits"),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
  /** Solapa la tarjeta sobre el hero, como en el diseño original. */
  overlap: z.boolean().default(true),
})

const tensionSection = z.object({
  type: z.literal("tension"),
  title: z.string().min(1),
  titleHighlight: z.string().optional(),
  paragraphs: z.array(z.string()).min(1),
  cta: ctaSchema.optional(),
})

const roadmapSection = z.object({
  type: z.literal("roadmap"),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        status: z.string().optional(),
        /** Marca el ítem como el activo/destacado de la serie. */
        current: z.boolean().default(false),
      })
    )
    .min(1),
  cta: ctaSchema.optional(),
})

const testimonialsSection = z.object({
  type: z.literal("testimonials"),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  items: z
    .array(
      z.object({
        quote: z.string().min(1),
        name: z.string().min(1),
        role: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .min(1),
})

const faqSection = z.object({
  type: z.literal("faq"),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  items: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
})

const speakerSection = z.object({
  type: z.literal("speaker"),
  title: z.string().optional(),
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().min(1),
  photo: z.string().optional(),
})

const ctaSection = z.object({
  type: z.literal("cta"),
  title: z.string().min(1),
  titleHighlight: z.string().optional(),
  body: z.string().optional(),
  cta: ctaSchema.optional(),
})

/** Bloque libre para lo que no encaje en las secciones tipadas. */
const richTextSection = z.object({
  type: z.literal("richText"),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  paragraphs: z.array(z.string()).min(1),
})

/**
 * Grilla de "esto es para vos si...". Deja que la persona se reconozca sola y
 * filtra a quien no calza, antes de pedirle los datos.
 */
const audienceSection = z.object({
  type: z.literal("audience"),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
  /** Cierre bajo la grilla, ej. "Negocios que ya venden y viven de citas". */
  footnote: z.string().optional(),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
})

const formSection = z.object({
  type: z.literal("form"),
  eyebrow: z.string().optional(),
  headline: z.string().min(1),
  headlineHighlight: z.string().optional(),
  subcopy: z.string().optional(),
  submitLabel: z.string().default("Reservar mi lugar"),
  submittingLabel: z.string().default("Enviando..."),
  /** Nota bajo el botón, ej. "No compartimos tus datos." */
  disclaimer: z.string().optional(),
  badge: z.string().optional(),
})

export const sectionSchema = z.discriminatedUnion("type", [
  heroSection,
  benefitsSection,
  tensionSection,
  roadmapSection,
  testimonialsSection,
  faqSection,
  speakerSection,
  ctaSection,
  richTextSection,
  audienceSection,
  formSection,
])

// ---------------------------------------------------------------------------
// Formulario
// ---------------------------------------------------------------------------

const baseField = {
  /** Clave con la que el campo viaja en el payload del webhook. */
  name: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().default(true),
}

export const formFieldSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), ...baseField }),
  z.object({ type: z.literal("email"), ...baseField }),
  z.object({ type: z.literal("textarea"), ...baseField, rows: z.number().int().default(3) }),
  z.object({
    /** Teléfono con selector de país; el país se deriva del prefijo elegido. */
    type: z.literal("phone"),
    ...baseField,
    defaultDialCode: z.string().default("+57"),
  }),
  z.object({
    type: z.literal("select"),
    ...baseField,
    options: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
  }),
])

export const formSchema = z.object({
  fields: z.array(formFieldSchema).min(1),
  /**
   * Etiqueta que identifica al evento en el sistema que reciba el webhook,
   * para que del otro lado se pueda enrutar o segmentar sin adivinar.
   */
  leadTag: z.string().optional(),
  /** Copy del estado "registro cerrado". */
  closed: z
    .object({
      title: z.string().default("Las inscripciones están cerradas"),
      body: z.string(),
      cta: ctaSchema.optional(),
    })
    .optional(),
})

// ---------------------------------------------------------------------------
// Éxito
// ---------------------------------------------------------------------------

/**
 * Qué ve la persona después de registrarse. Generaliza la tarjeta de WhatsApp
 * del proyecto original: ahora el paso siguiente puede ser cualquier cosa —
 * un grupo, un calendario, una descarga, o nada.
 */
export const successSchema = z.object({
  title: z.string().min(1),
  lines: z.array(z.string()).default([]),
  cta: z
    .object({
      label: z.string().min(1),
      href: z.string().min(1),
      variant: z.enum(["primary", "whatsapp", "telegram", "calendar", "download"]).default("primary"),
    })
    .optional(),
  /** Nota al pie de la tarjeta, ej. "Revisá tu correo, ya te escribimos." */
  footnote: z.string().optional(),
})

// ---------------------------------------------------------------------------
// Analítica y SEO
// ---------------------------------------------------------------------------

/** Todo opcional: sin IDs no se inyecta ni un byte de script de terceros. */
export const analyticsSchema = z
  .object({
    metaPixelId: z.string().optional(),
    ga4Id: z.string().optional(),
    gtmId: z.string().optional(),
    /** Interruptor maestro; útil para apagar todo en un entorno de staging. */
    enabled: z.boolean().default(true),
  })
  .default({ enabled: true })

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** Si se omite, se genera una imagen OG con el título y la fecha. */
  ogImage: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

// ---------------------------------------------------------------------------
// Configuración completa del evento
// ---------------------------------------------------------------------------

const eventConfigObject = z.object({
  /** Segmento de URL: la landing vive en `/{slug}`. */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug debe ser kebab-case, ej. webinar-oct-26"),
  /** En false la landing responde 404. Reemplaza a `landing_projects.is_active`. */
  enabled: z.boolean().default(true),

  brand: z.object({
    name: z.string().min(1),
    /** Logo sobre fondo claro y sobre fondo oscuro. */
    logo: z.object({ light: z.string().optional(), dark: z.string().optional() }).optional(),
    /** Pie de página, ej. "Consultora Ejemplo — Formación para equipos". */
    tagline: z.string().optional(),
    legal: z.string().optional(),
    /**
     * Descargo legal largo del pie: deslinde de las plataformas de anuncios,
     * aviso de que los resultados no son tipicos, y de que habra una oferta.
     * Meta exige algo asi para aprobar campanas que prometen resultados.
     */
    disclaimer: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),

  theme: themeSchema,

  event: z.object({
    /** Fecha y hora de inicio. Alimenta el countdown y la imagen OG. */
    date: isoDate,
    /** Fin del evento. Si se omite, se asume una duración de 90 minutos. */
    endsAt: isoDate.optional(),
    /**
     * Cierre de inscripciones. Al pasar, el formulario se reemplaza por el
     * estado "cerrado". Si se omite, nunca cierra.
     */
    registrationClosesAt: isoDate.optional(),
    /**
     * Zona horaria IANA del evento, ej. "America/Bogota". Con esto la fecha
     * mostrada es la del evento y no la del navegador de quien mira.
     */
    timeZone: z.string().default("America/Bogota"),
    /** Etiqueta de zona horaria mostrada al usuario, ej. "hora de Colombia". */
    timezoneLabel: z.string().optional(),
    /** Locale para formatear fechas, ej. "es-CO" o "en-US". */
    locale: z.string().default("es-ES"),
    /** Ubicación mostrada al agendar. Por defecto, la URL de la landing. */
    location: z.string().optional(),
  }),

  /** Cómo se entregan los registros. Reemplaza al CRM del proyecto original. */
  integration: z
    .object({
      /**
       * Nombre de la variable de entorno que guarda la URL del webhook.
       * Permite un destino distinto por evento sin tocar código.
       */
      webhookEnvVar: z.string().default("REGISTRATION_WEBHOOK_URL"),
      /** Etiquetas que viajan en el payload para que el automatizador enrute. */
      tags: z.array(z.string()).default([]),
      /** Pares extra que se adjuntan a cada lead. */
      extra: z.record(z.string(), z.string()).default({}),
    })
    .default({ webhookEnvVar: "REGISTRATION_WEBHOOK_URL", tags: [], extra: {} }),

  sections: z.array(sectionSchema).min(1),
  form: formSchema,
  success: successSchema,
  seo: seoSchema,
  analytics: analyticsSchema,

  /** Barra fija que aparece al hacer scroll. Omitir para desactivarla. */
  stickyCta: z.object({ label: z.string().min(1) }).optional(),

  /** Textos de la cuenta regresiva; acá se traduce la landing a otro idioma. */
  countdownLabels: z
    .object({
      intro: z.string().default("El evento comienza en"),
      days: z.string().default("días"),
      hours: z.string().default("horas"),
      minutes: z.string().default("min"),
      seconds: z.string().default("seg"),
    })
    .default({
      intro: "El evento comienza en",
      days: "días",
      hours: "horas",
      minutes: "min",
      seconds: "seg",
    }),
})

/**
 * Reglas que ningún campo puede verificar por su cuenta. Se corren al importar
 * el evento, o sea en tiempo de build: un config incoherente rompe `next build`
 * con la ruta exacta del problema en vez de fallar en producción.
 */
export const eventConfigSchema = eventConfigObject.superRefine((config, ctx) => {
  const formSections = config.sections.filter((s) => s.type === "form")

  if (formSections.length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["sections"],
      message: 'Falta la sección { type: "form" }: sin ella no hay dónde registrarse.',
    })
  }
  const names = config.form.fields.map((f) => f.name)
  const duplicated = names.filter((name, i) => names.indexOf(name) !== i)
  if (duplicated.length > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["form", "fields"],
      message: `Campos repetidos en el formulario: ${[...new Set(duplicated)].join(", ")}`,
    })
  }

  const hasContactField = config.form.fields.some(
    (f) => f.type === "email" || f.type === "phone"
  )
  if (!hasContactField) {
    ctx.addIssue({
      code: "custom",
      path: ["form", "fields"],
      message: "El formulario necesita al menos un email o un teléfono para poder contactar al lead.",
    })
  }

  try {
    new Intl.DateTimeFormat(config.event.locale, { timeZone: config.event.timeZone })
  } catch {
    ctx.addIssue({
      code: "custom",
      path: ["event", "timeZone"],
      message: `Zona horaria o locale inválidos: "${config.event.timeZone}" / "${config.event.locale}".`,
    })
  }
})

// ---------------------------------------------------------------------------
// Tipos inferidos
// ---------------------------------------------------------------------------

export type EventConfig = z.infer<typeof eventConfigSchema>
export type EventConfigInput = z.input<typeof eventConfigSchema>
export type ThemeTokens = z.infer<typeof themeTokensSchema>
export type ThemeConfig = z.infer<typeof themeSchema>
export type SectionConfig = z.infer<typeof sectionSchema>
export type SectionType = SectionConfig["type"]
export type FormField = z.infer<typeof formFieldSchema>
export type SuccessConfig = z.infer<typeof successSchema>
export type AnalyticsConfig = z.infer<typeof analyticsSchema>
export type CountdownLabels = EventConfig["countdownLabels"]

/** Extrae el tipo de una sección concreta, ej. `SectionOf<"hero">`. */
export type SectionOf<T extends SectionType> = Extract<SectionConfig, { type: T }>

/**
 * Ayuda de tipado para los archivos de `events/`. Da autocompletado al escribir
 * el objeto y aplica los valores por defecto al validarlo.
 */
export function defineEvent(config: EventConfigInput): EventConfig {
  return eventConfigSchema.parse(config)
}

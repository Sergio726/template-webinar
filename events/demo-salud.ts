import { defineEvent } from "@/lib/types"

/**
 * Evento de ejemplo — salud y bienestar.
 *
 * Existe para demostrar que la plantilla no está atada a un rubro ni a un
 * diseño: usa otro preset, otras fuentes, otro fondo, menos secciones y una
 * acción de éxito distinta (agendar en el calendario en vez de un grupo de
 * chat). Ningún componente cambia entre este evento y el de marketing.
 */
export default defineEvent({
  slug: "demo-salud",
  enabled: true,

  brand: {
    name: "Centro Vital",
    tagline: "Acompañamiento nutricional con evidencia",
  },

  theme: {
    preset: "nature",
    backdrop: "waves",
    radius: "round",
    fonts: { sans: "dm-sans", display: "dm-sans" },
  },

  event: {
    date: "2026-11-04T18:00:00-03:00",
    timeZone: "America/Argentina/Buenos_Aires",
    timezoneLabel: "hora de Argentina",
    locale: "es-AR",
  },

  integration: {
    tags: ["charla", "nutricion"],
  },

  seo: {
    title: "Charla abierta: comer bien cuando no te sobra el tiempo",
    description:
      "Encuentro gratuito el 4 de noviembre, 18:00 de Argentina. Estrategias realistas de alimentación para semanas cargadas.",
  },

  analytics: { enabled: true },

  countdownLabels: {
    intro: "Nos vemos en",
    days: "días",
    hours: "horas",
    minutes: "min",
    seconds: "seg",
  },

  form: {
    leadTag: "charla-demo-salud",
    fields: [
      { type: "text", name: "nombre", label: "Tu nombre", required: true },
      { type: "email", name: "email", label: "Email", required: true },
    ],
  },

  success: {
    title: "Te esperamos",
    lines: ["Te mandamos el enlace por correo.", "Agendalo así no se te pasa."],
    cta: {
      label: "Agregar a mi calendario",
      // El marcador `auto` arma el enlace con la fecha del evento.
      href: "auto",
      variant: "calendar",
    },
  },

  sections: [
    {
      type: "hero",
      eyebrow: "Encuentro abierto",
      headline: "Comer bien cuando",
      headlineHighlight: "no te sobra el tiempo",
      subheadline:
        "Una charla sin dietas imposibles: qué hacer cuando la semana viene cargada y cocinar no es una opción.",
      facts: [
        { icon: "Calendar", label: "Miércoles 4 de noviembre" },
        { icon: "Clock", label: "18:00 (Argentina)" },
        { icon: "Video", label: "Online" },
      ],
      cta: { label: "Quiero participar", icon: "Heart" },
      showCountdown: true,
    },
    {
      type: "benefits",
      title: "Vas a llevarte",
      overlap: true,
      items: [
        "Tres estructuras de comida que se arman en menos de quince minutos.",
        "Qué mirar en una etiqueta y qué es ruido de marketing.",
        "Cómo sostener el cambio cuando la semana se descontrola.",
        "Qué hacer con las comidas fuera de casa sin culpa.",
      ],
    },
    {
      type: "form",
      headline: "Sumate a la charla",
      subcopy: "Es gratis y queda grabada.",
      submitLabel: "Anotarme",
      submittingLabel: "Anotando...",
      disclaimer: "No compartimos tus datos con nadie.",
    },
    {
      type: "faq",
      title: "Dudas",
      titleHighlight: "habituales",
      items: [
        { q: "¿Es para mí si tengo alguna condición médica?", a: "La charla es de educación general. Si tenés una condición diagnosticada, hablalo con tu profesional de cabecera." },
        { q: "¿Hace falta cámara?", a: "No, podés participar solo escuchando." },
      ],
    },
  ],
})

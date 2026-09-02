import { defineEvent } from "@/lib/types"

/**
 * PLANTILLA DE EVENTO — copiala, no la edites.
 *
 *   1. cp events/_plantilla.ts events/mi-webinar.ts
 *   2. Editá los campos de abajo.
 *   3. Importalo en events/index.ts y agregalo al array RAW.
 *
 * Este archivo no está registrado, así que no genera ninguna ruta.
 *
 * Todo lo que dice "opcional" se puede borrar: si una sección no está en el
 * array `sections`, no existe en la página. El orden del array es el orden en
 * que se ven las secciones.
 */
export default defineEvent({
  // Segmento de URL. La landing queda en /mi-webinar
  slug: "mi-webinar",
  // En false la página responde 404 sin borrar el archivo.
  enabled: true,

  brand: {
    name: "Tu organización",
    tagline: "Opcional: bajada del pie de página",
    // Descargo legal del pie. Si vas a correr anuncios en Meta, ponelo:
    // deslinde de la plataforma, aviso de que los resultados no son típicos y
    // de que al final habrá una oferta.
    // disclaimer: "Este sitio no forma parte ni está respaldado por…",
    // logo: { light: "/eventos/mi-webinar/logo.svg" },
    links: [],
  },

  theme: {
    // corporate | warm | vibrant | dark | nature
    preset: "corporate",
    // mesh | grid | waves | aurora | none
    backdrop: "mesh",
    // sharp | soft | round
    radius: "soft",
    fonts: { sans: "inter", display: "inter" },
    // Para ajustar un color puntual sin salir del preset:
    // tokens: { brand: "#7C3AED" },
  },

  event: {
    // Siempre con el desfase horario explícito.
    date: "2026-12-10T19:00:00-05:00",
    registrationClosesAt: "2026-12-10T18:30:00-05:00",
    timeZone: "America/Bogota",
    timezoneLabel: "hora de Colombia",
    locale: "es-CO",
  },

  integration: {
    // Variable de entorno con la URL del webhook. Si distintos eventos van a
    // destinos distintos, poné acá el nombre de otra variable.
    webhookEnvVar: "REGISTRATION_WEBHOOK_URL",
    tags: ["webinar"],
  },

  seo: {
    title: "Título que se ve en la pestaña y al compartir el enlace",
    description: "Dos líneas que expliquen de qué se trata y cuándo es.",
  },

  analytics: {
    enabled: true,
    // metaPixelId: "000000000000000",
    // ga4Id: "G-XXXXXXXXXX",
    // gtmId: "GTM-XXXXXXX",   // si lo ponés, se carga sólo GTM
  },

  stickyCta: { label: "Quiero mi lugar" },

  countdownLabels: {
    intro: "El evento empieza en",
    days: "días",
    hours: "horas",
    minutes: "min",
    seconds: "seg",
  },

  form: {
    leadTag: "mi-webinar",
    // Los nombres de los campos son las claves con las que viajan al webhook.
    fields: [
      { type: "text", name: "nombre", label: "Nombre completo", required: true },
      { type: "email", name: "email", label: "Email", required: true },
      {
        type: "phone",
        name: "telefono",
        label: "WhatsApp",
        required: true,
        defaultDialCode: "+57",
      },
    ],
    // Qué se muestra cuando pasa registrationClosesAt.
    closed: {
      title: "Las inscripciones ya cerraron",
      body: "Este evento ya se realizó. Seguinos para enterarte del próximo.",
    },
  },

  // Qué ve la persona después de registrarse.
  success: {
    title: "¡Listo! Tu lugar está reservado",
    lines: ["Te enviamos los detalles por correo."],
    // variant: primary | whatsapp | telegram | calendar | download
    // Con variant "calendar" y href "auto" el enlace se arma solo con la fecha.
    cta: {
      label: "Agregar a mi calendario",
      href: "auto",
      variant: "calendar",
    },
  },

  sections: [
    {
      type: "hero",
      eyebrow: "Evento en vivo · Gratis",
      headline: "El titular principal va acá",
      // La segunda mitad se pinta con el color de marca.
      headlineHighlight: "y esto se resalta",
      subheadline: "Una línea que aclare para quién es y qué se lleva.",
      body: "Párrafo opcional. Podés usar **negritas** para enfatizar.",
      facts: [
        { icon: "Calendar", label: "Jueves 10 de diciembre" },
        { icon: "Clock", label: "7:00 PM (Colombia)" },
        { icon: "Video", label: "En vivo por Zoom" },
        { icon: "Gift", label: "100% gratis" },
      ],
      cta: { label: "Reservar mi lugar" },
      // Bloques opcionales de urgencia y prueba social:
      // scarcity: { percent: 60, label: "Cupos ocupados" },
      // socialProof: { count: 200, label: "personas ya se registraron" },
      showCountdown: true,
    },
    {
      type: "benefits",
      title: "Qué te vas a llevar",
      overlap: true,
      items: [
        "Primer beneficio concreto.",
        "Segundo beneficio concreto.",
        "Tercer beneficio concreto.",
      ],
    },
    {
      type: "form",
      headline: "Reservá tu lugar",
      subcopy: "Te mandamos el acceso apenas te registres.",
      submitLabel: "Reservar mi lugar",
      submittingLabel: "Reservando...",
      disclaimer: "Usamos tus datos sólo para este evento.",
    },
    {
      type: "faq",
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Tiene costo?", a: "No, es gratuito." },
        { q: "¿Queda grabado?", a: "Sí, enviamos la grabación a quienes se registren." },
      ],
    },
    // Podés repetir el formulario: uno apenas termina la portada y otro al
    // final. Comparten estado, así que registrarse en uno actualiza el otro.
    //
    // Otras secciones disponibles, en el orden que quieras:
    // { type: "audience", title: "Esto es para vos si sos...",
    //   items: ["Agencias", "Consultorios", "Restaurantes"],
    //   footnote: "Negocios que ya venden." }
    // { type: "tension", title: "...", paragraphs: ["..."] }
    // { type: "roadmap", items: [{ title: "...", current: true }] }
    // { type: "testimonials", items: [{ quote: "...", name: "..." }] }
    // { type: "speaker", name: "...", bio: "..." }
    // { type: "cta", title: "..." }
    // { type: "richText", paragraphs: ["..."] }
  ],
})

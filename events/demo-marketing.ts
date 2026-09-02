import { defineEvent } from "@/lib/types"

/**
 * Evento de ejemplo — agencia / marketing B2B.
 *
 * Muestra la landing completa: las diez secciones, urgencia, prueba social,
 * hoja de ruta de una serie y una acción de éxito hacia un grupo de WhatsApp.
 * Sirve de referencia y de prueba de humo del proyecto.
 */
export default defineEvent({
  slug: "demo-marketing",
  enabled: true,

  brand: {
    name: "Estudio Norte",
    tagline: "Crecimiento para negocios que ya facturan",
    disclaimer:
      "Este sitio no forma parte ni está respaldado por Meta Platforms, Inc. Facebook e Instagram son marcas de Meta Platforms, Inc. Los resultados mencionados corresponden a la experiencia de quien presenta y de sus clientes: no son típicos ni están garantizados, y los tuyos dependerán de tu negocio, tu experiencia y tu ejecución. Este taller es gratuito y no te compromete a nada. Al final haremos una oferta opcional para quienes quieran nuestra ayuda para implementarlo más rápido.",
    links: [
      { label: "Aviso de privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
    ],
  },

  theme: {
    preset: "corporate",
    backdrop: "mesh",
    radius: "soft",
    fonts: { sans: "inter", display: "fraunces" },
  },

  event: {
    date: "2026-10-15T19:00:00-05:00",
    registrationClosesAt: "2026-10-15T18:30:00-05:00",
    timeZone: "America/Bogota",
    timezoneLabel: "hora de Colombia",
    locale: "es-CO",
  },

  integration: {
    tags: ["webinar", "marketing", "demo"],
  },

  seo: {
    title: "Webinar gratis: cómo conseguir clientes sin depender de referidos",
    description:
      "Sesión en vivo del 15 de octubre, 7:00 PM Colombia. El sistema de adquisición que usamos para llenar la agenda de servicios profesionales.",
  },

  analytics: {
    enabled: true,
  },

  stickyCta: { label: "Quiero mi lugar en el webinar" },

  countdownLabels: {
    intro: "El webinar empieza en",
    days: "días",
    hours: "horas",
    minutes: "min",
    seconds: "seg",
  },

  waitingRoom: {
    defaultMinutes: 10,
    intro: {
      title: "El webinar está a punto de",
      titleHighlight: "empezar",
    },
    final: {
      title: "¡Comenzamos!",
      body: "Bienvenido a Citas que sí llegan. Tomá nota: en los próximos 60 minutos armamos tu sistema.",
    },
    // Mensajes reales de la edición anterior. Rotan durante el conteo para que
    // la sala no arranque en silencio.
    chat: [
      { name: "Valentina Ríos", text: "¡Buenas! Llegando desde Medellín 👋" },
      { name: "Marcos Peña", text: "Vengo de la edición pasada, se aprende muchísimo" },
      { name: "Clínica Sonrisas", text: "Presentes, con cuaderno en mano" },
      { name: "Daniela Ortiz", text: "Justo lo que necesitaba esta semana" },
      { name: "Estudio Norte", text: "¿Queda grabado? Igual me quedo en vivo 😄" },
      { name: "Equipo", text: "¡Sí, queda grabado! Arrancamos en unos minutos" },
    ],
  },

  form: {
    leadTag: "webinar-demo-marketing",
    fields: [
      { type: "text", name: "nombre", label: "Nombre completo", placeholder: "Cómo te llamás", required: true },
      { type: "email", name: "email", label: "Email", placeholder: "tu@empresa.com", required: true },
      { type: "phone", name: "telefono", label: "WhatsApp", placeholder: "300 123 4567", required: true, defaultDialCode: "+57" },
      {
        type: "select",
        name: "facturacion",
        label: "Facturación mensual",
        required: false,
        options: [
          { value: "menos-10k", label: "Menos de 10.000 USD" },
          { value: "10k-50k", label: "Entre 10.000 y 50.000 USD" },
          { value: "mas-50k", label: "Más de 50.000 USD" },
        ],
      },
    ],
    closed: {
      title: "Las inscripciones ya cerraron",
      body: "Este webinar ya se dictó. Dejanos tu correo en la web y te avisamos de la próxima fecha.",
      cta: { label: "Ver próximos eventos", href: "/" },
    },
  },

  success: {
    title: "¡Listo! Tu lugar está reservado",
    lines: [
      "Falta **un solo paso** para que no te lo pierdas.",
      "Entrá al grupo de WhatsApp: ahí mandamos el enlace de la sesión y los recordatorios.",
    ],
    cta: {
      label: "Unirme al grupo de WhatsApp",
      href: "https://chat.whatsapp.com/EJEMPLO",
      variant: "whatsapp",
    },
    footnote: "También te llegó un correo de confirmación.",
  },

  sections: [
    {
      type: "hero",
      eyebrow: "Webinar en vivo · Gratis",
      headline: "Conseguí clientes sin depender de",
      headlineHighlight: "los referidos",
      subheadline:
        "Una sesión práctica para dueños de negocios de servicios que quieren una fuente de clientes previsible.",
      body: "Si tu facturación **sube y baja según quién te recomiende**, el problema no es tu servicio: es que no tenés un sistema de adquisición.",
      facts: [
        { icon: "Calendar", label: "Miércoles 15 de octubre" },
        { icon: "Clock", label: "7:00 PM (Colombia)" },
        { icon: "Video", label: "En vivo por Zoom" },
        { icon: "Gift", label: "100% gratis" },
        { icon: "User", label: "Con Ana Duarte" },
      ],
      cta: { label: "Reservar mi lugar", icon: "CalendarDays" },
      scarcity: { percent: 68, label: "Cupos ocupados" },
      socialProof: { count: 340, label: "profesionales ya se registraron" },
      showCountdown: true,
    },
    {
      type: "form",
      eyebrow: "Paso 1",
      headline: "Asegurá tu lugar",
      headlineHighlight: "ahora",
      subcopy: "Te mandamos el enlace de acceso apenas te registres.",
      submitLabel: "Quiero asistir al webinar",
      submittingLabel: "Reservando...",
      disclaimer: "Evento sin costo, en vivo por Zoom. No enviamos spam y podés darte de baja cuando quieras.",
    },
    {
      type: "benefits",
      eyebrow: "Qué te llevás",
      title: "Salís de la sesión con",
      titleHighlight: "un plan concreto",
      overlap: true,
      items: [
        "El mapa de los tres canales que sí funcionan para servicios profesionales.",
        "Cómo calcular cuánto podés pagar por un cliente sin perder plata.",
        "La estructura de oferta que hace que te elijan sin competir por precio.",
        "Qué medir cada semana para saber si el sistema está funcionando.",
        "Los cuatro errores que hacen que la mayoría abandone a los dos meses.",
        "Una plantilla de seguimiento para tus oportunidades abiertas.",
      ],
    },
    {
      type: "tension",
      title: "El mes que no te recomiendan,",
      titleHighlight: "no facturás",
      paragraphs: [
        "Los referidos son una gran señal de que tu trabajo es bueno. El problema es que **no los controlás vos**: llegan cuando llegan.",
        "Un sistema de adquisición no reemplaza al boca a boca. Le pone un piso, para que un mes flojo de recomendaciones no se convierta en un mes flojo de caja.",
      ],
      cta: { label: "Quiero ese sistema", icon: "ArrowRight" },
    },
    {
      type: "roadmap",
      eyebrow: "Serie de formación",
      title: "Este webinar es",
      titleHighlight: "el primero de cuatro",
      items: [
        { title: "Conseguir clientes sin depender de referidos", status: "15 de octubre · Inscripción abierta", current: true },
        { title: "Cómo cobrar más sin perder oportunidades", status: "Próximamente", current: false },
        { title: "Del primer contacto al contrato firmado", status: "Próximamente", current: false },
        { title: "Retener y hacer crecer las cuentas que ya tenés", status: "Próximamente", current: false },
      ],
      cta: { label: "Empezar por el primero", icon: "ArrowRight" },
    },
    {
      type: "audience",
      eyebrow: "Para quién es",
      title: "Este webinar es para",
      titleHighlight: "negocios de servicios como",
      columns: 2,
      items: [
        "Agencias de marketing",
        "Estudios contables",
        "Consultoras de RR.HH.",
        "Estudios jurídicos",
        "Arquitectos y constructoras",
        "Consultores y terapeutas",
        "Agencias de diseño",
        "Asesores financieros",
      ],
      footnote: "Negocios que ya venden y quieren dejar de depender del boca a boca.",
    },
    {
      type: "testimonials",
      title: "Lo que dicen quienes ya",
      titleHighlight: "lo aplicaron",
      items: [
        {
          quote: "Pasamos de esperar el teléfono a tener una agenda con reuniones cargadas para tres semanas.",
          name: "Martín Salas",
          role: "Estudio contable",
        },
        {
          quote: "Lo más útil fue entender cuánto podía pagar por un cliente. Antes invertía a ciegas.",
          name: "Carolina Ruiz",
          role: "Consultora de RR.HH.",
        },
        {
          quote: "Aplicamos la estructura de oferta y dejamos de discutir precio en la primera reunión.",
          name: "Diego Ferrer",
          role: "Agencia de diseño",
        },
      ],
    },
    {
      type: "form",
      eyebrow: "Inscripción",
      headline: "Reservá tu lugar",
      headlineHighlight: "en 30 segundos",
      subcopy: "Te mandamos el enlace de acceso apenas te registres.",
      badge: "CUPOS LIMITADOS",
      submitLabel: "Reservar mi lugar",
      submittingLabel: "Reservando...",
      disclaimer: "Usamos tus datos solo para este evento. Podés darte de baja cuando quieras.",
    },
    {
      type: "faq",
      title: "Preguntas",
      titleHighlight: "frecuentes",
      items: [
        { q: "¿Tiene costo?", a: "No. La sesión es gratuita y en vivo." },
        { q: "¿Queda grabado?", a: "Sí, mandamos la grabación a quienes se registren, pero estar en vivo te permite preguntar." },
        { q: "¿Cuánto dura?", a: "Noventa minutos: sesenta de contenido y treinta de preguntas." },
        { q: "¿Sirve si recién arranco?", a: "Sirve más si ya tenés clientes y querés previsibilidad. Si estás empezando, te va a servir como mapa." },
        { q: "¿Me van a vender algo?", a: "Al final contamos qué hacemos, sin presión. El contenido se sostiene solo." },
      ],
    },
    {
      type: "speaker",
      title: "Quién presenta",
      name: "Ana Duarte",
      role: "Directora de Estudio Norte",
      bio: "Trabajó doce años en adquisición de clientes para empresas de servicios profesionales. Hoy dirige un equipo que administra presupuestos de captación en cinco países de la región.",
    },
  ],
})

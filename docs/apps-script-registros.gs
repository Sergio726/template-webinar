/**
 * Recibe los registros de la landing y los escribe en una hoja de cálculo.
 *
 * Cómo se instala (docs/GUIA-SIN-CODIGO.md lo explica paso a paso):
 *   1. Abrí https://script.google.com y creá un proyecto nuevo.
 *   2. Pegá este archivo entero en Código.gs y completá SHEET_ID y TOKEN.
 *   3. Implementar › Nueva implementación › Aplicación web, ejecutar como
 *      "yo", acceso "cualquier usuario". Autorizá el acceso cuando lo pida.
 *   4. La URL que te da, con `?token=...` al final, va en la variable
 *      REGISTRATION_WEBHOOK_URL de Vercel.
 *
 * Por qué el token viaja en la URL y no en una cabecera: Apps Script no expone
 * las cabeceras de la petición a `doPost`, así que el `Authorization: Bearer`
 * que la plantilla envía con WEBHOOK_SECRET no se puede leer acá. La URL vive
 * en una variable de entorno del servidor y nunca llega al navegador.
 */

/** ID de la hoja: es el tramo largo de su URL, entre /d/ y /edit. */
const SHEET_ID = "PEGA_AQUI_EL_ID_DE_TU_HOJA"

/** Contraseña del webhook. Inventá una larga; va también en la URL de Vercel. */
const TOKEN = "CAMBIA_ESTE_TOKEN_POR_UNO_LARGO_Y_ALEATORIO"

const HEADERS = [
  "Fecha",
  "Nombre",
  "Email",
  "WhatsApp",
  "País",
  "Respuestas",
  "Origen",
  "Campaña",
  "Página",
  "Evento",
  "ID de registro",
  "Datos completos",
]

/** Campos del lead que ya tienen columna propia; el resto va a "Respuestas". */
const CAMPOS_FIJOS = ["nombre", "email", "telefono", "phone"]

function doPost(e) {
  try {
    if (!e || !e.parameter || e.parameter.token !== TOKEN) {
      return json({ ok: false, error: "unauthorized" })
    }

    const payload = JSON.parse(e.postData.contents)
    const lead = payload.lead || {}
    const attribution = payload.attribution || {}
    const tracking = payload.tracking || {}
    const event = payload.event || {}
    const phone = lead.phone || {}

    // Cualquier campo extra del formulario (etapa, empresa, cargo...) se
    // conserva legible aunque no tenga columna propia.
    const respuestas = Object.keys(lead)
      .filter((k) => CAMPOS_FIJOS.indexOf(k) === -1)
      .map((k) => k + ": " + lead[k])
      .join(" · ")

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
    ensureHeaders(sheet)

    sheet.appendRow([
      // En la zona horaria del evento: quien lee piensa en la hora del webinar.
      formatDate(payload.submittedAt, event.timeZone),
      lead.nombre || "",
      lead.email || "",
      phone.e164 || lead.telefono || "",
      phone.country || "",
      respuestas,
      attribution.utm_source || attribution.referrer || "directo",
      attribution.utm_campaign || "",
      tracking.pageUrl || attribution.landingPath || "",
      event.tag || event.slug || "",
      payload.requestId || "",
      // Red de seguridad: nada se pierde aunque cambie el formulario.
      JSON.stringify(payload),
    ])

    return json({ ok: true })
  } catch (error) {
    return json({ ok: false, error: String(error) })
  }
}

/** Abrir la URL en el navegador debe responder ok: sirve para comprobar. */
function doGet() {
  return json({ ok: true, service: "registros-webinar" })
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return
  sheet.appendRow(HEADERS)
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
  sheet.setFrozenRows(1)
}

function formatDate(iso, timeZone) {
  if (!iso) return ""
  try {
    return Utilities.formatDate(new Date(iso), timeZone || "America/Bogota", "yyyy-MM-dd HH:mm")
  } catch (error) {
    return iso
  }
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  )
}

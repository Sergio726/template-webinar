# Plantilla de landing de webinar

Landing de captación para eventos en vivo. Sirve para cualquier rubro, no usa
base de datos y no está atada a ningún CRM: un webinar entero es **un archivo de
configuración**.

```bash
npm install
cp .env.example .env.local     # completá REGISTRATION_WEBHOOK_URL
npm run dev                    # http://localhost:3000
```

Vienen dos eventos de ejemplo, de rubros distintos a propósito, para que se vea
que el diseño no está pegado a un negocio: `/demo-marketing` y `/demo-salud`.

---

## Crear un webinar nuevo

**1. Copiá la plantilla**

```bash
cp events/_plantilla.ts events/mi-webinar.ts
```

**2. Editá el archivo.** Está comentado campo por campo. Lo mínimo: `slug`,
`brand.name`, `event.date`, `seo`, el `form` y las `sections`.

**3. Registralo** en `events/index.ts`:

```ts
import miWebinar from "./mi-webinar"

const RAW = [demoMarketing, demoSalud, miWebinar]
```

**4. Listo.** La ruta `/mi-webinar`, la página de gracias `/mi-webinar/registro`,
la imagen para compartir y la entrada del sitemap salen solas del slug.

Si el evento tiene imágenes propias, ponelas en `public/eventos/mi-webinar/` y
referencialas como `/eventos/mi-webinar/foto.jpg`.

---

## Cómo está armado

```
events/            Un archivo por webinar. Es lo único que se edita a diario.
  index.ts         Registro: importá acá cada evento nuevo.
  _plantilla.ts    Plantilla comentada para copiar.
app/
  [slug]/          La landing. El tema del evento se aplica en su layout.
  [slug]/registro/ Página de gracias, para campañas que registran por fuera.
  api/register/    Recibe el formulario y lo reenvía al webhook.
components/
  sections/        Una sección por tipo, más el renderizador.
  ui/              Botón, countdown, acordeón, campos, fondos.
  form/            Selector de país y tarjeta de éxito.
lib/
  types.ts         El esquema del config. La pieza central del proyecto.
  theme.ts         Los presets de color.
```

### El array `sections` manda

El orden del array **es** el orden de la página, y una sección que no está en el
array no existe. No hay banderas de "mostrar sí/no": para sacar la hoja de ruta,
se borra el bloque `{ type: "roadmap", ... }`.

Tipos disponibles: `hero`, `benefits`, `tension`, `roadmap`, `testimonials`,
`audience`, `form`, `faq`, `speaker`, `cta`, `richText`. El pie de página se
agrega siempre.

**El formulario puede repetirse.** Ponelo arriba, apenas termina la portada, y
otra vez al final: quien ya viene decidido no tiene que buscar dónde anotarse, y
quien necesita leer todo lo encuentra al terminar. Las dos instancias comparten
el estado — si alguien se registra en una, la otra pasa sola a la pantalla de
confirmación y la barra fija se retira. Tiene que haber al menos una; si no hay
ninguna, el build falla avisando.

`audience` es la grilla de "esto es para vos si sos…": deja que la persona se
reconozca en la lista y filtra a quien no calza antes de pedirle los datos.

### Temas

`theme.preset` elige la paleta completa: `corporate`, `warm`, `vibrant`, `dark`
o `nature`. Para un ajuste puntual sin salir del preset:

```ts
theme: { preset: "vibrant", tokens: { brand: "#FF5A36" } }
```

Ningún componente conoce un color literal: todos pintan con tokens semánticos
(`bg-brand`, `text-ink-muted`), así que cambiar el preset recolorea la landing
entera, incluidos el fondo decorativo y la imagen para compartir.

También se eligen el fondo (`mesh`, `grid`, `waves`, `aurora`, `none`), el
redondeo (`sharp`, `soft`, `round`) y el par de fuentes.

---

## Qué pasa cuando alguien se registra

1. El formulario valida en el navegador y hace POST a `/api/register`.
2. El servidor descarta bots (campo trampa y envíos demasiado rápidos), aplica
   un límite por IP, verifica que la inscripción siga abierta y **vuelve a
   validar** con el esquema reconstruido desde el config.
3. Reenvía un JSON a `REGISTRATION_WEBHOOK_URL` y responde.
4. El formulario se reemplaza por la tarjeta de éxito, sin recargar.

La URL del webhook vive sólo en el servidor: nunca entra al código que descarga
el navegador.

### El JSON que recibe tu webhook

```jsonc
{
  "schemaVersion": 1,
  "requestId": "…",
  "submittedAt": "2026-10-15T22:04:05.123Z",
  "event": { "slug": "mi-webinar", "name": "…", "organization": "…",
             "startsAt": "…", "timeZone": "America/Bogota", "tag": "mi-webinar" },
  "lead": {
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "phone": { "e164": "+573001234567", "dialCode": "+57",
               "national": "3001234567", "country": "Colombia" }
  },
  "attribution": { "utm_source": "meta", "utm_campaign": "…", "fbclid": "…",
                   "referrer": "…", "landingPath": "/mi-webinar" },
  "tracking": { "eventId": "…", "fbp": "…", "fbc": "…", "pageUrl": "…" },
  "tags": ["webinar"],
  "extra": {}
}
```

`schemaVersion` está para que puedas evolucionar el contrato sin romper lo que
ya tengas armado del otro lado.

Para probar sin montar nada: abrí <https://webhook.site>, copiá la URL que te da
y ponela en `REGISTRATION_WEBHOOK_URL`.

---

## Analítica

Opcional y apagada por defecto. Si no cargás ningún ID, la landing **no descarga
ni un script de terceros**.

```ts
analytics: { enabled: true, metaPixelId: "…", ga4Id: "G-…" }
```

Si definís `gtmId`, se carga solamente Tag Manager: el píxel y GA4 se administran
desde el contenedor, y cargarlos también acá contaría todo dos veces.

Las UTM se capturan apenas carga la página y se guardan para toda la visita, así
que no se pierden si la persona navega antes de completar el formulario.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila y prerenderiza todos los eventos |
| `npm run typecheck` | Verifica tipos |
| `npm run lint` | ESLint |
| `npm run check` | Tipos + lint |

Requiere Node 20.9 o superior.

---

## Decisiones que conviene conocer

- **Next 16 con App Router.** Los metadatos y la imagen de compartir se generan
  en el servidor. Es la razón principal de usar Next acá: los rastreadores de
  WhatsApp y Facebook no ejecutan JavaScript, así que una landing que arma sus
  etiquetas desde el navegador se comparte sin título ni imagen.
- **Las páginas son estáticas** y se regeneran cada hora, para que la cuenta
  regresiva no quede congelada con la fecha del build.
- **Sin base de datos.** Las fechas, el estado del evento y todo el contenido
  salen del config. Para bajar una landing, `enabled: false`.
- **El config se valida al compilar.** Un evento incoherente rompe el build con
  la ruta exacta del error, en vez de fallar en producción.
- **Descargo legal.** `brand.disclaimer` imprime un bloque de texto legal al pie
  (no afiliado a la plataforma de anuncios, resultados no típicos, aviso de que
  habrá una oferta). En la práctica hace falta para que Meta apruebe campañas.
- **TypeScript 5.9, no 7.** La 7.0 es el compilador nuevo escrito en Go y ya es
  la versión `latest`, pero salió hace poco. Cuando quieras probarla, es cambiar
  una línea del `package.json`.

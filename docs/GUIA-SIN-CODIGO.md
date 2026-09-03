# Guía: publicar la landing de un webinar con Claude Code, sin saber programar

Esta guía es para alguien que **nunca programó**. No vas a escribir código: le
vas a pedir las cosas a Claude en español y él las hace. Vos ponés el material
del cliente, tomás las decisiones y hacés tres o cuatro clics que Claude no
puede hacer por vos (iniciar sesión, autorizar).

Al terminar vas a tener:

- La **landing del webinar** publicada en internet, con formulario de registro,
  cuenta regresiva y diseño con la marca del cliente.
- Una **sala de espera** con cuenta regresiva para proyectar el día del evento.
- Una **hoja de Google** donde cae cada persona que se registra, al instante.

Tiempo estimado la primera vez: una tarde. Las siguientes: una hora.

---

## Antes de empezar: qué necesitás

### Cuentas (todas gratis)

| Cuenta | Para qué | Dónde |
| --- | --- | --- |
| **Claude** (plan con Claude Code) | Es quien hace el trabajo | https://claude.ai |
| **GitHub** | Guarda el proyecto y su historial | https://github.com/signup |
| **Vercel** | Publica la web en internet | https://vercel.com/signup — elegí *Continue with GitHub* |
| **Google** | La hoja donde caen los registros | La que ya tengas |

Creá las de GitHub y Vercel con el mismo correo. Cuando Vercel te pida permiso
para conectarse a GitHub, aceptá.

### Programas en tu computadora

Instalalos en este orden, con las opciones por defecto (siguiente, siguiente,
instalar):

1. **Node.js** — versión LTS: https://nodejs.org
2. **Git** — https://git-scm.com/downloads
3. **GitHub CLI** — https://cli.github.com
4. **Claude Code** — dos opciones, elegí una:
   - **Modo Cowork:** la app de escritorio de Claude. Abrís la carpeta del
     proyecto y hablás con Claude ahí adentro.
   - **Modo Code:** la terminal. Instalalo con la guía de
     https://docs.claude.com/claude-code y abrilo escribiendo `claude` en la
     carpeta del proyecto.

   En los dos modos hacés lo mismo: escribir en español lo que querés. Cambia
   solo dónde escribís.

Cuando termines, abrí Claude Code en cualquier carpeta y pegale esto:

```
Verificá que tengo instalados Node.js, Git y GitHub CLI, y decime las
versiones. Si falta alguno, decime cómo instalarlo.
```

### Tres inicios de sesión que hacés vos

Claude **no puede** escribir contraseñas ni aceptar permisos por vos. Hay tres
momentos en los que te toca a vos. Los dos primeros se hacen una sola vez:

**GitHub.** En Claude Code escribí (con el signo de admiración al principio):

```
! gh auth login
```

Elegí *GitHub.com* → *HTTPS* → *Login with a web browser*. Se abre el
navegador, pegás el código que te muestra, listo.

**Vercel.** Igual:

```
! npx vercel login
```

Elegí *Continue with GitHub* y confirmá en el navegador.

**Google** (más adelante, cuando conectes la hoja): vas a apretar un botón de
"Autorizar acceso". Llegamos a eso en el paso 6.

> Si usás la app de escritorio y no ves dónde escribir comandos, pedile a Claude:
> *"Necesito iniciar sesión en GitHub con gh auth login, ¿dónde lo escribo?"*.

---

## Paso 1 — Conseguir la plantilla

La plantilla es un proyecto listo que Claude adapta a cada cliente. Está en
https://github.com/Sergio726/template-webinar.

Creá una carpeta para tus proyectos (por ejemplo `C:\Proyectos` o
`~/Proyectos`), abrí Claude Code ahí y pegale:

```
Cloná https://github.com/Sergio726/template-webinar en esta carpeta,
instalá las dependencias y confirmame que compila sin errores.
```

Claude descarga la plantilla, instala lo que necesita y te dice si está bien.
Si dice que falta algo, hacé lo que te pida.

---

## Paso 2 — Preparar el material del cliente

Armá una carpeta con el nombre del cliente y poné adentro todo lo que tengas.
Claude lee archivos de texto, Word, PowerPoint, PDF e imágenes, así que no hace
falta ordenarlo: con que esté ahí alcanza.

**Lo mínimo para que salga bien:**

- El **logo** en PNG, preferiblemente con fondo transparente y en buena
  resolución. Del logo salen los colores de toda la landing.
- El **contenido del webinar**: de qué trata, qué se lleva la gente, para quién
  es, preguntas frecuentes. Un documento, la presentación, el guion — lo que
  el cliente te haya pasado.
- Los **datos del evento**, en un archivo `datos.txt`:

```
Nombre del cliente:
Fecha y hora del webinar (con zona horaria):
Plataforma (Zoom, Meet, YouTube...):
Quién presenta (nombre, cargo, una reseña de 3 líneas):
WhatsApp de contacto:
Correo de contacto:
Enlace del grupo de WhatsApp para registrados:
Instagram y otras redes:
```

Si falta alguno, no pasa nada: Claude pone un marcador claro y te avisa qué
quedó pendiente. Pero **la fecha** conviene tenerla, porque mueve la cuenta
regresiva y el cierre automático de inscripciones.

---

## Paso 3 — Crear la landing

Antes, creá el repositorio vacío en GitHub: https://github.com/new, nombre
tipo `webinar-nombredelcliente`, privado, sin marcar ninguna otra opción.
Copiá la dirección que te muestra (termina en `.git`).

Abrí Claude Code **en la carpeta de la plantilla** y pegale esto, completando
las tres partes entre corchetes:

```
Creá una nueva webinar para el cliente [NOMBRE DEL CLIENTE]. Toda la
información — contenido del webinar, esencia de la empresa, logo, colores,
diseño gráfico — la podés obtener de [RUTA DE LA CARPETA CON EL MATERIAL].
Este proyecto nuevo tiene que quedar en la carpeta [RUTA DE TUS PROYECTOS],
en una carpeta propia. Cuando esté listo subí todo a git en
[DIRECCIÓN DEL REPOSITORIO .git].
```

Claude va a tardar un rato: lee el material, saca los colores del logo, escribe
todos los textos, arma las secciones, verifica que compile y lo sube a GitHub.
Al terminar te da un resumen con lo que hizo y **lo que quedó pendiente**.
Leelo: ahí está la lista de lo que tenés que conseguir del cliente.

---

## Paso 4 — Verla y pedir cambios

```
Levantá el proyecto en local y decime en qué dirección lo abro.
```

Te da una dirección tipo `http://localhost:3000`. Abrila en el navegador,
recorré la landing y anotá lo que cambiarías. Después pedíselo en español,
como se lo dirías a un diseñador. Ejemplos reales que funcionan:

```
Dame otra propuesta de hero, con alguna imagen o gráfica que se adapte más
a la marca.
```

```
Quitá el badge de "Webinar en vivo · Gratis" y dejá en su lugar una luz roja
titilando con el texto en mayúsculas al lado.
```

```
Cambiá el fondo que está detrás de la cuenta regresiva.
```

```
La fecha del webinar es el jueves 15 de octubre a las 7 PM hora de Colombia.
Actualizala en todos los lugares donde aparezca.
```

```
Este es el WhatsApp de ventas [+1 ...] y este el correo [...]. Actualizá
todos los lugares de la landing donde corresponda.
```

Cada cambio, Claude lo aplica, lo verifica y lo sube a GitHub. Cuando algo te
guste, decíselo (*"me gusta, seguí con eso"*): así sabe qué dirección tomar.

---

## Paso 5 — Publicar en Vercel

Con la sesión de Vercel iniciada (paso 0), pedile:

```
Desplegá el proyecto en Vercel en producción y pasame la dirección pública.
```

La primera vez, Vercel crea el proyecto y te da una dirección tipo
`https://webinar-cliente.vercel.app`. **Esa es la landing publicada.** Abrila
y probala desde el celular también.

Si el cliente tiene dominio propio (`webinar.suempresa.com`):

```
Quiero conectar el dominio [DOMINIO] a este proyecto de Vercel. Decime qué
tengo que configurar yo y hacé el resto.
```

---

## Paso 6 — Conectar la hoja de Google

Acá está el único paso con clics tuyos en medio. Es corto.

**6a. Pedile a Claude que prepare todo:**

```
Conectá el formulario de registro a una hoja de Google para que se llene
sola cada vez que alguien se registra. Creá la hoja si podés; si no,
decime qué crear yo.
```

Si tu Claude tiene conectado Google Drive (en claude.ai: Configuración →
Conectores → Google Drive), crea la hoja solo. Si no, te va a pedir que la
crees vos en https://sheets.new y le pegues la dirección. Cualquiera de los
dos caminos sigue igual.

**6b. Autorizar el script.** Claude te va a dejar abierta una pantalla de
*Google Apps Script* y te va a pedir que aprietes **"Autorizar acceso"**.
Vas a ver un aviso que asusta: *"Google no ha verificado esta aplicación"*.
Es normal — la aplicación es un script tuyo, en tu cuenta. Apretá
*Configuración avanzada* → *Ir a … (no seguro)* → *Permitir*.

**6c. Pasarle la dirección.** Al terminar, la pantalla muestra una *URL de la
aplicación web* que termina en `/exec`. Copiala y pegásela a Claude:

```
Ya autoricé. Esta es la URL: [PEGÁ LA URL]
```

Claude la configura en Vercel, vuelve a publicar y **hace un registro de
prueba** para confirmar que la fila aparece en la hoja. Después borra la
prueba. Si querés verlo con tus ojos, registrate vos desde la landing
publicada y abrí la hoja.

> Si algún día se hace un cambio en el script, hay que volver a *Implementar →
> Gestionar implementaciones → Nueva versión*. Lo que se edita no se publica
> solo. Claude lo sabe; si le pedís un cambio ahí, te va a avisar.

---

## Paso 7 — Antes de lanzar

Cuando el cliente te haya pasado todo lo que faltaba, cargalo y pedí la
revisión final:

```
Verificá que ya esté todo listo para el lanzamiento.
```

Claude revisa que todas las páginas respondan, que los enlaces funcionen, que
no queden textos de prueba, que se vea bien en celular, que los metadatos
para compartir estén completos, y te devuelve una lista con lo que bloquea y
lo que conviene arreglar. Las cosas que más se olvidan:

- **La fecha real.** Si quedó la de ejemplo, la landing cierra inscripciones
  sola ese día.
- **El píxel de Meta** (y GA4 si lo usan). Sin eso, los anuncios no miden
  ni una conversión. Pedile al cliente el *Pixel ID* y decile a Claude:
  *"Configurá el píxel de Meta con el ID [...]"*.
- **Quién presenta**, con foto. Es el argumento de confianza más fuerte.
- **Política de privacidad.** Meta la pide para anuncios que captan datos.
  *"Redactá un borrador de política de privacidad para esta landing"*, y que
  el cliente lo revise.
- El **ícono de la pestaña** (favicon): que sea el del cliente, no el que
  trae la plantilla.

---

## El día del evento

Todo lo que se necesita está en una sola página interna:
`https://tu-landing.vercel.app/recursos`. Ahí están los enlaces a:

- la landing,
- el **formulario** directo (para pegar en historias),
- la **sala de espera** con cuenta regresiva: se abre en la computadora que
  transmite, se comparte pantalla, se eligen los minutos y se aprieta *Iniciar*
  (o la barra espaciadora). Cuando llega a cero, tira confeti y muestra
  "¡Comenzamos!",
- el grupo de WhatsApp y el contacto,
- la página de gracias, para campañas que registran desde Meta.

La hoja de Google se llena sola mientras la gente se registra. Abrila en otra
pestaña y mirala crecer.

---

## Cuando algo se traba

**"Claude dice que no puede iniciar sesión / que necesita permiso."**
Es uno de los tres logins del principio. Hacelo vos con `! gh auth login`,
`! npx vercel login` o el botón de autorizar de Google, y decile *"ya está,
seguí"*.

**"No veo el proyecto en Google."**
Buscalo en https://script.google.com (lista *Mis proyectos*) o pedile a
Claude: *"¿Dónde quedó el proyecto de Apps Script? Pasame el enlace directo"*.

**"La landing se ve pero sin íconos."**
Estás con una versión vieja de la plantilla. Decile: *"Actualizá la plantilla
desde GitHub y volvé a compilar"*.

**"Claude dice que no hay espacio en el disco."**
Pasa cuando se acumulan proyectos. *"Ayudame a liberar espacio en el disco"*
— te va a mostrar qué ocupa y te va a preguntar qué borrar antes de tocar
nada. Lo que borra se regenera solo.

**"Quiero volver a como estaba antes."**
Todo queda guardado en GitHub con historial. *"Volvé la landing a como estaba
ayer a la tarde"* o *"deshacé el último cambio"*.

**"Se me cerró Claude a la mitad."**
Abrilo de nuevo en la misma carpeta y decile: *"Retomá: estábamos armando la
landing de [cliente], ¿en qué quedamos?"*. Lee el proyecto y sigue.

---

## Palabras que van a aparecer

| Palabra | Qué es, en criollo |
| --- | --- |
| **Repositorio / repo** | La carpeta del proyecto guardada en GitHub, con todo su historial. |
| **Commit** | Una foto del proyecto en un momento. Claude hace una por cada cambio. |
| **Deploy / desplegar** | Publicar la web en internet. |
| **Producción** | La versión pública, la que ve la gente. |
| **Preview** | Una copia de prueba con dirección propia, para revisar antes de publicar. |
| **Webhook** | La dirección a la que la landing manda cada registro. En este caso, la de tu hoja. |
| **Variable de entorno** | Un dato guardado en Vercel que la web usa pero nadie ve (como la dirección del webhook). |
| **Apps Script** | El programita de Google que recibe los registros y los escribe en la hoja. |
| **Build / compilar** | Cuando Claude "arma" la web para publicarla. Si falla, te lo dice antes de subir nada. |

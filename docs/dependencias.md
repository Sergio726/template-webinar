# Dependencias y avisos de seguridad

Qué se actualiza, qué no, y por qué. Escrito el 17/10/2026.

## Por qué existe este archivo

`npm audit` devuelve avisos que no todos hay que arreglar, y algunos se
"arreglan" con un cambio que deja el proyecto peor. Sin una nota, cada vez
que alguien corre el comando vuelve a tomar la misma decisión desde cero, o
corre `npm audit fix --force` y rompe algo.

## Next 16.4.1 — actualizado, era crítico

Las versiones 16.0.0 a 16.3.7 tienen una vulnerabilidad **crítica** de
ejecución remota en `next/og`. Este proyecto **usa** `next/og`, en
[`app/[slug]/opengraph-image.tsx`](../app/%5Bslug%5D/opengraph-image.tsx),
así que no era un aviso teórico.

Dos cosas lo acotaban, y conviene saberlas porque son las que hay que
mantener:

- La ruta valida el slug con `getEvent(slug)` y devuelve una imagen vacía si
  no existe. No entra texto arbitrario de la URL al generador.
- `generateStaticParams` prerenderiza las imágenes de los eventos
  publicados, así que en condiciones normales ni siquiera se ejecuta bajo
  demanda.

Aun así se actualizó: el acote depende de que esas dos cosas sigan ahí, y la
falla está en la librería.

Al subir, `eslint-config-next` se alineó a la misma versión.

## Los cinco avisos que quedan — no se tocan

Todos salen de la misma cadena:

```
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces
```

`braces` tiene una denegación de servicio por agotamiento de pila con
patrones muy anidados.

**No se arregla, por tres razones:**

1. Es una **dependencia de desarrollo**. No viaja al sitio publicado: nada
   de esto llega al navegador de quien entra a una landing.
2. Para dispararla hay que pasarle patrones maliciosos **al linter propio**,
   o sea que quien pueda hacerlo ya controla el repositorio.
3. El arreglo que propone npm es **bajar** `eslint-config-next` a 14.2.35,
   que es una versión para Next 14. Rompería el linter de un proyecto en
   Next 16.

Se levanta solo cuando el plugin de Next actualice su `fast-glob`. Hasta
entonces, **no correr `npm audit fix --force`** en este repo.

## Cómo revisar esto más adelante

```bash
npm audit                 # ver el estado
npm audit fix             # solo lo que no rompe nada
npm run build             # siempre, después de tocar dependencias
```

Si aparece un aviso nuevo, la pregunta útil no es qué severidad tiene sino
estas tres: ¿viaja al navegador del visitante?, ¿puede dispararlo alguien de
afuera?, ¿el arreglo rompe algo? Un crítico en algo que solo corre en tu
máquina durante el build importa menos que un medio en el código que se
publica.

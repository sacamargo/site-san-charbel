# Sistema de diseño — Parroquia San Chárbel

**Fuente de verdad:** el mockup en `mockups/inicio.png`. Este documento explica *por qué* de
las decisiones; los valores exactos viven en `src/styles/global.css`, dentro del bloque
`@theme`. Si el código y este documento se contradicen, gana el mockup y se corrigen los dos.

**Stack:** Astro 7 (SSR con adaptador Node) · Tailwind v4 · Supabase.

---

## 1. Color

La marca es **oliva + arena sobre marfil**. El dorado es acento; nunca superficie ni estructura.

| Token | Valor | Uso |
|---|---|---|
| `ivory` | `#faf7f2` | Fondo de página |
| `surface` | `#ffffff` | Tarjetas |
| `surface-alt` | `#f8f5ee` | Tarjetas secundarias, estado vacío |
| `olive-900` | `#2f2e1b` | Pie de página |
| `olive-700` | `#4b4e1f` | Botón primario, foco |
| `olive-600` | `#5c5f2a` | Hover del botón primario |
| `sand` / `sand-soft` | `#d8c7a8` / `#e9dcc4` | Bandas destacadas |
| `gold-600` | `#6f5326` | Enlaces e iconos **con significado** |
| `gold-500` | `#b89868` | **Ornamento únicamente** |
| `gold-300` / `gold-100` | `#dec6a0` / `#f2e7d5` | Bordes suaves, fondos de icono |
| `ink` / `ink-soft` / `muted` | `#2b2a1c` / `#4f4d3f` / `#6f6c5c` | Títulos / cuerpo / metadatos |
| `on-dark` / `on-dark-muted` | `#faf7f2` / `#c9c7b8` | Texto sobre oliva |
| `line` | `#e7e1d5` | Bordes y divisores |

### La regla del dorado

**`gold-500` mide 2.54:1 sobre marfil.** No llega ni al 3:1 que exigen los iconos y el texto
grande. Por eso está partido en dos tokens y la distinción no es cosmética:

- **`gold-500` → ornamento.** Reglas bajo los títulos, separadores, marcas de agua. No comunica
  nada, así que no tiene umbral que cumplir.
- **`gold-600` → cualquier dorado que signifique algo.** Enlaces, iconos informativos. Mide
  6.68:1 sobre marfil y 5.25:1 sobre la foto del hero.

**Excepción medida: sobre fondo oscuro, el dorado SÍ es superficie.** La regla de arriba —el
dorado nunca es superficie— vale sobre marfil. Sobre la foto oscura del hero se invierte: el
botón oliva mide **1.06:1** contra el fondo, o sea que desaparece como forma y solo se lee su
texto, por debajo del 3:1 que WCAG 1.4.11 exige a un componente de interfaz. `gold-500` llega a
3.41:1 y es el único color de la paleta que lo consigue. De ahí la variante `primary-on-dark`
del botón (§6.2 del componente): fondo `gold-500`, texto `olive-900`.

El tono se oscureció al medirlo *sobre la página compuesta*: pasaba sobre marfil plano pero
fallaba encima de la foto. Es justo el caso que las parejas de tokens no detectan.

Es el error más fácil de cometer en esta paleta: un dorado bonito que nadie con poca visión
puede leer.

### Contrastes verificados

| Combinación | Ratio |
|---|---|
| `ink` sobre `ivory` | 13.55:1 |
| `ink-soft` sobre `ivory` | 7.97:1 |
| `muted` sobre `ivory` (≥14px) | 4.94:1 |
| `on-dark` sobre `olive-700` (botón) | 8.16:1 |
| `on-dark` sobre `olive-900` (pie) | 12.87:1 |
| `ink-soft` sobre `sand` | 5.13:1 |
| `gold-600` sobre `ivory` | 6.68:1 |
| `gold-600` sobre la foto del hero | 5.25:1 |

**Comprobar el contraste sobre la página compuesta, no sobre parejas de tokens.** Un color que
pasa contra su token de fondo puede fallar sobre una foto. La verificación buena: ocultar el
texto, capturar el fondo y muestrear el rectángulo exacto que ocupaba cada bloque.

---

## 2. Tipografía

**Playfair Display** (títulos, y la cita del pie en itálica) + **Nunito Sans** (todo lo demás).

Self-hosted con la API de fuentes de Astro (`fonts` en `astro.config.mjs`), sin dependencias
añadidas: descarga los archivos, los sirve desde nuestro dominio y genera fallbacks ajustados
por métricas. Solo se precargan los dos cortes del hero: Playfair 700 y Nunito 400.

> Si borras el bloque `fonts` de la config, `<Font />` revienta **en tiempo de petición** —no en
> el build, porque con SSR no se prerenderiza nada— y toda la tipografía cae a la del navegador.
> Ya pasó una vez.

Escala fluida entre 360 y 1280px, con un término en `rem` en cada `clamp()` para que el texto
siga escalando con el zoom (WCAG 1.4.4):

| Utilidad | Tamaño | Uso |
|---|---|---|
| `text-display` | 40 → 56 | Título del hero |
| `text-h2` | 28 → 34 | Títulos de sección |
| `text-h3` | 18 → 20 | Títulos de tarjeta |
| `text-body` | 16 | Cuerpo |
| `text-small` | 14 | Metadatos, botones |
| `text-overline` | 12 | Eyebrow, en versales |

**Cuidado con los nombres:** existe `--text-body` (tamaño) y **no** debe existir `--color-body`,
o Tailwind generaría dos utilidades `text-body` distintas. El color del cuerpo es `ink-soft`.

---

## 3. Estructura de Inicio

| # | Sección | Reparto |
|---|---|---|
| 1 | Cabecera | 4 ítems, marfil, subrayado dorado en el activo |
| 2 | Portada | Hero **oscuro**: foto a sangrado, velo encima y texto claro sobre ella |
| 3 | Próximos eventos | Carrusel con puntos de paginación + **tarjeta de estado vacío** |
| 4 | Momentos de la parroquia | Carrusel horizontal: misma altura, ancho variable |
| 5 | Horarios de misas | Lista de horarios (día + horas) + foto |
| 6 | San Chárbel, ruega por nosotros | Banda arena con marca de agua vegetal |
| 7 | Servicios de la parroquia | 6 tarjetas, 3×2 |
| 8 | Ubicación y contacto | Mapa + datos + foto |
| 9 | Pie | Oliva oscuro |

El **estado vacío** de la sección 3 es una pantalla real que el diseño especifica, no relleno:
cuando no haya eventos, es lo que ve la gente.

**Tres secciones se apartan del mockup a propósito.** Conviene saberlo antes de "corregirlas":

- La **portada** ya no es clara con la foto a un lado, sino la foto a sangrado completo con un velo
  oscuro y el texto encima. Los porcentajes del velo están calibrados a esa foto concreta y no se
  pueden copiar a otra: el detalle está en `Hero.astro`.
- **Momentos** era un mosaico de huecos fijos —una foto grande y cinco pequeñas, no seis como decía
  antes esta tabla— y ahora es un carrusel. El motivo es que la parroquia tiene muchas fotos y
  seguirán llegando: un mosaico no crece, o sobran huecos o sobran fotos. Además, dando a todas la
  misma altura y dejando que el ancho salga de su proporción, no se recorta ninguna; en las ranuras
  fijas una foto vertical perdía el 44% del alto.
- **Horarios de misas** lleva los horarios en una lista apilada —día a la izquierda, horas a la
  derecha— en vez de tres tarjetas en fila. En fila son bajas (un título y una línea de horas) y
  junto a la foto vertical dejaban ~297px de hueco muerto debajo. Apiladas y con `flex-1`, las
  filas se reparten el alto hasta encontrarse con la foto.

**Menú:** Inicio · San Chárbel · Agenda · Servicios. Sin botón "Donar".
"Chárbel" **lleva tilde en todo texto visible** aunque el mockup la omita en el logo: es un
descuido de maquetación. Las rutas y los nombres de archivo van sin tilde (`san-charbel`).

---

## 4. Convenciones

- **Tailwind en el marcado; nada de `<style>` scoped.** Los tokens del `@theme` son la única
  fuente de valores. No escribas un hex en un componente.
- Si necesitas un color nuevo, se añade al `@theme` **y se comprueba su contraste** antes de usarlo.
- `@theme` **no admite redefinición por media query**. Lo que antes eran tokens de espaciado
  contextuales ahora son utilidades responsive en el sitio de uso (`py-14 md:py-20`).
- Componentes en `PascalCase.astro`. Rutas y slugs en español sin tildes.
- `src/data/` es andamio temporal que imita las tablas de Supabase; los componentes no lo
  importan directamente, pasan por `src/lib/queries/`, que ya son funciones `async`. Migrar a
  Supabase debería tocar **solo** los archivos de `queries/`.

## 5. Accesibilidad — piso obligatorio

- Contraste AA en todo texto (§1).
- Foco visible en todo elemento interactivo. Nunca `outline: none` sin reemplazo.
- Blanco táctil mínimo de 44×44px. Si una tarjeta entera es enlace, el `::after` estirado
  necesita `z-index` por encima de la imagen, o la mitad superior deja de navegar.
- Un `<h1>` por página, jerarquía sin saltos.
- El menú móvil usa `<dialog>` + `showModal()`: foco atrapado, `Esc` y bloqueo de scroll los da
  el navegador.
- `alt` en toda imagen informativa, `alt=""` en decorativas.
- `prefers-reduced-motion` desactiva animaciones.

Parte de la comunidad es adulta mayor. Esto no es cumplimiento normativo: es que la señora que
busca el horario de la misa de las 7 pueda encontrarlo.

---

## 6. Pendiente de la parroquia

Los datos de contacto (dirección, teléfonos, correo) salen del mockup y **conviene confirmarlos**:
un diseño puede llevar datos de relleno con pinta de reales. En concreto, el mockup escribe el
correo como `info@parroquiasanchárbel.org`, **con tilde en el dominio** — un dominio con tilde es
un IDN y muchos clientes lo rechazan. Se usa la forma sin tilde.

Sigue faltando: día del mes de la misa a San Chárbel, fecha de la fiesta patronal, rito (latino o
maronita), logo oficial en vectorial, URLs de redes sociales y **las fotos reales**. El diseño
nuevo se apoya mucho más en fotografía que el anterior: el mosaico, el hero, el retrato del santo
y las dos fotos de contacto están todos con marcador de posición.

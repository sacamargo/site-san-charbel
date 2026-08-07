# Sistema de diseño — Parroquia San Chárbel

**Stack:** Astro (frontend) + Supabase (backend)
**Estado:** v2. Decisiones de color, tipografía, menú y alcance ya cerradas.

Este documento es la fuente de verdad visual y estructural. Los mockups aportan **cómo se ve**; `02-arquitectura-propuesta.md` manda en **qué existe y cómo se llama**. Donde los dos se contradigan, gana el documento 02 (ver §0.2).

Si algo que vas a construir no está aquí, no lo inventes en tu componente: propónlo, se agrega al sistema, y después se usa.

---

## 0. Decisiones cerradas

### 0.1 Resueltas

| Tema | Decisión |
|---|---|
| **Color base** | **Café**, como en los mockups. El verde no lo reemplaza. |
| **Verde** | Acento ocasional, limitado a **cuatro usos** (§1.3). Fuera de ellos no se usa. |
| **Dorado** | Acento principal: acciones, reglas, iconos, énfasis. |
| **Tipografía** | Playfair Display (display) + Nunito Sans (texto). Decidido a partir de los mockups (§2.1). |
| **Menú** | El de 6 ítems del documento 02. **El menú de 8 ítems de los mockups queda descartado.** |
| **Transmisiones en vivo** | Fuera de alcance. No se diseña reproductor ni página `/transmisiones`. |
| **Donaciones** | Habrá, y con volumen, pero **no se diseñan ahora**. Se reservan los espacios (§0.3). |
| **Ubicación** | Villa Carolina, Barranquilla, Atlántico, Colombia. |

### 0.2 Qué cambia respecto a los mockups

Los mockups se hicieron antes de fijar la arquitectura. Estas tres cosas se corrigen al implementar:

1. **Menú.** De 8 ítems (Inicio, Nosotros, Horarios, Sacramentos, Ministerios, Eventos, Noticias, Contacto) a **6**:
   ```
   Inicio | La Parroquia | San Chárbel | Sacramentos | Comunidad | Contacto    [ Donar ]
   ```
2. **Vocabulario.** "Ministerios" → **Pastorales**. "Eventos" → **Agenda**. "Nosotros" → **La Parroquia**. Esto aplica a rutas, títulos, nombres de componentes y de tablas.
3. **Horarios sale del menú** pero conserva su URL `/horarios`, porque va fijo en la portada y en el pie.

Todo lo demás de los mockups —composición, componentes, color, ritmo— se conserva íntegro.

### 0.3 Donaciones: qué se hace y qué no

**Sí ahora:** el botón "Donar" del encabezado y la banda de donación de la portada, ambos como piezas visuales terminadas. El botón apunta a `/donar`.

**No ahora:** la página `/donar`, la pasarela de pago, los formularios de aporte y los estados de transacción.

`/donar` se publica en fase 1 como página simple con los datos de cuenta y las formas presenciales de aportar. Cuando llegue el momento del pago en línea, se diseña completa. **No se acumula deuda visual**: los componentes ya definidos (botón primario, `PromoBand`, formularios de §6.15) alcanzan para construirla sin ampliar el sistema.

---

## 1. Color

### 1.1 Tokens

```css
:root {
  /* Café — superficies oscuras, texto, overlays. Color base del sitio. */
  --brown-900: #2A1E17;  /* footer, overlay de hero */
  --brown-800: #33241B;  /* encabezado sólido, bandas oscuras */
  --brown-700: #4A362A;
  --brown-600: #6B5445;

  /* Dorado — acento principal */
  --gold-700:  #7D5A2E;  /* TEXTO dorado sobre fondo claro (ver §1.5) */
  --gold-600:  #B0834A;  /* hover de botón primario, texto sobre fondo oscuro */
  --gold-500:  #C89A5E;  /* botón primario, reglas, iconos */
  --gold-300:  #E3C89A;  /* bordes de botón terciario */
  --gold-100:  #F5E9D7;  /* fondo de icono circular */

  /* Verde — acento ocasional. Uso restringido: ver §1.3 */
  --green-700: #2F5D4A;
  --green-100: #E4EDE8;

  /* Crema — lienzo */
  --cream-50:  #FBF9F5;  /* fondo de página */
  --cream-100: #F5EFE6;  /* bandas y bloques destacados */
  --cream-200: #EDE5DA;  /* bordes, divisores */
  --white:     #FFFFFF;  /* tarjetas */

  /* Texto */
  --text-900:  #3B2E26;  /* títulos */
  --text-700:  #5A4A3F;  /* cuerpo */
  --text-500:  #7A6A5E;  /* secundario, labels, metadatos */
  --text-on-dark:       #FBF9F5;
  --text-on-dark-muted: rgba(251, 249, 245, 0.78);

  /* Semánticos (formularios y avisos) */
  --success: var(--green-700);
  --error:   #B3453A;
  --warning: #C08A2E;

  /* Alias semánticos — usa SIEMPRE estos, no los crudos de arriba */
  --color-bg:           var(--cream-50);
  --color-bg-alt:       var(--cream-100);
  --color-surface:      var(--white);
  --color-surface-dark: var(--brown-800);
  --color-ink:          var(--brown-900);
  --color-accent:       var(--gold-500);
  --color-accent-hover: var(--gold-600);
  --color-border:       var(--cream-200);
}
```

### 1.2 Regla de uso

| Rol | Token | Dónde |
|---|---|---|
| Fondo de página | `--color-bg` | Todo el sitio |
| Bandas de sección | `--color-bg-alt` | Bloque devocional, banda de donación, franja de datos |
| Tarjetas | `--color-surface` | Sobre `--color-bg` o `--color-bg-alt` |
| Superficie oscura | `--color-surface-dark` | Pie, encabezado sólido, hero |
| Acento | `--color-accent` | Botón primario, regla bajo títulos, iconos, énfasis |

**El dorado es acento, no superficie.** Nunca pintes un bloque grande de dorado. En los cuatro mockups solo aparece en botones, reglas de ~48 px, iconos, badges y texto de énfasis.

**Proporción objetivo por pantalla:** ~70 % crema y blanco, ~20 % café, ~10 % dorado, y el verde por debajo del 2 %.

### 1.3 Los cuatro usos del verde

El verde **resalta, no estructura**. Solo aparece en:

1. **Etiquetas de categoría** — chips pill en Agenda, Noticias y Pastorales. Fondo `--green-100`, texto `--green-700`.
2. **Estados de éxito** — confirmación de envío de formularios: icono, borde y texto en `--green-700`.
3. **Botón de WhatsApp** — fondo `--green-700`, texto e icono en `--text-on-dark`. Es el único botón del sitio que no es dorado, y se justifica porque WhatsApp ya es verde en la cabeza de todo el mundo.
4. **Marca de agua de cedro y olivo** — el patrón vegetal de las bandas, en `--green-700` al **6 % de opacidad**. Guiño al Líbano de San Chárbel; a esa opacidad se lee como textura, no como color.

**Fuera de estos cuatro casos, no se usa verde.** Nada de títulos verdes, bandas verdes ni enlaces verdes. Si aparece un quinto caso, se discute y se agrega aquí antes de codificarlo.

### 1.4 Overlay de hero

Las imágenes de hero nunca van limpias: siempre llevan degradado que garantice la legibilidad.

```css
/* Hero oscuro (Inicio, Agenda, Horarios) — DESDE 768px */
background: linear-gradient(
  100deg,
  rgba(42, 30, 23, 0.92) 0%,
  rgba(42, 30, 23, 0.72) 45%,
  rgba(42, 30, 23, 0.25) 100%
);

/* Hero oscuro — BAJO 768px */
background: linear-gradient(
  180deg,
  rgba(42, 30, 23, 0.88) 0%,
  rgba(42, 30, 23, 0.60) 100%
);

/* Hero claro (San Chárbel, La Parroquia) — texto oscuro sobre crema */
background: linear-gradient(
  100deg,
  var(--cream-50) 0%,
  rgba(251, 249, 245, 0.85) 40%,
  rgba(251, 249, 245, 0) 75%
);
```

**Por qué el overlay oscuro cambia de eje en móvil.** El gradiente horizontal está calculado para un bloque de texto de 620 px anclado a la izquierda: deja el lado derecho casi limpio porque ahí no hay texto. En móvil el texto ocupa **todo** el ancho, así que el final de cada línea cae en la zona clara. Medido sobre los píxeles ya renderizados de la portada: **2.74:1 en el título y 3.64:1 en la entradilla**, ambos por debajo del mínimo. Con el gradiente vertical suben a 8.64:1 y 7.72:1.

**Comprobar el contraste sobre la foto, no sobre el token.** Un scrim que funciona sobre una imagen falla sobre otra. La verificación buena es ocultar el texto, capturar el fondo compuesto y muestrear el rectángulo exacto que ocupaba cada bloque; comparar pares de tokens no detecta nada de esto.

### 1.5 Contraste

Todo texto debe cumplir **WCAG AA (4.5:1)**. Combinaciones aprobadas:

| Texto | Fondo | Uso |
|---|---|---|
| `--text-900` | `--cream-50` / `--white` | Títulos y cuerpo |
| `--text-500` | `--white` | Labels y metadatos — **solo a 14 px o más** |
| `--text-on-dark` | `--brown-900` / `--brown-800` | Hero, pie |
| `--brown-900` | `--gold-500` | Texto del botón primario |
| `--green-700` | `--green-100` / `--white` | Chips y mensajes de éxito |

**Prohibido:** `--gold-500` y `--gold-600` como texto sobre fondo claro. `--gold-600` sobre crema da **3.23:1** y sobre blanco **3.39:1**, por debajo del 4.5:1 exigido. En piezas grandes o gruesas —títulos de 24 px o más, iconos, reglas— sí se admiten, porque ahí el umbral es 3:1.

**Para texto dorado sobre fondo claro existe `--gold-700`.** Medido: 5.92:1 sobre `--cream-50`, 6.22:1 sobre blanco, 5.45:1 sobre `--cream-100` y 5.19:1 sobre `--gold-100` (el hover de `tertiary`). En código se usa vía el alias `--color-accent-text`.

*(Este token se añadió al implementar. §6.2 pedía `--gold-600` para el texto de `tertiary` y `ghost-link`, lo que contradecía esta misma sección y el piso obligatorio de §10. Se resolvió a favor de la accesibilidad.)*

Contrastes verificados en la portada:

| Combinación | Ratio |
|---|---|
| `--text-900` sobre blanco | 13.09:1 |
| `--text-500` sobre blanco (14 px) | 5.18:1 |
| `--text-700` sobre `--cream-50` | 8.03:1 |
| `--text-on-dark` sobre `--brown-900` | 15.40:1 |
| `--brown-900` sobre `--gold-500` (botón primario) | 6.36:1 |
| `--green-700` sobre `--green-100` (chip) | 6.31:1 |
| `--text-on-dark` sobre `--green-700` (WhatsApp) | 7.17:1 |

### 1.6 Estados

```css
:focus-visible {
  outline: 2px solid var(--gold-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```
Hover: oscurecer 8 % o subir la sombra un nivel. Activo: bajar 1 px. Deshabilitado: 45 % de opacidad y `cursor: not-allowed`.

---

## 2. Tipografía

### 2.1 Familias — decididas

```css
--font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
--font-body:    'Nunito Sans', -apple-system, 'Segoe UI', sans-serif;
```

**Playfair Display** para títulos. Los serif de los mockups tienen alto contraste entre trazo grueso y fino, remates finos y terminaciones de gota: eso es Playfair o un pariente cercano. Además sostiene bien los tamaños grandes de "Horarios" a 64 px sin verse pesada, y transmite lo institucional sin caer en lo severo.

**Nunito Sans** para texto. Las formas redondeadas y la `a` de doble piso de los mockups apuntan a una sans humanista redondeada. Es cálida —importa en una parroquia—, tiene una familia completa de pesos, excelente legibilidad a 14–16 px en móvil, y cobertura total del español, incluidas `ñ` y vocales acentuadas.

Cargar solo los pesos usados: **Playfair 400/700**, **Nunito Sans 400/600/700**. Self-hosting con `font-display: swap`, y `preload` únicamente de los dos cortes del hero.

**Cómo se implementa.** Con la API de fuentes que trae Astro (clave `fonts` en `astro.config.mjs` + componente `<Font />`), sin ninguna dependencia añadida. Ella descarga los archivos, los sirve desde nuestro dominio y genera fallbacks ajustados por métricas, que es la palanca principal sobre el objetivo de CLS de §8.4. Las familias quedan expuestas como variables CSS (`--font-playfair`, `--font-nunito`) y `tokens.css` solo hace de puente:

```css
--font-display: var(--font-playfair);
--font-body:    var(--font-nunito);
```

La precarga selectiva se declara en `BaseLayout.astro`, no en la configuración: el `<h1>` del hero es Playfair 700 y su subtítulo Nunito 400, así que son exactamente esos dos cortes los que llevan `preload`.

- **Display:** títulos de página y de sección, títulos de tarjeta, cifras de la línea de tiempo, citas.
- **Body:** todo lo demás — párrafos, labels, botones, navegación, metadatos.

### 2.2 Escala

Escritorio → móvil, resuelta con `clamp()` para no necesitar media query por título.

| Token | Tamaño | Interlínea | Peso | Familia | Uso |
|---|---|---|---|---|---|
| `display-xl` | 64 → 40 | 1.08 | 700 | serif | Título de página interna ("Horarios") |
| `display-l` | 52 → 34 | 1.14 | 700 | serif | Hero de inicio y de detalle |
| `h1` | 40 → 30 | 1.2 | 700 | serif | Título principal de contenido |
| `h2` | 32 → 26 | 1.25 | 700 | serif | Título de sección |
| `h3` | 22 → 20 | 1.3 | 700 | serif | Título de tarjeta |
| `h4` | 18 → 17 | 1.4 | 600 | sans | Subtítulo, tarjeta pequeña |
| `body-l` | 17 | 1.7 | 400 | sans | Entradilla |
| `body` | 16 | 1.7 | 400 | sans | Cuerpo |
| `body-s` | 14 | 1.6 | 400 | sans | Metadatos, descripciones |
| `caption` | 13 | 1.5 | 400 | sans | Notas al pie |
| `overline` | 12 | 1.4 | 700 | sans | `uppercase`, `letter-spacing: 0.12em` |

### 2.3 Reglas

- **Máximo 70 caracteres por línea** en texto corrido (`max-width: 65ch`).
- Títulos serif con `letter-spacing: -0.01em`; `overline` con `+0.12em`.
- **Un solo `<h1>` por página.** No saltes niveles de encabezado por motivos visuales; para eso está la escala.
- Los saltos de línea del hero son intencionales: `<br>` solo en escritorio, nunca en móvil. Se resuelve con la utilidad `.br-desktop` de `utilities.css`.
- **"Chárbel" lleva tilde siempre** en texto visible. En rutas y nombres de archivo va sin tilde: `san-charbel`.

---

## 3. Espaciado, radios y sombras

### 3.1 Escala de espaciado (base 4 px)

```
4  8  12  16  20  24  28  32  40  48  56  64  80  96  120
```
Nada fuera de esta escala.

*(28 y 56 se añadieron al implementar: la tabla de aquí abajo ya los exigía —56 px entre secciones en móvil, 28 px de padding de banda— pero faltaban en la lista.)*

En código, un token por valor: `--space-4` … `--space-120`. Pedir un `--space-36` que no existe deja la propiedad sin resolver y el fallo salta a la vista, que es esta regla hecha mecánica.

| Contexto | Escritorio | Móvil |
|---|---|---|
| Entre secciones | 96 px | 56 px |
| Título de sección → contenido | 32 px | 24 px |
| Entre tarjetas de una grilla | 24 px | 16 px |
| Padding interno de tarjeta | 24 px | 20 px |
| Padding de banda destacada | 40 px | 28 px |

Estos cinco contextos viven como variables (`--space-section`, `--space-section-header`, `--space-grid-gap`, `--space-card-pad`, `--space-band-pad`) declaradas móvil primero y sobrescritas una sola vez en `md`. Ningún componente escribe su propia media query de espaciado.

### 3.2 Radios

```css
--radius-sm:   8px;   /* inputs, badges, chips */
--radius-md:  12px;   /* tarjetas, imágenes dentro de tarjetas */
--radius-lg:  16px;   /* tarjetas grandes, bandas */
--radius-xl:  24px;   /* panel flotante del hero */
--radius-full: 999px; /* botones, iconos circulares, avatares */
```

**Todos los botones son pill** (`--radius-full`). Sin excepción: es la firma visual más reconocible de los mockups.

### 3.3 Sombras

```css
--shadow-sm: 0 1px 2px rgba(42, 30, 23, 0.04);
--shadow-md: 0 4px 16px rgba(42, 30, 23, 0.06);
--shadow-lg: 0 12px 32px rgba(42, 30, 23, 0.10);
```

Sombras **muy suaves y difusas**. `--shadow-lg` se reserva para dos casos: la barra flotante bajo el hero y el panel sticky del sidebar. Las tarjetas normales usan `--shadow-sm` más `1px solid var(--color-border)`.

---

## 4. Layout

### 4.1 Contenedor y breakpoints

```css
--container-max: 1200px;
--gutter-desktop: 24px;
--gutter-mobile:  16px;
```

| Nombre | Ancho | Comportamiento |
|---|---|---|
| `sm` | ≥ 480 px | Grillas de 1 → 2 columnas |
| `md` | ≥ 768 px | Menú horizontal; 2–3 columnas |
| `lg` | ≥ 1024 px | Layout completo; sidebar sticky activo |
| `xl` | ≥ 1280 px | Contenedor tope a 1200 px |

Grilla de **12 columnas**, `gap: 24px`.

### 4.2 Repartos usados

| Patrón | Escritorio | Móvil |
|---|---|---|
| Horarios de la portada | 4 columnas iguales | 2 × 2 |
| Tres columnas del inicio | 3 + 6 + 3 | Apiladas |
| Detalle con sidebar | 8 + 4 | Apiladas, panel arriba |
| Texto + visual | 5 + 7 | Apiladas, texto primero |
| Grilla de pastorales | 4 columnas | 2 columnas |
| Noticias + Galería | 8 + 4 | Apiladas |
| Franja de datos | 3 iguales con divisor | Apiladas, sin divisor |

### 4.3 Sangrado completo

Solo tres elementos rompen el contenedor: **hero**, **pie** y **bandas** con fondo `--color-bg-alt`. Su contenido sigue respetando los 1200 px.

---

## 5. Iconografía e imagen

### 5.1 Iconos

- **Estilo lineal**, trazo de 1.5 px, extremos redondeados, caja de 24 × 24.
- Set: **Lucide** (coincide con el estilo de los mockups y tiene paquete para Astro).
- Color por defecto `--gold-500`; sobre fondo oscuro, `--text-on-dark`.
- **Icono circular:** el patrón más repetido del sistema. Círculo `--gold-100` con icono dorado centrado. Tamaños de 40, 56 y 72 px.
- Decorativos con `aria-hidden="true"`. Si un icono es el único contenido de un botón, necesita `aria-label`.

### 5.2 Imágenes

Siempre con `<Image />` de `astro:assets`: WebP/AVIF, `width`/`height` explícitos, `loading="lazy"` salvo el hero (`eager` + `fetchpriority="high"`).

| Componente | Relación |
|---|---|
| Hero de inicio | 16:9 (mín. 520 px de alto) — la foto actual es 1536×1024 (1.5:1) |
| Hero interno compacto | 21:9 (mín. 300 px) |
| Tarjeta de agenda / noticia | 3:2 |
| Tarjeta de servicio | 4:3 |
| Miniatura de galería | 4:3 |
| Retrato circular | 1:1 |

- **Foto real de la parroquia** siempre que exista. Sin bancos de imágenes para personas de la comunidad (criterio del documento 02, bloque 8).
- `alt` descriptivo obligatorio; `alt=""` si es decorativa.
- Marca de agua vegetal al 6 %, `aria-hidden`, nunca debajo de texto.

---

## 6. Componentes

Nombres de archivo en `src/components/`.

### 6.1 `Header`

Altura 72 px (64 en móvil). Logo circular de 40 px + wordmark en dos líneas: `PARROQUIA` en `overline`, `SAN CHÁRBEL` en serif 700.

**Navegación de 6 ítems** (`body-s` 600, separación de 32 px): Inicio · La Parroquia · San Chárbel · Sacramentos · Comunidad · Contacto. A la derecha, botón primario "Donar" con icono de corazón.

Con 6 ítems en vez de 8 sobra espacio: se aprovecha subiendo la separación a 32 px y dejando el wordmark completo sin abreviar.

**Dos variantes:** `transparent` (sobre hero; pasa a sólido con `--shadow-sm` al superar 80 px de scroll) y `solid` (fondo `--color-surface-dark`).

**Activo:** texto `--gold-500` + regla inferior de 2 px.
**Móvil:** hamburguesa a la derecha, panel a pantalla completa, foco atrapado, cierre con `Esc`.

Los ítems con hijos (La Parroquia, San Chárbel, Sacramentos, Comunidad) abren desplegable en escritorio y acordeón en móvil. **El ítem padre siempre es un enlace navegable**, no solo un disparador.

### 6.2 `Button`

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| `primary` | `--gold-500` | `--brown-900` | — | Una sola por bloque |
| `secondary` | `--white` | `--text-900` | — | Junto a una primaria sobre fondo claro |
| `outline-on-dark` | transparente | `--text-on-dark` | 1 px `rgba(251,249,245,.45)` | Junto a una primaria **sobre imagen oscura** |
| `tertiary` | transparente | `--gold-700` | 1 px `--gold-300` | "Ver todos", "Leer completo" |
| `ghost-link` | — | `--gold-700` | — | "Leer más →" |
| `whatsapp` | `--green-700` | `--text-on-dark` | — | Único botón verde (§1.3) |

Padding `12px 24px` (`sm`: `8px 18px`; `lg`: `16px 32px`). Radio pill. Icono opcional a la izquierda, 18 px, `gap: 8px`. **Altura mínima táctil de 44 px** — en `sm` el padding solo llega a ~32 px, así que el `min-height` es el que hace el trabajo y no se puede quitar.

`outline-on-dark` se añadió del mockup: es el segundo botón del hero. **Solo dentro de un hero o banda oscura** — sobre fondo claro es ilegible; ahí van `secondary` o `tertiary`.

**Bajo 480 px los botones agrupados van apilados y a ancho completo.** A esa anchura dos botones de contenido distinto quedan desalineados y se leen como cajas sueltas.

### 6.3 `SectionHeader`

Título `h2` serif + **regla dorada de 48 × 3 px** a 12 px debajo. Subtítulo opcional en `body` `--text-500`. Alineación `left` o `center`, decidida **por página completa**, no por sección suelta.

### 6.4 `InfoBar`

Tarjeta blanca, `--radius-xl`, `--shadow-lg`, superpuesta al hero con `margin-top: -72px`. Celdas iguales separadas por divisores de 1 px `--color-border`. Cada una: icono circular de 56 px + label `body-s` `--text-500` + valor `h4` `--text-900` + **chevron** a la derecha.

Móvil: apiladas, con divisores horizontales.

**La superposición de −72 px existe en todos los tamaños, móvil incluido.** El borde superior de la tarjeta cae dentro de la imagen del hero, con el fondo oscuro asomando a los lados de las esquinas redondeadas. No es decorativo: es lo que ata la tarjeta al hero en vez de dejarla flotando sobre el crema, y en móvil es lo que hace que la primera celda **asome por encima del pliegue** en lugar de empezar justo debajo.

*(Esta sección decía "móvil: sin superposición negativa". Era un error: el mockup móvil la tiene igual que el de escritorio.)*

#### Tres celdas de orientación, no de horarios

| Celda | Icono | Valor | Enlace |
|---|---|---|---|
| Próxima misa | `church` | calculado en el navegador | `/horarios` |
| Dirección | `map-pin` | dirección de la parroquia | `#como-llegar` |
| Despacho parroquial | `clock` | franja de atención | `/contacto` |

*(§7.1 pedía cuatro celdas de horarios —entre semana · dominicales · confesiones · despacho—. Se cambió a las tres del mockup: el horario completo ya tiene su propia sección justo debajo y no debe salir dos veces en la misma pantalla. La InfoBar responde a "¿cuándo es la próxima?, ¿dónde están?, ¿cuándo atienden?"; el horario responde a "¿cuáles son todas?".)*

**"Próxima misa" se calcula en el cliente**, no en el build: el sitio es estático y una hora horneada diría "Hoy" para siempre. Ver §8.3, isla nº3.

#### Presupuesto de altura — no es estético, sostiene §7.1

§7.1 declara **inamovible** que este bloque se vea sin hacer scroll en escritorio. La aritmética que lo gobierna:

```
borde superior de la tarjeta = alto del hero − superposición (72 px)
borde inferior               = borde superior + alto de la tarjeta
```

De ahí tres reglas que **no se cambian por gusto**:

1. **Las celdas son horizontales** (icono a la izquierda, texto a la derecha, chevron al final), con 20 px de padding vertical: 56 + 20 + 20 = **96 px**. Apiladas —icono encima, centrado— se van a ~163 px y el bloque se cae del pliegue en 1366×768, 1280×800 y 1536×864.
2. **En escritorio el valor ocupa una sola línea** (`nowrap` + `ellipsis`). Dos líneas suben la tarjeta a ~121 px. En móvil sí puede partir: ahí la tarjeta ya cae bajo el pliegue a propósito y no hay presupuesto que respetar.
3. **El enlace "Ver todos los horarios" va fuera de la tarjeta.** Cualquier fila extra dentro empuja el borde inferior. Cada celda es enlace por su cuenta.

**Reparto:** 1 columna bajo 1024 px, 3 columnas desde 1024 px. Con tres celdas cada una deja ~240 px de texto, así que no hace falta esperar a `xl` como cuando eran cuatro.

Medidas reales tras implementar (borde inferior de la tarjeta vs. alto útil del viewport):

| Viewport | Hero | Tarjeta | Borde inferior | Margen |
|---|---|---|---|---|
| 1024×681 | 540 | 96 | 564 | 117 px |
| 1280×690 | 540 | 96 | 564 | 126 px |
| 1366×681 | 540 | 96 | 564 | 117 px |
| 1440×790 | 620 | 96 | 644 | 146 px |
| 1920×955 | 620 | 96 | 644 | 311 px |

Si tocas la altura del hero, el padding de la celda, el tamaño del icono o el número de líneas del valor, **vuelve a medir estas cinco filas**.

#### Chevron como afordancia

El `chevron-right` al final de cada fila marca que la fila entera es pulsable. Es decorativo (`aria-hidden`): el enlace ya tiene texto propio. Se usa en toda fila-enlace de tarjeta —InfoBar, `ScheduleCard`, `AgendaCard`— y **nunca** en algo que no navegue.

### 6.5 `Hero` — cuatro variantes

| Variante | Alto | Fondo | Contenido |
|---|---|---|---|
| `home` | 620 px | Imagen + overlay oscuro | Título `display-l`, subtítulo, 2 botones, `InfoBar` |
| `page` | 300 px | Imagen + overlay oscuro | Título `display-xl`, regla dorada, párrafo |
| `light` | 480 px | Imagen + overlay claro | Eyebrow dorado, título `display-xl` oscuro, regla, párrafo |
| `detail` | 520 px | Imagen + overlay oscuro | Breadcrumb "← Volver", título, regla, cita en itálica, `MetaRow` |

Texto anclado a la izquierda con `max-width: 620px`.

**Excepciones a la altura de `home`.** Los 620 px son el caso general, pero §7.1 manda sobre §6.5: si la InfoBar no cabe sobre el pliegue, el hero cede. Dos excepciones documentadas, ambas en `tokens.css`:

| Condición | Alto | Motivo |
|---|---|---|
| `min-width: 1024px` y `max-height: 700px` | 540 px | Portátiles de 1366×768 con barra de tareas (~640 px útiles) |
| `min-width: 1024px` y `max-width: 1279px` | 500 px | Ahí la InfoBar aún es 2×2 y mide ~216 px en vez de ~121 px |

En móvil, `min-height: max(480px, 72svh)`. `svh` y no `vh`: al colapsar la barra de direcciones, `vh` cambia y produce un salto de layout que cuenta contra el CLS de §8.4.

### 6.5.1 `IconCircle`

Círculo `--gold-100` con icono dorado centrado, en 40, 56 o 72 px. §5.1 ya lo llamaba "el patrón más repetido del sistema" pero no estaba listado como componente; se añadió al construir la portada.

Lo usan `InfoBar`, `ScheduleCard`, `PastoralCard`, `NeedCard`, `FeatureCard` y `ServiceCard`. El icono ocupa ~45 % de la caja (18/40, 24/56, 32/72).

Variante `white`: círculo blanco con `--shadow-sm`, para la insignia flotante de `ServiceCard` (§6.6).

### 6.5.2 `ImagePlaceholder`

**Componente temporal.** Ocupa el hueco de cada imagen que todavía no existe (§12.2.8), con la relación de aspecto definitiva de §5.2.

Degradado de tokens de marca + trama diagonal al 4,5 % + leyenda en `overline` con la foto que va ahí. La trama es deliberada: deja claro que falta material en vez de disimularlo, y evita el banco de imágenes que §5.1 prohíbe.

Clave: lleva `aspect-ratio`, así que reserva ya la caja definitiva. Sustituirlo por `<Image />` con la misma relación no produce ningún salto de layout (§8.4).

Desaparece del sistema cuando lleguen las fotos reales.

### 6.6 Tarjetas

**`ScheduleCard`** — icono circular 40 px, día en `h4`, horas en `body-s`. Blanca, borde, `--radius-md`.

**`AgendaCard`** — imagen 3:2 con `DateBadge` sobre la esquina inferior izquierda; título `h3` (dos líneas, `line-clamp`); metadatos con icono de 14 px (hora, lugar). Toda la tarjeta es enlace. *(Era `EventCard` en los mockups.)*

**`NewsCard`** — imagen 3:2, fecha en `overline` `--text-500`, título `h4`, enlace "Leer más →".

**`ServiceCard`** — imagen 4:3 con **icono circular blanco de 48 px flotando sobre la esquina inferior izquierda de la imagen** (`translateY(-50%)`); título con regla dorada corta; líneas de horario; enlace. Es la tarjeta de Confesiones / Adoración / Rosario / Despacho.

**`PastoralCard`** — icono circular 56 px centrado + nombre en `body-s` 600 a dos líneas. Compacta y cuadrada. *(Era `MinistryCard`.)*

**`NeedCard`** — tarjeta del bloque "¿Qué necesitas?": icono circular 56 px, título `h4` en primera persona ("Bautizar a mi hijo"), enlace directo al sacramento. Cuatro por fila.

**`FeatureCard`** — icono circular + título `h4` + descripción `body-s`. Sin borde ni sombra dentro de un panel.

### 6.7 `DateBadge`

Caja blanca 56 × 56, `--radius-sm`, `--shadow-sm`. Día en serif 700 a 22 px, mes en `overline` `--text-500`.

### 6.8 `Chip`

Etiqueta de categoría pill, `body-s` 600, padding `4px 12px`. **Único componente verde del contenido** (§1.3): fondo `--green-100`, texto `--green-700`.

### 6.9 `Quote` y `Blockquote`

- **`Quote`** (oración del día): comilla decorativa dorada de 40 px, texto `body-l`, referencia en `body-s` 700.
- **`Blockquote`** (dentro de artículos): fondo `--cream-100`, **barra izquierda de 3 px `--gold-500`**, padding 24 px, referencia en `--gold-600`.

### 6.10 `PromoBand`

Banda a ancho completo, fondo `--color-bg-alt`, `--radius-lg`. Usos: bloque devocional de San Chárbel, banda de donación, CTA de cierre.

Visual a la izquierda (retrato circular con anillo dorado, o icono) + texto + botón a la derecha. Marca de agua vegetal al 6 % en el extremo opuesto. En móvil se apila y centra.

### 6.11 `SidePanel`

Tarjeta blanca `--shadow-lg`, `--radius-lg`, **`position: sticky; top: 96px`** desde `lg`. Título serif, texto breve, botón primario a todo el ancho, lista de contacto con iconos, y caja `--cream-100` con el dato destacado en `--gold-600`.

Bajo `lg` deja de ser sticky y se mueve **antes** del contenido principal.

### 6.12 `MetaRow` y `DataStrip`

- **`MetaRow`** — fila de 2–4 datos con icono + texto, separados 32 px, dentro de heros. Se envuelve en móvil.
- **`DataStrip`** — tres bloques iguales con divisores verticales sobre `--cream-100`, `--radius-lg`, padding 32 px.

### 6.13 `Timeline`

Horizontal en escritorio: iconos circulares, línea de 2 px `--color-border` con puntos dorados de 10 px, año en serif 700 y descripción en `body-s`. Máximo 5 hitos por fila. Sirve para la biografía de San Chárbel (1828 · 1851 · 1875 · 1965 · 1977) y para la historia de la parroquia.

**En móvil pasa a vertical**, línea a la izquierda. No se resuelve con scroll horizontal.

### 6.14 `Gallery`

Miniaturas 4:3, `--radius-md`, `gap: 16px`. 3 columnas en la portada, 6 en páginas internas, 2 en móvil. Hover `scale(1.03)`. Abre **lightbox** con teclado (`←` `→` `Esc`) y foco atrapado.

### 6.15 `Form`

No está en los mockups y es necesario (peticiones, catequesis, contacto).

- Label arriba, `body-s` 600 `--text-700`.
- Input: blanco, `1px solid var(--color-border)`, `--radius-sm`, padding `12px 16px`, alto mínimo 48 px. Foco: borde `--gold-500` + anillo de 3 px al 20 %.
- Error: borde `--error`, mensaje `body-s` con icono, vinculado por `aria-describedby`.
- Éxito: icono, borde y texto en `--green-700` (§1.3).
- Envío: botón deshabilitado con spinner y "Enviando…".
- Confirmación **en la misma página**, no en otra.
- Obligatorios con `*` y `required` real.
- **Casilla de consentimiento de datos obligatoria** en todo formulario (§10).

### 6.16 `Footer`

Fondo `--color-ink`. Cuatro columnas: marca + tagline + redes en iconos circulares con borde; enlaces rápidos en dos subcolumnas; contacto con iconos; **horarios resumidos** (el pie los repite a propósito, decisión del documento 02).

Abajo, centrado y separado por `1px solid rgba(255,255,255,0.12)`: copyright, enlace a la Arquidiócesis y aviso de privacidad, en `caption` `--text-on-dark-muted`.

Móvil: una columna, secciones apiladas, redes centradas.

---

## 7. Plantillas de página

### 7.1 Inicio — 11 bloques del documento 02

| # | Bloque | Componentes |
|---|---|---|
| 1 | Cabecera | `Header(transparent)` |
| 2 | Portada | `Hero(home)` — templo o imagen del santo, nombre + "Villa Carolina, Barranquilla" |
| 3 | **Orientación** | `InfoBar` de 3 celdas: próxima misa · dirección · despacho (§6.4) |
| 3b | **Horarios de misas** | `SectionHeader` + `ScheduleCard` × 3 + `Button(tertiary)` a `/horarios` |
| 4 | Bienvenida del párroco | Retrato circular + texto + `Button(tertiary)` a `/parroquia` |
| 5 | **Devoción a San Chárbel** | `PromoBand` — retrato con anillo dorado, `Quote` con la oración, botón primario |
| 5b | **Evangelio del día** | `Quote` con marca de agua vegetal + `Button(tertiary)` |
| 6 | ¿Qué necesitas? | `NeedCard` × 4 |
| 7 | Próximas celebraciones | `SectionHeader` + `AgendaCard` × 3 + enlace a `/agenda` |
| 8 | Nuestra comunidad | Fotos reales + `Button(tertiary)` a `/pastorales` |
| 9 | Noticias y avisos | `NewsCard` × 3 |
| 9b | **Galería** | `Gallery` sin lightbox + `Button(tertiary)` a `/galeria` |
| 10 | Cómo llegar | `MapEmbed` + `ContactPanel` |
| 10b | **Donación** | `PromoBand` → `/donar` (§0.3 y regla transversal de §7.5) |
| 11 | Pie | `Footer` |

Los bloques con letra (**3b**, **5b**, **9b**, **10b**) salieron del mockup y no estaban en los 11 originales del documento 02. Se añaden porque el mockup los muestra y ninguno contradice la arquitectura.

**Los bloques 3 y 5 no se mueven.** El 3 debe verse **sin hacer scroll** en escritorio: por eso el hero mide 620 px y la `InfoBar` se superpone con `-72px`. En móvil la misma superposición hace que la primera celda **asome sobre el pliegue**: se ve que hay algo más y se invita a bajar, en vez de dejar la tarjeta escondida justo debajo.

**Los mockups de referencia están en `mockups/`**, con la advertencia de qué partes suyas quedaron superadas por §0.2.

### 7.2 Página institucional (La Parroquia, San Chárbel)
```
Header(solid) → Hero(light)
Texto + Timeline
Panel de FeatureCard×5
Texto + Card×3
PromoBand(oración) + tarjeta de cita
Gallery
PromoBand(CTA)
Footer
```

### 7.3 Página de utilidad (Horarios)
```
Header(solid) → Hero(page)
SectionHeader(center) + 3 tarjetas grandes de misas
Barra de nota (horarios especiales de Semana Santa, Navidad y fiesta patronal)
ServiceCard×4
MapEmbed (7 col) + ContactPanel (5 col)
Footer
```

### 7.4 Detalle (celebración de la agenda, entrada de noticias)
```
Header(solid) → Hero(detail) con breadcrumb, cita y MetaRow
Contenido (8 col) + SidePanel sticky (4 col)
DataStrip×3
PromoBand(CTA WhatsApp)
Footer
```

### 7.5 Listado (Agenda, Noticias, Pastorales)
```
Header(solid) → Hero(page)
Chips de filtro (opcional)
Grilla de tarjetas (3 col → 2 → 1)
Paginación o "Cargar más"
Footer
```

### 7.6 Trámite (cada sacramento)

Estructura fija en las cuatro preguntas del documento 02, siempre en el mismo orden:
```
Header(solid) → Hero(page)
1. Qué es                     — 1 párrafo
2. Requisitos y documentos    — DataStrip o lista con iconos ← lo que viene a buscar la gente
3. Cómo solicitarlo           — pasos numerados
4. Costos o aportes           — caja --cream-100
SidePanel sticky: despacho parroquial, teléfono, WhatsApp
PromoBand(CTA)
Footer
```
El punto 2 es el que más se consulta: va **arriba del pliegue en móvil** y nunca dentro de un acordeón cerrado.

**Regla transversal:** toda página termina con un `PromoBand` de llamada a la acción antes del pie.

---

## 8. Implementación

### 8.1 Estructura de carpetas

```
src/
├── components/
│   ├── layout/     Header, Footer, Container, Section, MobileMenu
│   ├── ui/         Button, SectionHeader, DateBadge, Chip, Quote,
│   │               Blockquote, Icon
│   ├── cards/      ScheduleCard, AgendaCard, NewsCard, ServiceCard,
│   │               PastoralCard, NeedCard, FeatureCard
│   ├── blocks/     Hero, InfoBar, PromoBand, SidePanel, MetaRow,
│   │               DataStrip, Timeline, Gallery, ContactPanel, MapEmbed
│   └── forms/      Field, TextArea, Checkbox, SubmitButton, FormStatus
├── layouts/        BaseLayout, PageLayout, ArticleLayout
├── lib/
│   ├── supabase.ts       cliente
│   ├── queries/          una función por consulta, tipada
│   └── format.ts         fechas es-CO, horas, slugs
├── content/        contenido estático (sacramentos, historia, vida del santo)
├── data/           PROVISIONAL: sustituto de las tablas de Supabase
├── styles/         tokens.css, base.css, utilities.css
└── pages/
```

**`data/` vs `content/`.** No son lo mismo y la diferencia importa: `content/` es el texto institucional casi inmutable que §9.1 asigna al repositorio y se queda para siempre. `data/` es un andamio temporal —arreglos tipados que imitan las tablas de §9.2— y **desaparece** cuando se conecte Supabase.

Los componentes no importan nunca de `data/` directamente: pasan por `lib/queries/`. Cada consulta es una función `async` desde el primer día, aunque hoy solo lea un arreglo local. Ese detalle es lo que hace que migrar a Supabase toque **solo los archivos de `queries/`**: páginas, componentes y tipos no se enteran. Los filtros de §9.3 (`publicado`/`activo`, `orden`) se aplican ya, para que el comportamiento local coincida con lo que devolverá la base con RLS.

Los tipos de `lib/types.ts` son espejo columna por columna de §9.2, con los nombres en español y snake_case, así que pasan a ser los tipos de fila de Supabase sin capa de mapeo.

### 8.2 Estilos

**CSS plano, sin Tailwind.** Los tokens son variables CSS y esa es la única fuente de verdad.

*(Esta sección describía Tailwind leyendo los tokens desde variables CSS. Se cambió al implementar: con una fuente estática, cinco islas de JS y un sistema de tokens ya cerrado, Tailwind no aportaba lo suficiente para justificar la dependencia. Las tres prohibiciones del final se conservan intactas: son lo que de verdad sostiene el sistema y no dependen del stack.)*

**Tres archivos en `src/styles/`:**

| Archivo | Contenido |
|---|---|
| `tokens.css` | Todo §1, §2, §3 y §4.1. Ningún selector más allá de `:root`. |
| `base.css` | Reset, defaults de elemento, estados de §1.6, clases `.t-*` de la escala. |
| `utilities.css` | Solo helpers repetidos: `.container` `.section` `.band` `.full-bleed` `.measure` `.flow` `.rule-gold` `.br-desktop` `.visually-hidden` `.skip-link`. |

**Capas de cascada.** `tokens.css` declara primero:

```css
@layer tokens, base, utilities;
```

Esto importa por una razón concreta: Astro extrae los `<style>` de componente sin un orden garantizado respecto a las hojas globales. Con capas el resultado es determinista pase lo que pase con el empaquetado. Y como los estilos scoped de Astro **no** están en ninguna capa, y lo no-encapado gana a cualquier capa, un componente siempre puede sobrescribir una utilidad **sin un solo `!important`**.

**Contrato de la escala tipográfica:**

- Las custom properties `--step-*` son dueñas del `clamp()`, calculado una vez, interpolando entre 360 y 1280 px. Cada valor preferido lleva un término en `rem` (nunca `vw` puro) para que el texto siga escalando con el zoom — WCAG 1.4.4.
- Las clases `.t-*` de `base.css` agrupan las cinco declaraciones de cada fila (familia, tamaño, interlínea, peso, tracking). Esa repetición es la duplicación real que hay que evitar, no el `clamp()`.
- **Un componente nunca escribe `clamp()`.** Usa una clase `.t-*`, o `var(--step-*)` si solo necesita el tamaño.
- `<h2 class="t-h3">` es la forma sancionada de que un título se vea más pequeño sin saltar niveles de encabezado (§2.3).

Deliberadamente **no** hay presets de grilla: §4.2 define siete repartos distintos y una `.grid--3` genérica se usaría dos veces y se pelearía el resto. Cada bloque declara su grilla en su `<style>` scoped.

- Prohibido escribir un hex dentro de un componente. Siempre token.
- Prohibido escribir un espaciado fuera de la escala.
- Si una combinación de utilidades se repite más de tres veces, se vuelve componente.

### 8.3 Interactividad

Astro estático por defecto. Solo cinco piezas llevan JS:

1. Menú móvil y encabezado que cambia con el scroll
2. Carrusel de celebraciones de la portada
3. **"Próxima misa" de la `InfoBar`**
4. Lightbox de galería
5. Validación y envío de formularios, y acordeones de preguntas frecuentes

**Por qué "Próxima misa" merece una isla.** Es el único dato de la portada que depende de *cuándo* se mira la página. Con generación estática, calcularlo en el build lo congela: al día siguiente seguiría diciendo "Hoy" con la hora de ayer. El script lee los horarios de un `<script type="application/json">`, resuelve la hora actual **en `America/Bogota`** con `Intl.DateTimeFormat` + `formatToParts` —nunca con la zona del dispositivo, o alguien de viaje vería otra misa— y busca la siguiente ocurrencia en los próximos 7 días.

Sin JS la celda ya trae `Ver horarios` renderizado en el servidor y enlaza a `/horarios`: es cierto siempre y el script solo lo mejora. **Nunca renderizar en build una hora que caduca.**

Sin React, Vue ni Svelte mientras esto alcance.

**Mecanismo.** `client:visible` y `client:idle` solo aplican a componentes de framework, así que son incompatibles con la regla de arriba. El equivalente nativo es un `<script>` dentro del componente: Astro lo empaqueta como módulo y lo difiere. Si hace falta retrasarlo más, se envuelve en un `IntersectionObserver`. El presupuesto de cinco islas no cambia; cambia el nombre del mecanismo.

**Preferir la plataforma antes que el script.** En la portada esto ya evitó tres bloques de JS:

- Menú móvil con `<dialog>` + `showModal()` — atrapado de foco, cierre con `Esc`, backdrop y bloqueo de scroll salen gratis del navegador.
- Submenús con `<details>`/`<summary>` — acordeón sin JS.
- Desplegables de escritorio con `:hover` / `:focus-within` — accesibles por teclado sin JS.
- Estado de scroll del encabezado con un centinela de 1 px y `IntersectionObserver`, en vez de un listener de scroll con throttling.

Resultado medido en Inicio: **291 bytes de JS comprimido**, contra un presupuesto de 40 KB.

### 8.4 Presupuesto de rendimiento

| Métrica | Objetivo |
|---|---|
| Lighthouse (Rendimiento y Accesibilidad) | ≥ 95 |
| LCP | < 2.0 s en 4G |
| CLS | < 0.05 |
| JS por página | < 40 KB comprimido |
| Imagen del hero | < 250 KB |

Buena parte de la comunidad entra desde el celular con datos móviles.

---

## 9. Datos (Supabase)

### 9.1 Qué es dinámico y qué no

| Contenido | Dónde vive | Motivo |
|---|---|---|
| Agenda de celebraciones | Supabase | Cambia cada semana |
| Noticias y avisos | Supabase | Cambia cada semana |
| Galería | Supabase Storage | Se agregan fotos seguido |
| Horarios | Supabase | Cambia poco, pero debe poder cambiarse sin desplegar |
| Pastorales | Supabase | |
| Peticiones, catequesis, mensajes | Supabase | Escritura desde formularios |
| Sacramentos, historia, vida del santo, oraciones | Content Collections (repo) | Texto institucional, casi inmutable |

### 9.2 Tablas

```
celebraciones (id, slug, titulo, resumen, contenido, imagen_url, fecha_inicio,
               fecha_fin, hora, lugar, dirigido_a, categoria, cita, cita_referencia,
               publicado, orden)
noticias      (id, slug, titulo, resumen, contenido, imagen_url, fecha,
               categoria, publicado)
horarios      (id, tipo, dia, dias[], horas[], nota, orden, activo)
pastorales    (id, slug, nombre, icono, dirigido_a, dia_reunion, responsable,
               como_unirse, orden, activo)
galeria       (id, imagen_url, alt, album, orden, publicado)
peticiones    (id, nombre, intencion, email, consentimiento, creado_en)
inscripciones (id, programa, nombre, telefono, email, mensaje, consentimiento, creado_en)
mensajes      (id, nombre, email, telefono, asunto, mensaje, consentimiento, creado_en)
```

Sin tabla de donaciones hasta que se diseñe esa fase (§0.3). Sin tabla de transmisiones: descartadas.

**`horarios.dias`** es un arreglo de enteros, `0` = domingo … `6` = sábado. Se añadió al construir la portada: `dia` es texto libre para mostrar ("Lunes a viernes") y no se puede razonar sobre él, así que "próxima misa" (§6.4) necesitaba el dato estructurado. Los dos conviven: `dia` para leer, `dias` para calcular.

### 9.3 Seguridad

- **RLS activado en todas las tablas, sin excepción.**
- Contenido: `SELECT` público solo con `publicado = true`. Escritura solo con rol autenticado.
- `peticiones`, `inscripciones` y `mensajes`: `INSERT` público, **`SELECT` denegado al público**. Contienen datos personales y, en el caso de las peticiones, información sensible sobre salud y situaciones familiares. Se tratan con el mismo cuidado que una conversación privada con el párroco.
- La `anon key` es la única que toca el navegador. La `service_role key` jamás sale del servidor ni entra al repo.
- Anti-spam: honeypot + límite por IP. Sin captcha en la primera versión.

### 9.4 Formato

Fechas y horas en `es-CO`, zona `America/Bogota`, centralizado en `lib/format.ts`.
Fecha: `3 de julio de 2026`. Hora: `6:00 p.m.` (con puntos, como en los mockups).

---

## 10. Accesibilidad

Piso obligatorio, no aspiracional:

- Contraste AA en todo texto (§1.5).
- `:focus-visible` dorado en todo elemento interactivo. **Prohibido `outline: none` sin reemplazo.**
- Navegable con teclado de principio a fin. Menú móvil, lightbox y modales atrapan foco y cierran con `Esc`.
- Un `<h1>` por página, jerarquía sin saltos.
- `alt` en toda imagen informativa; `alt=""` en decorativas.
- Blanco táctil mínimo de 44 × 44 px.
- Formularios con `<label>` real vinculado; errores anunciados con `aria-live="polite"`.
- Enlace "Saltar al contenido" como primer elemento enfocable.
- `@media (prefers-reduced-motion: reduce)` desactiva animaciones y el autoplay del carrusel.
- El color nunca es el único portador de información: los chips verdes llevan texto, no solo color.
- `<html lang="es">`.

Parte de la comunidad parroquial es adulta mayor. Esto no es cumplimiento normativo: es que la señora que busca el horario de la misa de las 7 pueda encontrarlo.

---

## 11. Convenciones y checklist

**Nomenclatura**
- Componentes en `PascalCase.astro`; utilidades en `camelCase.ts`.
- Rutas y slugs en español, minúscula y con guiones: `/sacramentos/primera-comunion`.
- Sin acentos ni `ñ` en archivos ni URLs (`san-charbel`), **pero sí en todo texto visible** (San Chárbel).
- Clases propias en `kebab-case`, prefijadas por componente: `.agenda-card__title`.
- Vocabulario obligatorio: **Pastorales** (no Ministerios), **Agenda** (no Eventos), **La Parroquia** (no Nosotros).

**Checklist antes de abrir un PR**
- [ ] Sin hex ni espaciados fuera de los tokens
- [ ] Verde solo en los cuatro usos de §1.3
- [ ] Probado a 360, 768, 1024 y 1440 px
- [ ] Navegable solo con teclado; foco siempre visible
- [ ] Imágenes con `alt`, dimensiones y formato moderno
- [ ] Contraste verificado en texto nuevo
- [ ] Sin claves de Supabase en el cliente más allá de la `anon key`
- [ ] Lighthouse ≥ 95 en Rendimiento y Accesibilidad
- [ ] Componente nuevo → documentado en §6

---

## 12. Pendientes

### 12.1 Un punto a confirmar

**¿`/san-charbel/peticiones` sigue en pie?** Pregunté por "peticiones o intenciones de misa en línea" y la respuesta fue "no a ver misas en línea", que apunta a **transmisiones en vivo**. Registré las transmisiones como descartadas.

El formulario de peticiones lo dejé **en pie**, porque el documento 02 lo trata como el diferencial de la parroquia (bloque 5 de la portada, marcado como inamovible) y borrarlo por una lectura ambigua costaría más que mantenerlo. Si también va fuera: se elimina la tabla `peticiones`, el bloque 5 pierde su botón y se convierte en devocional puro, y `/san-charbel` baja de tres accesos a dos.

### 12.2 Sigue abierto en la parroquia

Del documento 02, ya resuelto el punto 4 (ciudad). Quedan:

1. **¿Qué día del mes es la misa a San Chárbel?** Estructura toda la agenda.
2. **¿Qué día es la fiesta patronal?** 24 de julio o tercer domingo de julio.
3. **¿Rito latino o maronita?** Cambia el vocabulario litúrgico de todo el sitio.
4. **Dirección exacta** en Villa Carolina, y confirmación de la Arquidiócesis de Barranquilla como jurisdicción.
5. **¿Quién actualiza el sitio?** Si no hay alguien con tiempo semanal, la agenda debe ser estática y sobra media base de datos.
6. **¿Hay boletín impreso?** Si existe, se sube en PDF.
7. **Logo oficial en vectorial**, o el retrato circular del encabezado queda como marcador de posición.
8. **Fotos reales** del templo, el párroco y las pastorales. Es lo que más condiciona que el sitio se vea vivo o genérico.

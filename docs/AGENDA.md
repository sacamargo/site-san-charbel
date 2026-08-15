# Agenda — decisiones, contrato y puesta en marcha

Responsable: **Camilo**. Fuente de verdad: el calendario dedicado de Google de la parroquia.

---

## 1. Cómo funciona

El servidor consulta la API de Google Calendar **una vez cada diez minutos** y guarda el
resultado en memoria. La vista mensual, la lista de próximos eventos y los eventos destacados
de la landing se derivan de esa misma copia: una llamada alimenta el sitio entero.

```
Google Calendar ──▶ fetchEvents ──▶ toParishEvents ──▶ caché (TTL 10 min)
                                                          │
                              ┌───────────────────────────┼───────────────────────┐
                              ▼                           ▼                       ▼
                       vista mensual            próximos eventos         destacados (landing)
```

La parroquia edita en Google Calendar y el cambio se ve en el sitio en diez minutos como
máximo. No hay creación, edición ni eliminación de eventos desde la aplicación, y no la va a
haber.

**No existe tabla de eventos en Supabase** (contrato 1 del equipo).

### Por qué no es un `<iframe>` de Google

Se evaluó y se descartó como opción por defecto. El iframe es literalmente en tiempo real y no
requiere mantenimiento, pero carga varios cientos de KB de JavaScript de terceros contra un
presupuesto de 40 KB, no respeta ningún token de la paleta ni la tipografía, no permite
garantizar contraste AA ni foco visible dentro del marco, no formatea en `es-CO`, y no admite
flyers, estados vacíos ni caché.

Queda disponible como **respaldo** con `AGENDA_SOURCE=embed`, por si el equipo decide cambiar.
El render propio ship **0 KB de JavaScript**.

---

## 2. Puesta en marcha

### 2.1 En Google Calendar

1. Crear un calendario **dedicado** para la parroquia. No es el calendario personal de nadie.
2. Configuración del calendario → **Permisos de acceso** → marcar *Hacer disponible para el
   público*, con el permiso **"Ver todos los detalles del evento"**.
3. Configuración del calendario → **Integrar calendario** → copiar el **ID del calendario**
   (algo como `xxxxxxxx@group.calendar.google.com`).

> El calendario es público: solo debe contener información segura para visitantes —títulos,
> fechas, lugares y descripciones sin datos privados.

### 2.2 En la consola de Google Cloud

1. Crear un proyecto (o usar el de la parroquia).
2. Habilitar la **Google Calendar API**.
3. Crear una **clave de API**.
4. Restringirla a la Google Calendar API únicamente.

### 2.3 En el proyecto

Copiar `.env.example` a `.env` y llenar:

```
GOOGLE_CALENDAR_ID=...
GOOGLE_CALENDAR_API_KEY=...
```

`GOOGLE_CALENDAR_API_KEY` **no lleva el prefijo `PUBLIC_`** a propósito: es de servidor y nunca
llega al navegador.

Si falta cualquiera de las dos, la página no se rompe: muestra el aviso *"La agenda todavía no
está conectada"* y el calendario vacío del mes actual.

---

## 3. Convención de flyers

Decidido: **enlace en la descripción del evento**. Sin infraestructura nueva y sin depender del
panel de administración.

Quien administre la agenda pega la URL de la imagen en la descripción del evento, idealmente
con etiqueta:

```
Flyer: https://…/afiche-fiesta-patronal.jpg
```

Se aceptan las etiquetas `Flyer`, `Afiche`, `Imagen`, `Pieza` y `Cartel`. Si no hay etiqueta,
se toma la primera URL de la descripción que parezca imagen.

Formatos reconocidos:

| Origen | Ejemplo | Nota |
|---|---|---|
| URL directa | `https://…/afiche.jpg` | `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif` |
| Google Drive | `https://drive.google.com/file/d/ABC123/view` | Se traduce sola a la forma incrustable |

La línea del flyer **se retira del texto visible** de la descripción: la imagen ya se muestra,
la URL cruda sobraría.

---

## 4. Contrato de datos con la landing

Contrato 2: la landing consume la interfaz, **nunca duplica datos**.

```ts
import { getFeaturedEvents } from '../lib/queries/agenda';

const { status, events } = await getFeaturedEvents(3);
```

`ParishEvent` está definido en [`src/lib/types.ts`](../src/lib/types.ts). Cualquier cambio en
esa interfaz se acuerda con **Daniel** antes de tocarla.

El componente compartido es [`EventCard.astro`](../src/components/cards/EventCard.astro). El
documento de diseño superado lo llamaba `AgendaCard`; se mantiene `EventCard` porque es el
nombre que ya está en la estructura del repositorio. **Punto abierto con Daniel.**

### Estados que la landing debe manejar

| `status` | Qué pasó | Qué mostrar |
|---|---|---|
| `ok` | Respuesta fresca | Los eventos |
| `stale` | Google falló, hay copia guardada | Los eventos, con aviso de posible desactualización |
| `unavailable` | Google falló y no hay copia | Estado vacío, sin culpar al visitante |
| `not-configured` | Faltan las variables de entorno | Estado vacío |

---

## 5. Decisiones tomadas

| Tema | Decisión | Motivo |
|---|---|---|
| Fuente | API de Google Calendar, render propio | Cumple tokens, accesibilidad, `es-CO` y presupuesto de rendimiento |
| Respaldo | `<iframe>` tras `AGENDA_SOURCE=embed` | Salida rápida si el equipo cambia de opinión |
| Caché | 10 min fresca, 24 h como copia de emergencia | Una llamada por cada diez minutos, y la agenda sobrevive a una caída de Google |
| Ventana consultada | Mes anterior → +12 meses | Una sola llamada cubre la navegación completa |
| Inicio de semana | **Domingo** | Convención colombiana, y el domingo es el día que la gente busca |
| Navegación de meses | Enlaces `?mes=YYYY-MM` | 0 KB de JS, funciona con teclado y es enlazable |
| Enlace por día | La celda entera es **un solo destino** | En 47 px de ancho no caben varios blancos táctiles de 44 × 44 |
| Flyers | Enlace en la descripción | Sin infraestructura nueva ni dependencia del panel |
| Eventos en curso | Se siguen mostrando hasta que terminan | Quien entra a las 6:15 quiere saber que la misa de las 6 está en curso |

---

## 6. Verificado

Comprobado con datos de prueba a 360 px y 1280 px:

- Fin **exclusivo** de los eventos de todo el día traducido a inclusivo (un evento marcado
  20 → 21 en Google es un solo día, el 20).
- Eventos de varios días ocupando todas sus celdas.
- Zona horaria: un evento de 7:00 p.m. en Bogotá cae el día correcto y no se corre al
  siguiente por el desfase con UTC.
- Horas en `es-CO` con el formato `6:00 p.m.` (con puntos).
- Eventos cancelados descartados.
- Enlaces de Drive envueltos por el redirector de Google, desenvueltos.
- Sin desbordamiento horizontal, sin blancos táctiles bajo 44 × 44, sin fallos de contraste,
  un solo `<h1>`, jerarquía de encabezados sin saltos, `alt` en toda imagen, ningún ancla rota.
- **0 KB de JavaScript** en el cliente.

---

### Volumen de eventos

Con `singleEvents=true`, **cada repetición de un evento recurrente cuenta como una entrada**.
Una misa diaria son unos 365 eventos al año; dos series diarias en la ventana de 13 meses pasan
de 750.

El cliente lee hasta **2000 eventos** (8 páginas de 250) y **avisa por consola** si alguna vez
se alcanza ese tope, con el prefijo `[agenda]`. Si eso ocurre, las opciones son poner fecha de
fin a las series recurrentes o reducir `WINDOW_MONTHS_FORWARD` en
[`src/lib/agenda/window.ts`](../src/lib/agenda/window.ts).

---

## 7. Pendientes

1. **Calendario dedicado de la parroquia.** Ahora mismo `.env` apunta al calendario principal de
   una cuenta personal, que es exactamente lo que la decisión del equipo descarta. Hay que crear
   un calendario secundario dedicado y cambiar `GOOGLE_CALENDAR_ID`.
2. **Nombre del componente compartido**: `EventCard` o `AgendaCard`. A definir con Daniel.
3. **¿Qué día del mes es la misa a San Chárbel?** y **¿qué día es la fiesta patronal?**
   Siguen abiertos con la parroquia y estructuran toda la agenda.
4. **¿Quién mantiene la agenda semanalmente?** Si no hay nadie, se reduce a celebraciones
   anuales y fijas, según lo ya acordado.
5. `Header`, `Footer` y `BaseLayout` de este proyecto son **provisionales** y pertenecen a
   Daniel. Se reemplazan al integrar.

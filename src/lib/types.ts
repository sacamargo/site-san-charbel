/**
 * Tipos de datos — Sistema de diseño §9.2
 *
 * Espejo columna por columna de las tablas de Supabase, conservando los
 * nombres en español y snake_case. Esa fidelidad es deliberada: cuando se
 * conecte Supabase, estos tipos pasan a ser los tipos de fila sin necesidad de
 * ninguna capa de mapeo entre la base y los componentes.
 */

/** Tabla `horarios` */
export interface Horario {
  id: string;
  /** Agrupador: misas dominicales, entre semana, confesiones, despacho… */
  tipo: 'misa' | 'confesion' | 'despacho' | 'adoracion' | 'rosario';
  /** Etiqueta legible: "Lunes a viernes", "Domingos". Para mostrar. */
  dia: string;
  /**
   * Días de la semana en que aplica, 0 = domingo … 6 = sábado. Para calcular.
   * `dia` es texto libre y no se puede razonar sobre él; esta columna es la que
   * permite resolver "próxima misa" sin adivinar.
   */
  dias: number[];
  horas: string[];
  nota: string | null;
  orden: number;
  activo: boolean;
}

/** Tabla `celebraciones` */
export interface Celebracion {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen_url: string | null;
  /**
   * PROVISIONAL — no es una columna de Supabase.
   *
   * Mientras los flyers vivan en `src/assets/eventos/` y no en Storage, esta es
   * la vía para que Astro los procese (`<Image>` necesita el import, no una
   * ruta suelta). Cuando la parroquia suba los flyers a Supabase, esto se borra
   * y manda `imagen_url`.
   *
   * Los flyers parroquiales son verticales y llevan el texto dentro; cómo se
   * recortan está explicado en EventCard.
   */
  imagen?: ImageMetadata;
  /** ISO 8601, p. ej. "2026-05-12" */
  fecha_inicio: string;
  fecha_fin: string | null;
  /** 24h, p. ej. "18:00" */
  hora: string | null;
  lugar: string | null;
  dirigido_a: string | null;
  categoria: string | null;
  cita: string | null;
  cita_referencia: string | null;
  publicado: boolean;
  orden: number;
}

/** Tabla `noticias` */
export interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen_url: string | null;
  fecha: string;
  categoria: string | null;
  publicado: boolean;
}

/** Tabla `pastorales` */
export interface Pastoral {
  id: string;
  slug: string;
  nombre: string;
  /** Nombre de icono del mapa de §5.1. */
  icono: string;
  dirigido_a: string | null;
  dia_reunion: string | null;
  responsable: string | null;
  como_unirse: string | null;
  orden: number;
  activo: boolean;
}

/** Tabla `galeria` */
export interface FotoGaleria {
  id: string;
  imagen_url: string;
  alt: string;
  album: string | null;
  orden: number;
  publicado: boolean;
}

/* ===========================================================================
   AGENDA — Google Calendar
   ===========================================================================

   Estos tipos NO son espejo de ninguna tabla, y es a propósito: el contrato 1
   del equipo dice que la agenda viene de Google Calendar y que **Supabase no
   tendrá tabla de eventos**. Van en inglés y camelCase, al revés que los de
   arriba, justamente para marcar que la fuente es una API externa y no una
   fila de nuestra base.

   PENDIENTE CON DANIEL: `Celebracion` (arriba) y `ParishEvent` (abajo)
   modelan lo mismo desde dos fuentes distintas. `Celebracion` viene del
   documento de diseño superado; `ParishEvent`, del contrato acordado. Hay que
   decidir cuál queda antes de conectar Supabase.
   =========================================================================== */

export interface ParishEvent {
  /** ID del evento en Google Calendar. Estable, sirve como ancla en la página. */
  id: string;
  /** Título tal como lo escribió la parroquia. Ya viene sin espacios sobrantes. */
  title: string;
  /** Descripción en texto plano, sin HTML y sin la línea del flyer. */
  description: string | null;
  start: Date;
  /** Para eventos de todo el día, el último día **inclusive** (Google lo da exclusivo). */
  end: Date;
  allDay: boolean;
  location: string | null;
  /** URL de imagen extraída de la descripción. Ver `docs/AGENDA.md` §3. */
  flyerUrl: string | null;
  /** Enlace al evento en Google Calendar, para "ver en Google". */
  sourceUrl: string | null;
}

/**
 * En qué estado llegó la agenda. Nunca lanzamos: la página siempre renderiza.
 *
 *  - `ok`              respuesta fresca de Google
 *  - `stale`           Google no respondió pero teníamos copia; se muestra con aviso
 *  - `unavailable`     Google no respondió y no había copia
 *  - `not-configured`  faltan GOOGLE_CALENDAR_ID o GOOGLE_CALENDAR_API_KEY
 */
export type AgendaStatus = 'ok' | 'stale' | 'unavailable' | 'not-configured';

export interface AgendaResult {
  status: AgendaStatus;
  events: ParishEvent[];
  /** Cuándo se trajeron estos datos de Google. `null` si nunca se pudo. */
  fetchedAt: Date | null;
}

/** Un día del calendario mensual, con los eventos que le corresponden. */
export interface CalendarDay {
  /** `YYYY-MM-DD` en la zona de Bogotá. */
  key: string;
  dayOfMonth: number;
  /** Falso en los días de relleno del mes anterior o siguiente. */
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  events: ParishEvent[];
}

export interface MonthGrid {
  /** `YYYY-MM` */
  key: string;
  /** `Agosto de 2026` */
  label: string;
  weeks: CalendarDay[][];
  /** `YYYY-MM` del mes anterior, o `null` si queda fuera de la ventana consultada. */
  previousKey: string | null;
  nextKey: string | null;
}

/** Los eventos de un día, para la lista de próximos eventos. */
export interface EventDayGroup {
  key: string;
  date: Date;
  events: ParishEvent[];
}

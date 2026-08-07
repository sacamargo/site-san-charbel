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

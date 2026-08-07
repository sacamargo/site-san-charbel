/**
 * Formato de fechas y horas — Sistema de diseño §9.4
 *
 * Todo en es-CO, zona America/Bogota, centralizado aquí.
 * Fecha: "3 de julio de 2026".  Hora: "6:00 p.m." (con puntos, como en los mockups).
 */

const LOCALE = 'es-CO';
const TIME_ZONE = 'America/Bogota';

/**
 * Normaliza el marcador de meridiano a la forma exacta que pide §9.4.
 *
 * Intl devuelve "6:00 p. m." con un espacio fino de no separación (U+202F o
 * U+00A0) dentro del marcador, y el detalle cambia entre versiones de ICU
 * (Node vs navegador vs CI). Confiar en la salida cruda produce diferencias
 * invisibles en el HTML según dónde se construya, así que se normaliza a mano.
 */
function normalizarMeridiano(valor: string): string {
  return valor
    .replace(/[  ]/g, ' ')
    .replace(/\bp\.\s*m\.?/i, 'p.m.')
    .replace(/\ba\.\s*m\.?/i, 'a.m.')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "2026-07-03" → "3 de julio de 2026" */
export function formatFecha(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? parseFechaISO(fecha) : fecha;
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** "2026-07-03" → { dia: "3", mes: "JUL" } para DateBadge (§6.7) */
export function formatFechaCorta(fecha: string | Date): { dia: string; mes: string } {
  const d = typeof fecha === 'string' ? parseFechaISO(fecha) : fecha;
  const dia = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, day: 'numeric' }).format(d);
  const mes = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, month: 'short' })
    .format(d)
    .replace('.', '')
    .toUpperCase();
  return { dia, mes };
}

/** "18:00" → "6:00 p.m." */
export function formatHora(hora: string): string {
  const [h, m] = hora.split(':').map(Number);
  if (h === undefined || Number.isNaN(h)) return hora;

  // Fecha arbitraria: solo interesan las horas y los minutos.
  const d = new Date(Date.UTC(2000, 0, 1, h, m ?? 0));
  const salida = new Intl.DateTimeFormat(LOCALE, {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  return normalizarMeridiano(salida);
}

/** ["07:00", "09:00"] → "7:00 a.m. | 9:00 a.m." */
export function formatHoras(horas: string[], separador = ' | '): string {
  return horas.map(formatHora).join(separador);
}

/**
 * Versión compacta para espacios de una sola línea, como las celdas de la
 * InfoBar (§6.4).
 *
 * Los domingos tienen cuatro misas y escribirlas enteras no cabe en una celda
 * de cuatro columnas: parte en dos líneas y se lleva por delante el
 * presupuesto de altura que sostiene el requisito de §7.1 (ver el bloque 3 sin
 * hacer scroll).
 *
 * Con una o dos horas se listan; con más se muestra el rango de la primera a
 * la última, que cabe siempre y comunica mejor "hay misas toda la mañana" que
 * un "+2" suelto. El detalle completo vive en /horarios, que es justo a donde
 * enlaza cada celda.
 */
export function formatHorasResumen(horas: string[]): string[] {
  if (horas.length === 0) return [];
  if (horas.length <= 2) return horas.map(formatHora);

  const primera = horas[0];
  const ultima = horas[horas.length - 1];
  if (!primera || !ultima) return [];
  return [`${formatHora(primera)} – ${formatHora(ultima)}`];
}

/**
 * Parsea "YYYY-MM-DD" como fecha local, no UTC.
 * `new Date("2026-07-03")` la interpreta como medianoche UTC, que en Bogotá
 * (UTC-5) es el 2 de julio: un día menos en todo el sitio.
 */
function parseFechaISO(fecha: string): Date {
  const soloFecha = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!soloFecha) return new Date(fecha);
  const [, y, m, d] = soloFecha;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

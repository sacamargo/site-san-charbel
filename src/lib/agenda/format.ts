/**
 * Formato específico de la Agenda.
 *
 * Lo genérico vive en `@/lib/format` y **no se duplica aquí**: `formatFecha` y
 * `formatFechaCorta` se reutilizan tal cual. Lo que se añade son las piezas que
 * solo necesita un calendario: claves de día, rangos de evento y edad de la
 * caché.
 *
 * La diferencia de fondo con `@/lib/format` es el tipo de entrada. Aquellas
 * funciones reciben lo que guarda Supabase (`"2026-07-03"`, `"18:00"`); estas
 * reciben instantes reales (`Date`) porque Google Calendar entrega ISO 8601 con
 * desfase horario.
 */

import { LOCALE, TIME_ZONE, formatFecha } from '@/lib/format';

/** Desfase fijo de Colombia. No hay horario de verano, así que es seguro. */
export const UTC_OFFSET = '-05:00';

const horaFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const diaMesFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
});

const diaSemanaFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: 'long',
});

const mesAnioFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  month: 'long',
  year: 'numeric',
});

/** `en-CA` produce YYYY-MM-DD, que es exactamente la clave que necesitamos. */
const claveFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Misma normalización que `@/lib/format`: Intl devuelve "6:00 p. m." con un
 * espacio fino de no separación, y el detalle cambia entre versiones de ICU.
 */
function normalizarMeridiano(valor: string): string {
  return valor
    .replace(/[  ]/g, ' ')
    .replace(/\bp\.\s*m\.?/i, 'p.m.')
    .replace(/\ba\.\s*m\.?/i, 'a.m.')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalizar(valor: string): string {
  return valor.charAt(0).toLocaleUpperCase(LOCALE) + valor.slice(1);
}

/** `Date` → `6:00 p.m.` (la de `@/lib/format` recibe `"18:00"`). */
export function formatHoraDe(fecha: Date): string {
  return normalizarMeridiano(horaFormatter.format(fecha));
}

/** `3 de julio` — para rangos donde el año ya se dijo. */
export function formatDiaMes(fecha: Date): string {
  return diaMesFormatter.format(fecha);
}

/** `viernes` */
export function formatDiaSemana(fecha: Date): string {
  return diaSemanaFormatter.format(fecha);
}

/** `Agosto de 2026` */
export function formatMesAnio(fecha: Date): string {
  return capitalizar(mesAnioFormatter.format(fecha));
}

/**
 * Clave `YYYY-MM-DD` del día en que cae la fecha **en Bogotá**.
 * Es la pieza que evita que un evento de las 7:00 p.m. aparezca en el día
 * siguiente por culpa del desfase con UTC.
 */
export function claveDia(fecha: Date): string {
  return claveFormatter.format(fecha);
}

/** Clave `YYYY-MM` del mes en que cae la fecha en Bogotá. */
export function claveMes(fecha: Date): string {
  return claveDia(fecha).slice(0, 7);
}

/** Día del mes como número, calculado en la zona de Bogotá. */
export function numeroDia(fecha: Date): string {
  return String(Number(claveDia(fecha).slice(8, 10)));
}

/** Valor para el atributo `datetime` de `<time>`. */
export function isoAttribute(fecha: Date, todoElDia: boolean): string {
  return todoElDia ? claveDia(fecha) : fecha.toISOString();
}

/**
 * Cuándo ocurre un evento, en una sola línea legible.
 *
 *   Todo el día, un día      → `3 de julio de 2026`
 *   Todo el día, varios días → `Del 3 al 5 de julio de 2026`
 *   Con hora, mismo día      → `3 de julio de 2026, 6:00 p.m. a 7:30 p.m.`
 *   Con hora, cruza días     → `3 de julio, 10:00 p.m. — 4 de julio, 1:00 a.m.`
 */
export function formatCuando(evento: { start: Date; end: Date; allDay: boolean }): string {
  const mismoDia = claveDia(evento.start) === claveDia(evento.end);

  if (evento.allDay) {
    if (mismoDia) return formatFecha(evento.start);
    const mismoAnio = claveDia(evento.start).slice(0, 4) === claveDia(evento.end).slice(0, 4);
    const desde = mismoAnio ? formatDiaMes(evento.start) : formatFecha(evento.start);
    return `Del ${desde} al ${formatFecha(evento.end)}`;
  }

  if (mismoDia) {
    return `${formatFecha(evento.start)}, ${formatHoraDe(evento.start)} a ${formatHoraDe(evento.end)}`;
  }

  return `${formatDiaMes(evento.start)}, ${formatHoraDe(evento.start)} — ${formatDiaMes(evento.end)}, ${formatHoraDe(evento.end)}`;
}

/** Solo la franja horaria, para la lista y las celdas del calendario. */
export function formatFranja(evento: { start: Date; end: Date; allDay: boolean }): string {
  if (evento.allDay) return 'Todo el día';
  const mismoDia = claveDia(evento.start) === claveDia(evento.end);
  const inicio = formatHoraDe(evento.start);
  return mismoDia ? `${inicio} a ${formatHoraDe(evento.end)}` : inicio;
}

/** `Viernes, 3 de julio de 2026` — encabezado de un grupo de la lista. */
export function formatEncabezadoDia(fecha: Date): string {
  return `${capitalizar(formatDiaSemana(fecha))}, ${formatFecha(fecha)}`;
}

/** `hace 4 minutos` — para el aviso de datos desactualizados. */
export function formatAntiguedad(desde: Date, ahora: Date = new Date()): string {
  const segundos = Math.max(0, Math.round((ahora.getTime() - desde.getTime()) / 1000));
  if (segundos < 60) return 'hace menos de un minuto';

  const minutos = Math.round(segundos / 60);
  if (minutos < 60) return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

  const dias = Math.round(horas / 24);
  return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
}

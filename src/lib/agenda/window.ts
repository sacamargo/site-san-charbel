/**
 * Aritmética de meses sobre claves `YYYY-MM` y `YYYY-MM-DD`.
 *
 * Todo se ancla al **mediodía UTC** del día en cuestión. A esa hora son las
 * 7:00 a.m. en Bogotá, así que el día del calendario coincide en las dos zonas
 * y ninguna operación puede desplazarse un día por el desfase.
 */

import { UTC_OFFSET, claveDia, claveMes } from './format';

/** Cuánto hacia atrás y hacia adelante se consulta Google en una sola llamada. */
export const WINDOW_MONTHS_BACK = 1;
export const WINDOW_MONTHS_FORWARD = 12;

/**
 * Colombia. Los calendarios impresos del país empiezan en domingo, y en una
 * parroquia el domingo es el día que la gente busca primero.
 * 0 = domingo, 1 = lunes.
 */
export const WEEK_STARTS_ON = 0;

export interface AgendaWindow {
  /** `YYYY-MM` del primer mes consultable. */
  firstMonth: string;
  /** `YYYY-MM` del último mes consultable. */
  lastMonth: string;
  /** Instante de inicio de la consulta a Google. */
  timeMin: Date;
  /** Instante de fin de la consulta a Google. */
  timeMax: Date;
}

/** Mediodía UTC del día indicado. */
export function anchor(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Parte una clave `YYYY-MM` en números. */
export function parseMonthKey(key: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function addMonths(key: string, delta: number): string {
  const parsed = parseMonthKey(key);
  if (!parsed) return key;
  const shifted = anchor(parsed.year, parsed.month + delta, 1);
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Primer instante del mes en Bogotá. */
export function monthStart(key: string): Date {
  return new Date(`${key}-01T00:00:00${UTC_OFFSET}`);
}

export function daysInMonth(year: number, month: number): number {
  return anchor(year, month + 1, 0).getUTCDate();
}

/**
 * La ventana que se le pide a Google. Una sola llamada alimenta la vista
 * mensual, la lista de próximos eventos y los eventos destacados de la portada.
 */
export function agendaWindow(now: Date = new Date()): AgendaWindow {
  const current = claveMes(now);
  const firstMonth = addMonths(current, -WINDOW_MONTHS_BACK);
  const lastMonth = addMonths(current, WINDOW_MONTHS_FORWARD);

  return {
    firstMonth,
    lastMonth,
    timeMin: monthStart(firstMonth),
    timeMax: monthStart(addMonths(lastMonth, 1)),
  };
}

/**
 * El mes que se debe mostrar, dado lo que venga en `?mes=`. Un valor ausente,
 * malformado o fuera de la ventana cae al mes actual sin protestar: es una
 * página pública, no un formulario.
 */
export function resolveMonth(requested: string | null, window: AgendaWindow, now: Date): string {
  const current = claveMes(now);
  if (!requested || !parseMonthKey(requested)) return current;
  if (requested < window.firstMonth || requested > window.lastMonth) return current;
  return requested;
}

/**
 * Todas las claves de día que cubre un evento. Un evento de tres días aparece
 * en las tres celdas del calendario, no solo en la primera.
 */
export function eventDayKeys(event: { start: Date; end: Date }): string[] {
  const first = claveDia(event.start);
  const last = claveDia(event.end);
  if (first === last) return [first];

  const keys: string[] = [];
  const [year, month, day] = first.split('-').map(Number) as [number, number, number];

  // Tope defensivo: un evento de más de un año en el calendario parroquial es
  // un error de captura, no un dato. Se muestra el primer tramo y ya.
  for (let offset = 0; offset < 400; offset += 1) {
    const key = claveDia(anchor(year, month, day + offset));
    keys.push(key);
    if (key >= last) break;
  }

  return keys;
}

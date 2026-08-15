/**
 * Construcción de la rejilla del mes. Lógica pura y sin dependencias de Astro:
 * entra una lista de eventos, sale una estructura lista para pintar.
 */

import { LOCALE } from '@/lib/format';
import type { CalendarDay, MonthGrid, ParishEvent } from '@/lib/types';
import { eventsByDay } from '@/lib/queries/agenda';
import { claveDia, formatMesAnio } from './format';
import { WEEK_STARTS_ON, addMonths, anchor, daysInMonth, parseMonthKey } from './window';

/**
 * Encabezados de la fila de días. Se guardan en dos formas porque la celda
 * muestra la abreviatura pero el lector de pantalla necesita el nombre
 * completo: el recorte nunca puede ser el único portador de información.
 */
export interface WeekdayHeading {
  abbrev: string;
  full: string;
}

export function weekdayHeadings(): WeekdayHeading[] {
  // 4 de enero de 2026 es domingo; sirve de semilla estable para nombrar los días.
  const sunday = anchor(2026, 1, 4);
  const abbrevFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', weekday: 'short' });
  const fullFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', weekday: 'long' });

  return Array.from({ length: 7 }, (_unused, index) => {
    const day = new Date(sunday.getTime());
    day.setUTCDate(day.getUTCDate() + ((WEEK_STARTS_ON + index) % 7));
    return {
      abbrev: abbrevFormatter.format(day).replace(/\.$/, ''),
      full: fullFormatter.format(day),
    };
  });
}

export interface BuildMonthGridOptions {
  monthKey: string;
  events: ParishEvent[];
  now: Date;
  /** Límites de navegación: fuera de la ventana no hay datos que mostrar. */
  firstMonth: string;
  lastMonth: string;
}

export function buildMonthGrid({
  monthKey,
  events,
  now,
  firstMonth,
  lastMonth,
}: BuildMonthGridOptions): MonthGrid | null {
  const parsed = parseMonthKey(monthKey);
  if (!parsed) return null;

  const { year, month } = parsed;
  const index = eventsByDay(events);
  const todayKey = claveDia(now);

  const total = daysInMonth(year, month);
  const firstWeekday = anchor(year, month, 1).getUTCDay();
  const leading = (firstWeekday - WEEK_STARTS_ON + 7) % 7;
  const cells = Math.ceil((leading + total) / 7) * 7;

  const days: CalendarDay[] = [];
  for (let cell = 0; cell < cells; cell += 1) {
    // `anchor` normaliza los desbordes: el día 0 es el último del mes anterior
    // y el día 32 es el primero del siguiente, sin cuentas a mano.
    const dayOfMonth = cell - leading + 1;
    const date = anchor(year, month, dayOfMonth);
    const key = claveDia(date);

    days.push({
      key,
      dayOfMonth: date.getUTCDate(),
      inMonth: dayOfMonth >= 1 && dayOfMonth <= total,
      isToday: key === todayKey,
      isPast: key < todayKey,
      events: index.get(key) ?? [],
    });
  }

  const weeks: CalendarDay[][] = [];
  for (let start = 0; start < days.length; start += 7) {
    weeks.push(days.slice(start, start + 7));
  }

  const previous = addMonths(monthKey, -1);
  const next = addMonths(monthKey, 1);

  return {
    key: monthKey,
    label: formatMesAnio(anchor(year, month, 1)),
    weeks,
    previousKey: previous >= firstMonth ? previous : null,
    nextKey: next <= lastMonth ? next : null,
  };
}

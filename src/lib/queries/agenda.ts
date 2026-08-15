/**
 * Consultas de la Agenda — Google Calendar en solo lectura.
 *
 * Ninguna lanza: la página de agenda tiene que renderizar aunque Google esté
 * caído, aunque falten las variables de entorno y aunque no haya un solo
 * evento cargado. El estado se comunica, no se esconde.
 *
 * Contrato 1 del equipo: la agenda viene de Google Calendar y **Supabase no
 * tendrá tabla de eventos**. Por eso este archivo no toca Supabase, a
 * diferencia de `celebraciones.ts`.
 */

import { withCache } from '@/lib/cache';
import { claveDia } from '@/lib/agenda/format';
import { agendaWindow, anchor, eventDayKeys } from '@/lib/agenda/window';
import { fetchEvents } from '@/lib/google-calendar/client';
import { readConfig } from '@/lib/google-calendar/config';
import { toParishEvents } from '@/lib/google-calendar/normalize';
import type { AgendaResult, EventDayGroup, ParishEvent } from '@/lib/types';

const EMPTY: AgendaResult = { status: 'not-configured', events: [], fetchedAt: null };

/**
 * Todos los eventos de la ventana consultable, en una sola llamada cacheada.
 *
 * La vista mensual, la lista de próximos eventos y los destacados de la portada
 * se derivan de aquí. Es deliberado: una llamada a Google cada diez minutos
 * alimenta el sitio entero.
 */
export async function getAgenda(now: Date = new Date()): Promise<AgendaResult> {
  const config = readConfig();
  if (!config) return EMPTY;

  const window = agendaWindow(now);
  const key = `agenda:${config.calendarId}:${window.firstMonth}:${window.lastMonth}`;

  try {
    const hit = await withCache(
      key,
      { ttlMs: config.ttlMs, staleMs: config.staleMs },
      async () => toParishEvents(await fetchEvents(config, window)),
    );

    return {
      status: hit.stale ? 'stale' : 'ok',
      events: hit.value,
      fetchedAt: hit.fetchedAt,
    };
  } catch (error) {
    console.error('[agenda] No se pudo leer Google Calendar:', error);
    return { status: 'unavailable', events: [], fetchedAt: null };
  }
}

/** Los eventos indexados por día, expandiendo los que duran varias jornadas. */
export function eventsByDay(events: ParishEvent[]): Map<string, ParishEvent[]> {
  const index = new Map<string, ParishEvent[]>();

  for (const event of events) {
    for (const key of eventDayKeys(event)) {
      const bucket = index.get(key);
      if (bucket) bucket.push(event);
      else index.set(key, [event]);
    }
  }

  return index;
}

/**
 * Los próximos eventos, en orden. Un evento sigue siendo "próximo" mientras no
 * haya terminado: el que empezó hace media hora se sigue mostrando, porque
 * quien entra al sitio a las 6:15 quiere saber que la misa de las 6 está en
 * curso, no que ya desapareció.
 */
export function upcomingEvents(
  events: ParishEvent[],
  now: Date = new Date(),
  limit = 12,
): ParishEvent[] {
  return events.filter((event) => event.end >= now).slice(0, limit);
}

/** Agrupa una lista ya ordenada por día, para la lista de próximos eventos. */
export function groupByDay(events: ParishEvent[]): EventDayGroup[] {
  const groups: EventDayGroup[] = [];

  for (const event of events) {
    const key = claveDia(event.start);
    const last = groups.at(-1);

    if (last?.key === key) {
      last.events.push(event);
      continue;
    }

    const [year, month, day] = key.split('-').map(Number) as [number, number, number];
    groups.push({ key, date: anchor(year, month, day), events: [event] });
  }

  return groups;
}

/**
 * Los destacados que consume la portada.
 * Contrato 2: la landing lee de aquí, no duplica datos.
 */
export async function getProximosEventos(limite = 3, now: Date = new Date()): Promise<AgendaResult> {
  const agenda = await getAgenda(now);
  return { ...agenda, events: upcomingEvents(agenda.events, now, limite) };
}

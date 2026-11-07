/**
 * Consultas de la Agenda — unifica los eventos creados en el Dashboard
 * (`events` en Supabase), Google Calendar (si está configurado) y el respaldo
 * local para que el calendario mensual y la lista de próximos eventos siempre
 * respondan y se puedan controlar desde el panel administrativo.
 */
import { celebraciones } from '@/data/celebraciones';
import { getPublicSupabaseClient } from '@/db/supabase';
import { claveDia } from '@/lib/agenda/format';
import { agendaWindow, anchor, eventDayKeys } from '@/lib/agenda/window';
import { withCache } from '@/lib/cache';
import { fetchEvents } from '@/lib/google-calendar/client';
import { readConfig } from '@/lib/google-calendar/config';
import { toParishEvents } from '@/lib/google-calendar/normalize';
import type { AgendaResult, Celebracion, EventDayGroup, ParishEvent } from '@/lib/types';

const CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_TTL_MS = 60 * 60 * 1000;

interface EventRow {
  id: string;
  slug?: string | null;
  titulo: string;
  resumen: string | null;
  contenido?: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  hora: string | null;
  lugar: string | null;
  flyer_url: string | null;
  publicado: boolean;
}

function rowToParishEvent(row: EventRow): ParishEvent {
  const allDay = !row.hora;
  const hora = row.hora ? String(row.hora).slice(0, 8) : '12:00:00';
  const start = new Date(
    `${row.fecha_inicio}T${hora.length === 5 ? `${hora}:00` : hora}-05:00`,
  );

  let end: Date;
  if (row.fecha_fin) {
    end = new Date(
      `${row.fecha_fin}T${hora.length === 5 ? `${hora}:00` : hora}-05:00`,
    );
    if (allDay) {
      end = new Date(`${row.fecha_fin}T23:59:59-05:00`);
    }
  } else if (allDay) {
    end = new Date(`${row.fecha_inicio}T23:59:59-05:00`);
  } else {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  const detalle = [row.resumen?.trim(), row.contenido?.trim()]
    .filter(Boolean)
    .join('\n\n');

  return {
    id: row.slug || row.id,
    title: row.titulo,
    description: detalle || null,
    start,
    end,
    allDay,
    location: row.lugar,
    flyerUrl: row.flyer_url,
    sourceUrl: `/agenda/${row.slug || row.id}`,
  };
}

function celebracionToParishEvent(c: Celebracion): ParishEvent {
  return rowToParishEvent({
    id: c.id,
    slug: c.slug,
    titulo: c.titulo,
    resumen: c.resumen,
    contenido: c.contenido,
    fecha_inicio: c.fecha_inicio,
    fecha_fin: c.fecha_fin,
    hora: c.hora,
    lugar: c.lugar,
    flyer_url: c.imagen_url ?? c.imagen?.src ?? null,
    publicado: c.publicado,
  });
}

async function fetchDashboardEvents(window: ReturnType<typeof agendaWindow>): Promise<{
  ok: boolean;
  events: ParishEvent[];
}> {
  const client = getPublicSupabaseClient();
  if (!client) return { ok: false, events: [] };

  try {
    const { data, error } = await client
      .from('events')
      .select('*')
      .eq('publicado', true)
      .lte('fecha_inicio', `${window.lastMonth}-31`)
      .gte('fecha_inicio', `${window.firstMonth}-01`)
      .order('fecha_inicio', { ascending: true });

    if (error || !data) return { ok: false, events: [] };
    return {
      ok: true,
      events: (data as EventRow[]).map(rowToParishEvent),
    };
  } catch {
    return { ok: false, events: [] };
  }
}

export async function getAgenda(now: Date = new Date()): Promise<AgendaResult> {
  const window = agendaWindow(now);
  const dashboard = await fetchDashboardEvents(window);

  // Si también hay configuración de Google Calendar, combinamos ambas fuentes.
  const config = readConfig();
  let googleEvents: ParishEvent[] = [];
  let googleOk = false;

  if (config) {
    const cacheKey = `${config.calendarId}:${window.firstMonth}:${window.lastMonth}`;
    try {
      const hit = await withCache(
        cacheKey,
        { ttlMs: config.ttlMs || CACHE_TTL_MS, staleMs: config.staleMs || STALE_TTL_MS },
        async () => {
          const items = await fetchEvents(config, {
            timeMin: window.timeMin,
            timeMax: window.timeMax,
          });
          return toParishEvents(items);
        },
      );
      googleEvents = hit.value;
      googleOk = !hit.stale;
    } catch {
      googleEvents = [];
    }
  }

  if (dashboard.ok && dashboard.events.length > 0) {
    const combined = [...dashboard.events, ...googleEvents].sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    return { status: 'ok', events: combined, fetchedAt: now };
  }

  if (googleOk && googleEvents.length > 0) {
    return { status: 'ok', events: googleEvents, fetchedAt: now };
  }

  // Fallback local con las celebraciones publicadas del repositorio para que el
  // calendario nunca quede roto mientras se configura la base.
  const fallbackEvents = celebraciones
    .filter((c) => c.publicado)
    .map(celebracionToParishEvent)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return {
    status: 'ok',
    events: fallbackEvents,
    fetchedAt: now,
  };
}

export function eventsByDay(events: ParishEvent[]): Map<string, ParishEvent[]> {
  const index = new Map<string, ParishEvent[]>();

  for (const event of events) {
    for (const key of eventDayKeys(event)) {
      const list = index.get(key);
      if (list) list.push(event);
      else index.set(key, [event]);
    }
  }

  return index;
}

export function upcomingEvents(
  events: ParishEvent[],
  now: Date = new Date(),
  limit = 12,
): ParishEvent[] {
  return events.filter((event) => event.end >= now).slice(0, limit);
}

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

export async function getProximosEventos(
  limite = 3,
  now: Date = new Date(),
): Promise<AgendaResult> {
  const agenda = await getAgenda(now);
  return { ...agenda, events: upcomingEvents(agenda.events, now, limite) };
}

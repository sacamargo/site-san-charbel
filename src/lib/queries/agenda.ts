/**
 * Consultas de la Agenda — tabla `events` en Supabase.
 *
 * Misma forma `ParishEvent` que consumen el calendario mensual y las listas.
 * Sin Google Calendar.
 */

import { claveDia } from '@/lib/agenda/format';
import { agendaWindow, anchor, eventDayKeys } from '@/lib/agenda/window';
import { supabase } from '@/db/supabase';
import type { AgendaResult, EventDayGroup, ParishEvent } from '@/lib/types';

const EMPTY: AgendaResult = { status: 'not-configured', events: [], fetchedAt: null };

type EventRow = {
	id: string;
	titulo: string;
	resumen: string | null;
	fecha_inicio: string;
	fecha_fin: string | null;
	hora: string | null;
	lugar: string | null;
	flyer_url: string | null;
	publicado: boolean;
};

/** Interpreta fecha/hora de la parroquia en zona America/Bogota (−05). */
function rowToParishEvent(row: EventRow): ParishEvent {
	const allDay = !row.hora;
	const hora = row.hora ? String(row.hora).slice(0, 8) : '12:00:00';
	const start = new Date(`${row.fecha_inicio}T${hora.length === 5 ? `${hora}:00` : hora}-05:00`);

	let end: Date;
	if (row.fecha_fin) {
		end = new Date(`${row.fecha_fin}T${hora.length === 5 ? `${hora}:00` : hora}-05:00`);
		if (allDay) {
			// Inclusive: fin del día en Bogotá
			end = new Date(`${row.fecha_fin}T23:59:59-05:00`);
		}
	} else if (allDay) {
		end = new Date(`${row.fecha_inicio}T23:59:59-05:00`);
	} else {
		end = new Date(start.getTime() + 60 * 60 * 1000);
	}

	return {
		id: row.id,
		title: row.titulo,
		description: row.resumen?.trim() || null,
		start,
		end,
		allDay,
		location: row.lugar,
		flyerUrl: row.flyer_url,
		sourceUrl: null,
	};
}

export async function getAgenda(now: Date = new Date()): Promise<AgendaResult> {
	const window = agendaWindow(now);

	try {
		const { data, error } = await supabase
			.from('events')
			.select('id,titulo,resumen,fecha_inicio,fecha_fin,hora,lugar,flyer_url,publicado')
			.eq('publicado', true)
			.lte('fecha_inicio', `${window.lastMonth}-31`)
			.gte('fecha_inicio', `${window.firstMonth}-01`)
			.order('fecha_inicio', { ascending: true });

		if (error) {
			console.error('[agenda] Supabase:', error.message);
			// Tabla inexistente u otro fallo de esquema
			if (error.code === '42P01' || /Could not find|schema cache/i.test(error.message)) {
				return EMPTY;
			}
			return { status: 'unavailable', events: [], fetchedAt: null };
		}

		const events = (data as EventRow[] | null)?.map(rowToParishEvent) ?? [];
		events.sort((a, b) => a.start.getTime() - b.start.getTime());

		return {
			status: 'ok',
			events,
			fetchedAt: now,
		};
	} catch (error) {
		console.error('[agenda] No se pudo leer events:', error);
		return { status: 'unavailable', events: [], fetchedAt: null };
	}
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

export async function getProximosEventos(limite = 3, now: Date = new Date()): Promise<AgendaResult> {
	const agenda = await getAgenda(now);
	return { ...agenda, events: upcomingEvents(agenda.events, now, limite) };
}

/**
 * Consultas de eventos / celebraciones.
 * Preferencia: tabla `events` en Supabase. Fallback: data local.
 */
import { celebraciones } from '@/data/celebraciones';
import type { Celebracion } from '@/lib/types';
import { supabase } from '@/db/supabase';

function mapEventRow(row: {
	id: string;
	titulo: string;
	resumen: string | null;
	fecha_inicio: string;
	fecha_fin: string | null;
	hora: string | null;
	lugar: string | null;
	flyer_url: string | null;
	publicado: boolean;
	orden: number;
}): Celebracion {
	const hora = row.hora ? String(row.hora).slice(0, 5) : null;
	return {
		id: row.id,
		slug: row.id,
		titulo: row.titulo,
		resumen: row.resumen ?? '',
		contenido: '',
		imagen_url: row.flyer_url,
		fecha_inicio: row.fecha_inicio,
		fecha_fin: row.fecha_fin,
		hora,
		lugar: row.lugar,
		dirigido_a: null,
		categoria: null,
		cita: null,
		cita_referencia: null,
		publicado: row.publicado,
		orden: row.orden,
	};
}

async function fromSupabase(): Promise<Celebracion[] | null> {
	try {
		const today = new Date().toISOString().slice(0, 10);
		const { data, error } = await supabase
			.from('events')
			.select('*')
			.eq('publicado', true)
			.gte('fecha_inicio', today)
			.order('fecha_inicio', { ascending: true });

		if (error) return null;
		return (data ?? []).map(mapEventRow);
	} catch {
		return null;
	}
}

function fromLocal(): Celebracion[] {
	return celebraciones
		.filter((c) => c.publicado)
		.sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));
}

export async function getCelebraciones(): Promise<Celebracion[]> {
	const remote = await fromSupabase();
	if (remote && remote.length > 0) return remote;
	if (remote && remote.length === 0) return [];
	return fromLocal();
}

export async function getProximasCelebraciones(limite = 3): Promise<Celebracion[]> {
	const todas = await getCelebraciones();
	return todas.slice(0, limite);
}

export async function contarCelebraciones(): Promise<number> {
	const todas = await getCelebraciones();
	return todas.length;
}

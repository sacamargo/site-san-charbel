/**
 * Consultas de horarios — Supabase `mass_schedules` con fallback local.
 */
import { horarios } from '@/data/horarios';
import type { Horario } from '@/lib/types';
import { supabase } from '@/db/supabase';

async function fromSupabase(): Promise<Horario[] | null> {
	try {
		const { data, error } = await supabase
			.from('mass_schedules')
			.select('*')
			.eq('activo', true)
			.order('orden', { ascending: true });

		if (error) return null;
		return (data ?? []).map((row) => ({
			id: row.id,
			tipo: row.tipo,
			dia: row.dia,
			dias: row.dias ?? [],
			horas: row.horas ?? [],
			nota: row.nota,
			orden: row.orden,
			activo: row.activo,
		}));
	} catch {
		return null;
	}
}

export async function getHorarios(): Promise<Horario[]> {
	const remote = await fromSupabase();
	if (remote !== null) return remote;
	return horarios.filter((h) => h.activo).sort((a, b) => a.orden - b.orden);
}

export async function getHorariosPorTipo(tipo: Horario['tipo']): Promise<Horario[]> {
	const todos = await getHorarios();
	return todos.filter((h) => h.tipo === tipo);
}

export async function getMisas(): Promise<Horario[]> {
	return getHorariosPorTipo('misa');
}

export async function getDespacho(): Promise<Horario | undefined> {
	const [despacho] = await getHorariosPorTipo('despacho');
	return despacho;
}

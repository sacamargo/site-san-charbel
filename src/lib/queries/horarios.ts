/**
 * Consultas de horarios — tabla `mass_schedules` de Supabase con fallback a
 * `src/data/horarios.ts`.
 */
import { horarios } from '@/data/horarios';
import { getPublicSupabaseClient } from '@/db/supabase';
import type { Horario } from '@/lib/types';

async function fromSupabase(): Promise<Horario[] | null> {
  const client = getPublicSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('mass_schedules')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error || !data) return null;
    if (data.length === 0) return null;

    return data.map((row) => ({
      id: String(row.id),
      tipo: row.tipo as Horario['tipo'],
      dia: String(row.dia),
      dias: Array.isArray(row.dias) ? row.dias : [],
      horas: Array.isArray(row.horas) ? row.horas : [],
      nota: row.nota ?? null,
      orden: Number(row.orden ?? 0),
      activo: Boolean(row.activo),
    }));
  } catch {
    return null;
  }
}

export async function getHorarios(): Promise<Horario[]> {
  const remote = await fromSupabase();
  if (remote && remote.length > 0) return remote;
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

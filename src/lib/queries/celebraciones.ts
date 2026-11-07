/**
 * Consultas de eventos y celebraciones.
 * Lee primero la tabla `events` de Supabase (controlada desde `/admin/eventos`)
 * y cae al arreglo local cuando aún no hay eventos en la base de datos.
 */
import { celebraciones } from '@/data/celebraciones';
import { getPublicSupabaseClient } from '@/db/supabase';
import type { Celebracion } from '@/lib/types';

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
  dirigido_a?: string | null;
  categoria?: string | null;
  cita?: string | null;
  cita_referencia?: string | null;
  flyer_url: string | null;
  publicado: boolean;
  orden: number;
}

function mapEventRow(row: EventRow): Celebracion {
  const hora = row.hora ? String(row.hora).slice(0, 5) : null;
  return {
    id: row.id,
    slug: row.slug || row.id,
    titulo: row.titulo,
    resumen: row.resumen ?? '',
    contenido: row.contenido ?? '',
    imagen_url: row.flyer_url,
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin,
    hora,
    lugar: row.lugar,
    dirigido_a: row.dirigido_a ?? null,
    categoria: row.categoria ?? null,
    cita: row.cita ?? null,
    cita_referencia: row.cita_referencia ?? null,
    publicado: row.publicado,
    orden: row.orden ?? 0,
  };
}

async function fromSupabase(): Promise<Celebracion[] | null> {
  const client = getPublicSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('events')
      .select('*')
      .eq('publicado', true)
      .order('fecha_inicio', { ascending: true });

    if (error || !data) return null;
    if (data.length === 0) return null;
    return (data as EventRow[]).map(mapEventRow);
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
  return fromLocal();
}

export async function getProximasCelebraciones(limite = 5): Promise<Celebracion[]> {
  const todas = await getCelebraciones();
  return todas.slice(0, limite);
}

export async function contarCelebraciones(): Promise<number> {
  const todas = await getCelebraciones();
  return todas.length;
}

export async function getCelebracionPorSlug(slug: string): Promise<Celebracion | undefined> {
  const todas = await getCelebraciones();
  const encontrada = todas.find((c) => c.slug === slug || c.id === slug);
  if (encontrada) return encontrada;
  return fromLocal().find((c) => c.slug === slug || c.id === slug);
}

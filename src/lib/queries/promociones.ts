/**
 * Consultas del espacio promocional de actividades de la iglesia
 * (`parish_promotions` en Supabase con fallback local).
 */
import { promocionesIniciales, type PromocionParroquial } from '@/data/promociones';
import { getPublicSupabaseClient } from '@/db/supabase';

export async function getPromociones(): Promise<PromocionParroquial[]> {
  const client = getPublicSupabaseClient();
  if (!client) return promocionesIniciales.filter((p) => p.activo);

  try {
    const { data, error } = await client
      .from('parish_promotions')
      .select('*')
      .eq('activo', true)
      .order('destacado', { ascending: false })
      .order('orden', { ascending: true });

    if (error || !data || data.length === 0) {
      return promocionesIniciales.filter((p) => p.activo);
    }

    return data.map((row) => ({
      id: String(row.id),
      titulo: String(row.titulo),
      subtitulo: row.subtitulo ?? null,
      descripcion: String(row.descripcion ?? ''),
      etiqueta: String(row.etiqueta || 'Actividad parroquial'),
      fecha_texto: row.fecha_texto ?? null,
      lugar: row.lugar ?? null,
      imagen_url: row.imagen_url ?? null,
      cta_texto: String(row.cta_texto || 'Conocer más'),
      cta_url: String(row.cta_url || '/agenda'),
      destacado: Boolean(row.destacado),
      activo: Boolean(row.activo),
      orden: Number(row.orden ?? 0),
    }));
  } catch {
    return promocionesIniciales.filter((p) => p.activo);
  }
}

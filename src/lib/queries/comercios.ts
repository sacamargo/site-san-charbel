/**
 * Consultas del directorio de negocios y emprendimientos de feligreses
 * (`community_businesses` en Supabase).
 */
import { comerciosIniciales, type ComercioParroquial } from '@/data/comercios';
import { getPublicSupabaseClient } from '@/db/supabase';

export async function getComercios(limite?: number): Promise<ComercioParroquial[]> {
  const client = getPublicSupabaseClient();
  if (!client) {
    const list = comerciosIniciales.filter((c) => c.activo);
    return typeof limite === 'number' ? list.slice(0, limite) : list;
  }

  try {
    let query = client
      .from('community_businesses')
      .select('*')
      .eq('activo', true)
      .order('destacado', { ascending: false })
      .order('orden', { ascending: true });

    if (typeof limite === 'number') {
      query = query.limit(limite);
    }

    const { data, error } = await query;

    if (error || !data) {
      const list = comerciosIniciales.filter((c) => c.activo);
      return typeof limite === 'number' ? list.slice(0, limite) : list;
    }

    return data.map((row) => ({
      id: String(row.id),
      nombre: String(row.nombre),
      categoria: String(row.categoria || 'Servicios'),
      descripcion: String(row.descripcion ?? ''),
      propietario: row.propietario ?? null,
      telefono: row.telefono ?? null,
      whatsapp: row.whatsapp ?? null,
      direccion: row.direccion ?? null,
      horario: row.horario ?? null,
      sitio_web: row.sitio_web ?? null,
      instagram: row.instagram ?? null,
      imagen_url: row.imagen_url ?? null,
      destacado: Boolean(row.destacado),
      activo: Boolean(row.activo),
      orden: Number(row.orden ?? 0),
    }));
  } catch {
    const list = comerciosIniciales.filter((c) => c.activo);
    return typeof limite === 'number' ? list.slice(0, limite) : list;
  }
}

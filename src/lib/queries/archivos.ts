/**
 * Consultas del repositorio de archivos descargables (`parish_files` en Supabase).
 */
import { archivosIniciales, type ArchivoParroquial } from '@/data/archivos';
import { getPublicSupabaseClient } from '@/db/supabase';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return 'Documento';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export async function getArchivosPublicados(limite?: number): Promise<ArchivoParroquial[]> {
  const client = getPublicSupabaseClient();
  if (!client) {
    const list = archivosIniciales.filter((a) => a.publicado);
    return typeof limite === 'number' ? list.slice(0, limite) : list;
  }

  try {
    let query = client
      .from('parish_files')
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });

    if (typeof limite === 'number') {
      query = query.limit(limite);
    }

    const { data, error } = await query;

    if (error || !data) {
      const list = archivosIniciales.filter((a) => a.publicado);
      return typeof limite === 'number' ? list.slice(0, limite) : list;
    }

    return data.map((row) => ({
      id: String(row.id),
      titulo: String(row.titulo),
      descripcion: String(row.descripcion ?? ''),
      categoria: String(row.categoria || 'Documentos'),
      archivo_url: String(row.archivo_url),
      archivo_path: row.archivo_path ?? null,
      nombre_archivo: String(row.nombre_archivo || 'documento'),
      mime_type: String(row.mime_type || 'application/pdf'),
      tamano_bytes: Number(row.tamano_bytes ?? 0),
      publicado: Boolean(row.publicado),
      orden: Number(row.orden ?? 0),
      created_at: row.created_at,
    }));
  } catch {
    const list = archivosIniciales.filter((a) => a.publicado);
    return typeof limite === 'number' ? list.slice(0, limite) : list;
  }
}

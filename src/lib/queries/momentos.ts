/**
 * Consultas de Momentos de la parroquia — combina las fotos subidas desde el
 * Dashboard (`gallery_moments` en Supabase) con las fotos locales de
 * `src/data/momentos.ts`.
 */
import { momentos, type Momento } from '@/data/momentos';
import { getPublicSupabaseClient } from '@/db/supabase';

export interface MomentoItem {
  id: string;
  imagen?: ImageMetadata;
  imagen_url?: string;
  alt: string;
  album?: string | null;
}

export async function getMomentos(): Promise<MomentoItem[]> {
  const locales: MomentoItem[] = momentos.map((m: Momento, idx: number) => ({
    id: `local-${idx}`,
    imagen: m.imagen,
    alt: m.alt,
    album: 'Vida parroquial',
  }));

  const client = getPublicSupabaseClient();
  if (!client) return locales;

  try {
    const { data, error } = await client
      .from('gallery_moments')
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true });

    if (error || !data || data.length === 0) return locales;

    const remotos: MomentoItem[] = data.map((row) => ({
      id: String(row.id),
      imagen_url: String(row.imagen_url),
      alt: String(row.alt || 'Momento de la parroquia'),
      album: row.album ?? 'Comunidad',
    }));

    return [...remotos, ...locales];
  } catch {
    return locales;
  }
}

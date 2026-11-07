/**
 * Consultas de slides para el banner principal (`hero_slides` en Supabase).
 */
import { getPublicSupabaseClient } from '@/db/supabase';

export interface HeroSlide {
  id: string;
  imagen_url: string;
  eyebrow: string | null;
  titulo: string | null;
  subtitulo: string | null;
  cta_texto: string | null;
  enlace: string | null;
  orden: number;
  activo: boolean;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const client = getPublicSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('hero_slides')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error || !data) return [];

    return data.map((row) => ({
      id: String(row.id),
      imagen_url: String(row.imagen_url),
      eyebrow: row.eyebrow ?? null,
      titulo: row.titulo ?? null,
      subtitulo: row.subtitulo ?? null,
      cta_texto: row.cta_texto ?? null,
      enlace: row.enlace ?? null,
      orden: Number(row.orden ?? 0),
      activo: Boolean(row.activo),
    }));
  } catch {
    return [];
  }
}

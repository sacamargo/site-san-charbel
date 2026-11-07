/**
 * Consultas de servicios y sacramentos — lee `parish_services` en Supabase y
 * enriquece o cae a `src/data/servicios.ts`.
 */
import { servicios, type Servicio } from '@/data/servicios';
import { getPublicSupabaseClient } from '@/db/supabase';
import { icons, type IconName } from '@/components/ui/icons';

function normalizeIcon(name: unknown): IconName {
  const key = String(name ?? 'cross');
  return key in icons ? (key as IconName) : 'cross';
}

export async function getServicios(): Promise<Servicio[]> {
  const client = getPublicSupabaseClient();
  if (!client) return servicios;

  try {
    const { data, error } = await client
      .from('parish_services')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error || !data || data.length === 0) return servicios;

    return data.map((row) => {
      const base = servicios.find((s) => s.slug === row.slug);
      const orientacionRemota = Array.isArray(row.orientacion)
        ? row.orientacion.filter(Boolean)
        : [];

      return {
        slug: String(row.slug),
        nombre: String(row.nombre),
        descripcion: String(row.descripcion_corta || base?.descripcion || ''),
        href: `/servicios/${row.slug}`,
        icono: normalizeIcon(row.icono ?? base?.icono),
        categoria:
          (row.categoria as Servicio['categoria']) || base?.categoria || 'iniciacion',
        introduccion:
          String(row.introduccion || row.descripcion_modal || '').trim() ||
          base?.introduccion ||
          String(row.descripcion_corta || ''),
        orientacion:
          orientacionRemota.length > 0
            ? orientacionRemota
            : base?.orientacion ?? [
                'Envía tu solicitud mediante el formulario de esta página o comunícate con el despacho parroquial.',
              ],
        atencion:
          String(row.atencion || '').trim() ||
          base?.atencion ||
          'Atención y orientación en el despacho parroquial.',
      };
    });
  } catch {
    return servicios;
  }
}

export async function getServicioPorSlug(slug: string): Promise<Servicio | undefined> {
  const lista = await getServicios();
  return lista.find((s) => s.slug === slug) ?? servicios.find((s) => s.slug === slug);
}

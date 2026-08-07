/**
 * Consultas de celebraciones — Sistema de diseño §8.1, §9.3
 *
 * Asíncronas desde el primer día: hoy leen un arreglo local, mañana leen
 * Supabase y solo cambia este archivo.
 */
import { celebraciones } from '@/data/celebraciones';
import type { Celebracion } from '@/lib/types';

/** Publicadas y ordenadas por fecha. §9.3: `publicado = true` es filtro público. */
export async function getCelebraciones(): Promise<Celebracion[]> {
  return celebraciones
    .filter((c) => c.publicado)
    .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));
}

/**
 * Las próximas `limite` celebraciones para la portada (§7.1, bloque 4b).
 *
 * No filtra por "futuras" a propósito: eso se evaluaría en el build y una
 * celebración desaparecería sola el día después, sin que nadie toque nada.
 * Cuando esté Supabase, el filtro por fecha va en la consulta, que se evalúa
 * en cada petición. Mientras tanto, la lista se cura a mano.
 */
export async function getProximasCelebraciones(limite = 3): Promise<Celebracion[]> {
  const todas = await getCelebraciones();
  return todas.slice(0, limite);
}

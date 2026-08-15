/**
 * Consultas de horarios — Sistema de diseño §8.1, §9.3
 *
 * Una función por consulta, tipada y ASÍNCRONA. Lo de async es el punto
 * completo del diseño: hoy leen un arreglo local, mañana leen Supabase, y el
 * único archivo que cambia es este. Páginas, componentes y tipos no se tocan.
 *
 * Los filtros de §9.3 (activo/publicado, orden) se aplican ya, para que el
 * comportamiento local coincida con lo que devolverá Supabase con RLS.
 */
import { horarios } from '@/data/horarios';
import type { Horario } from '@/lib/types';

/** Todos los horarios activos, en orden. */
export async function getHorarios(): Promise<Horario[]> {
  return horarios.filter((h) => h.activo).sort((a, b) => a.orden - b.orden);
}

/** Los horarios de un tipo concreto. */
export async function getHorariosPorTipo(tipo: Horario['tipo']): Promise<Horario[]> {
  const todos = await getHorarios();
  return todos.filter((h) => h.tipo === tipo);
}

/** Solo las misas, que es lo que necesita el cálculo de "próxima misa". */
export async function getMisas(): Promise<Horario[]> {
  return getHorariosPorTipo('misa');
}

/** La franja del despacho parroquial, para la InfoBar y el pie. */
export async function getDespacho(): Promise<Horario | undefined> {
  const [despacho] = await getHorariosPorTipo('despacho');
  return despacho;
}

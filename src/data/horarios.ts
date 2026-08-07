/**
 * Horarios — sustituto temporal de la tabla `horarios` de Supabase (§9.2).
 *
 * ⚠️ PROVISIONAL en dos sentidos:
 *   1. Estos datos salen de los mockups, no de la parroquia. Hay que
 *      confirmarlos antes de publicar (§12.2).
 *   2. El archivo entero desaparece cuando se conecte Supabase. Los
 *      componentes no lo importan nunca: pasan por lib/queries/horarios.ts.
 *
 * §12.2.3 — si el rito resulta ser maronita, cambia el vocabulario litúrgico
 * ("Misa" → "Divina Liturgia") aquí y en todo el sitio.
 */
import type { Horario } from '@/lib/types';

export const horarios: Horario[] = [
  {
    id: 'misa-semana',
    tipo: 'misa',
    dia: 'Lunes a viernes',
    dias: [1, 2, 3, 4, 5],
    horas: ['06:00', '18:00'],
    nota: null,
    orden: 1,
    activo: true,
  },
  {
    id: 'misa-sabado',
    tipo: 'misa',
    dia: 'Sábados',
    dias: [6],
    horas: ['06:00', '18:00'],
    nota: null,
    orden: 2,
    activo: true,
  },
  {
    id: 'misa-domingo',
    tipo: 'misa',
    dia: 'Domingos',
    dias: [0],
    horas: ['07:00', '09:00', '11:00', '18:00'],
    nota: null,
    orden: 3,
    activo: true,
  },
  {
    id: 'confesiones',
    tipo: 'confesion',
    dia: 'Martes a sábado',
    dias: [2, 3, 4, 5, 6],
    horas: ['17:00'],
    nota: 'Media hora antes de cada misa',
    orden: 4,
    activo: true,
  },
  {
    id: 'despacho',
    tipo: 'despacho',
    dia: 'Lunes a viernes',
    dias: [1, 2, 3, 4, 5],
    horas: ['08:00'],
    nota: '8:00 a.m. - 12:00 m.',
    orden: 5,
    activo: true,
  },
];

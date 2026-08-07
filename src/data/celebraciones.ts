/**
 * Celebraciones — sustituto temporal de la tabla `celebraciones` (§9.2).
 *
 * ⚠️ CONTENIDO PROVISIONAL. Estas tres celebraciones son de ejemplo, no las de
 * la parroquia. Dos preguntas de §12.2 bloquean las reales:
 *   1. Qué día del mes es la misa a San Chárbel — estructura toda la agenda.
 *   2. Qué día es la fiesta patronal (24 de julio o tercer domingo de julio).
 *
 * Los componentes no importan este archivo: pasan por lib/queries/celebraciones.
 */
import type { Celebracion } from '@/lib/types';

export const celebraciones: Celebracion[] = [
  {
    id: 'misa-san-charbel',
    slug: 'misa-mensual-san-charbel',
    titulo: 'Misa mensual a San Chárbel',
    resumen: 'Eucaristía y bendición con el óleo de San Chárbel.',
    contenido: '',
    imagen_url: null,
    fecha_inicio: '2026-08-22',
    fecha_fin: null,
    hora: '18:00',
    lugar: 'Templo parroquial',
    dirigido_a: 'Toda la comunidad',
    categoria: 'Devoción',
    cita: null,
    cita_referencia: null,
    publicado: true,
    orden: 1,
  },
  {
    id: 'adoracion',
    slug: 'adoracion-eucaristica',
    titulo: 'Adoración eucarística',
    resumen: 'Una hora de oración ante el Santísimo.',
    contenido: '',
    imagen_url: null,
    fecha_inicio: '2026-08-28',
    fecha_fin: null,
    hora: '19:00',
    lugar: 'Templo parroquial',
    dirigido_a: 'Toda la comunidad',
    categoria: 'Oración',
    cita: null,
    cita_referencia: null,
    publicado: true,
    orden: 2,
  },
  {
    id: 'encuentro-familias',
    slug: 'encuentro-de-familias',
    titulo: 'Encuentro de familias',
    resumen: 'Una tarde para compartir en familia.',
    contenido: '',
    imagen_url: null,
    fecha_inicio: '2026-09-05',
    fecha_fin: null,
    hora: '16:00',
    lugar: 'Salón parroquial',
    dirigido_a: 'Familias',
    categoria: 'Comunidad',
    cita: null,
    cita_referencia: null,
    publicado: true,
    orden: 3,
  },
];

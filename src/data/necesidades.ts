/**
 * "¿Qué necesitas?" — §7.1, bloque 6.
 *
 * Contenido institucional del repo (§9.1), no de Supabase: cambia cuando cambia
 * la oferta sacramental de la parroquia, es decir, casi nunca.
 *
 * Los títulos van en PRIMERA PERSONA a propósito (§6.6): la gente llega
 * pensando "quiero bautizar a mi hijo", no "bautismo". Al reformularlo en
 * vocabulario litúrgico se pierde justo a quien el bloque quiere ayudar.
 */
import type { IconName } from '@/components/ui/icons';

export interface Necesidad {
  titulo: string;
  descripcion: string;
  href: string;
  icono: IconName;
}

export const necesidades: Necesidad[] = [
  {
    titulo: 'Bautizar a mi hijo',
    descripcion: 'Requisitos, padrinos y fechas',
    href: '/sacramentos/bautismo',
    icono: 'book-open',
  },
  {
    titulo: 'Casarme por la Iglesia',
    descripcion: 'Documentos y preparación',
    href: '/sacramentos/matrimonio',
    icono: 'heart',
  },
  {
    titulo: 'Confesarme',
    descripcion: 'Horarios de atención',
    href: '/sacramentos/confesion',
    icono: 'church',
  },
  {
    titulo: 'Inscribir a mi hijo en catequesis',
    descripcion: 'Primera Comunión y Confirmación',
    href: '/sacramentos/primera-comunion',
    icono: 'users',
  },
];

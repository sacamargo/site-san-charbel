/**
 * Servicios de la parroquia — §"Servicios" del mockup.
 *
 * Contenido institucional del repo: cambia cuando cambia la oferta sacramental
 * de la parroquia, es decir, casi nunca.
 */
import type { IconName } from '@/components/ui/icons';

export interface Servicio {
  nombre: string;
  descripcion: string;
  href: string;
  icono: IconName;
}

export const servicios: Servicio[] = [
  {
    nombre: 'Bautismo',
    descripcion: 'Inicia el camino de la fe de tu hijo.',
    href: '/servicios/bautismo',
    icono: 'droplet',
  },
  {
    nombre: 'Matrimonio',
    descripcion: 'Dios bendice y acompaña su unión.',
    href: '/servicios/matrimonio',
    icono: 'rings',
  },
  {
    nombre: 'Primera Comunión',
    descripcion: 'Fortalece la fe de tu hijo en la Eucaristía.',
    href: '/servicios/primera-comunion',
    icono: 'chalice',
  },
  {
    nombre: 'Confirmación',
    descripcion: 'Fortalece tu fe con la acción del Espíritu Santo.',
    href: '/servicios/confirmacion',
    icono: 'flame',
  },
  {
    nombre: 'Confesión',
    descripcion: 'Encuentro con la misericordia de Dios.',
    href: '/servicios/confesion',
    icono: 'cross',
  },
  {
    nombre: 'Unción de los enfermos',
    descripcion: 'Consuelo y fortaleza en la enfermedad.',
    href: '/servicios/uncion-de-los-enfermos',
    icono: 'hands',
  },
];

import type { IconName } from '@/components/ui/icons';

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: IconName;
  exact?: boolean;
  group: 'principal' | 'contenido' | 'comunidad' | 'configuracion';
}

/**
 * Módulos completos del Dashboard de gestión de la Parroquia San Chárbel.
 */
export const adminNav: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'Resumen',
    description: 'Estado general del sitio, accesos rápidos y actividad reciente.',
    icon: 'home',
    exact: true,
    group: 'principal',
  },
  {
    href: '/admin/solicitudes',
    label: 'Formularios y peticiones',
    description: 'Bandeja de peticiones recibidas desde la web y reenvío a Gmail.',
    icon: 'mail',
    group: 'principal',
  },
  {
    href: '/admin/eventos',
    label: 'Calendario y eventos',
    description: 'Controla el calendario frontal, próximos eventos y sus flyers.',
    icon: 'calendar-days',
    group: 'contenido',
  },
  {
    href: '/admin/banner',
    label: 'Banner inicial',
    description: 'Imágenes, títulos y enlaces del banner principal de la portada.',
    icon: 'image',
    group: 'contenido',
  },
  {
    href: '/admin/promociones',
    label: 'Espacio promocional',
    description: 'Promociona actividades, retiros, grupos y campañas de la iglesia.',
    icon: 'flame',
    group: 'contenido',
  },
  {
    href: '/admin/servicios',
    label: 'Servicios y sacramentos',
    description: 'Gestiona los sacramentos, requisitos, pasos y formulario global.',
    icon: 'chalice',
    group: 'contenido',
  },
  {
    href: '/admin/horarios',
    label: 'Horarios de misas',
    description: 'Horarios de eucaristías, confesiones, adoración y despacho.',
    icon: 'clock',
    group: 'contenido',
  },
  {
    href: '/admin/momentos',
    label: 'Momentos y galería',
    description: 'Fotografías del carrusel comunitario y galería parroquial.',
    icon: 'heart',
    group: 'contenido',
  },
  {
    href: '/admin/comercios',
    label: 'Negocios de feligreses',
    description: 'Directorio para impulsar los emprendimientos de la comunidad.',
    icon: 'users',
    group: 'comunidad',
  },
  {
    href: '/admin/archivos',
    label: 'Repositorio de archivos',
    description: 'Sube boletines, hojas dominicales, guías y PDFs descargables.',
    icon: 'book-open',
    group: 'comunidad',
  },
  {
    href: '/admin/contacto',
    label: 'Contacto y ajustes',
    description: 'Dirección, teléfonos, redes, textos de portada y correo Gmail.',
    icon: 'map-pin',
    group: 'configuracion',
  },
];

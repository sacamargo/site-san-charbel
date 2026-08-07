/**
 * Navegación principal — Sistema de diseño §0.2, §6.1
 *
 * SEIS ítems. El menú de 8 de los mockups quedó descartado en §0.2, junto con
 * su vocabulario: "Ministerios" → Pastorales, "Eventos" → Agenda,
 * "Nosotros" → La Parroquia.
 *
 * "Horarios" sale del menú pero conserva su URL /horarios, porque va fijo en la
 * portada y en el pie (§0.2.3).
 *
 * §6.1 — el ítem padre SIEMPRE es un enlace navegable, nunca solo un disparador
 * de desplegable.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navegacion: NavItem[] = [
  { label: 'Inicio', href: '/' },
  {
    label: 'La Parroquia',
    href: '/parroquia',
    children: [
      { label: 'Historia', href: '/parroquia/historia' },
      { label: 'Nuestro párroco', href: '/parroquia/parroco' },
      { label: 'Horarios', href: '/horarios' },
    ],
  },
  {
    label: 'San Chárbel',
    href: '/san-charbel',
    children: [
      { label: 'Su vida', href: '/san-charbel/vida' },
      { label: 'Oraciones', href: '/san-charbel/oraciones' },
      { label: 'Peticiones', href: '/san-charbel/peticiones' },
    ],
  },
  {
    label: 'Sacramentos',
    href: '/sacramentos',
    children: [
      { label: 'Bautismo', href: '/sacramentos/bautismo' },
      { label: 'Primera Comunión', href: '/sacramentos/primera-comunion' },
      { label: 'Confirmación', href: '/sacramentos/confirmacion' },
      { label: 'Matrimonio', href: '/sacramentos/matrimonio' },
      { label: 'Confesión', href: '/sacramentos/confesion' },
    ],
  },
  {
    label: 'Comunidad',
    href: '/comunidad',
    children: [
      { label: 'Pastorales', href: '/pastorales' },
      { label: 'Agenda', href: '/agenda' },
      { label: 'Noticias', href: '/noticias' },
      { label: 'Galería', href: '/galeria' },
    ],
  },
  { label: 'Contacto', href: '/contacto' },
];

/**
 * Navegación principal — sale del mockup (docs/mockups/inicio.png).
 *
 * CUATRO ítems, planos: el diseño nuevo no tiene desplegables ni botón "Donar".
 *
 * "Chárbel" lleva tilde en todo texto visible aunque el mockup la omita en el
 * logo: es un descuido de maquetación, no una decisión editorial. Las rutas y
 * los nombres de archivo van sin tilde (`san-charbel`).
 */

export interface NavItem {
  label: string;
  href: string;
}

export const navegacion: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'San Chárbel', href: '/san-charbel' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Servicios', href: '/servicios' },
];

/**
 * Mapa de iconos — Sistema de diseño §5.1
 *
 * Estilo lineal, trazo 1.5px, extremos redondeados, caja 24×24. Los trazados
 * provienen de Lucide (lucide.dev, ISC), copiados uno a uno.
 *
 * ¿Por qué un mapa a mano y no el paquete? §5.1 pide trazo de 1.5px y Lucide
 * lo entrega a 2px, así que habría que sobrescribirlo igual. A cambio de ~14
 * trazados evitamos una dependencia y una integración más en el build.
 *
 * MIGRACIÓN: si el sitio pasa de ~25 iconos, conviene cambiar a `astro-icon` +
 * `@iconify-json/lucide`. Como todo consumo pasa por el prop `name` de
 * Icon.astro, el cambio toca solo este archivo y el componente.
 *
 * Al añadir un icono: revísalo a 24px y a 56px antes de darlo por bueno.
 */

export const icons = {
  // Navegación e interfaz
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',

  // Añadidos por la Agenda (Camilo). Mismo origen: Lucide, trazo 1.5px.
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'triangle-alert':
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'external-link':
    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',

  // Contenido de la portada
  heart:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'map-pin':
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'calendar-days':
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  church:
    '<path d="M10 9h4"/><path d="M12 7v5"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22"/><path d="m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7"/>',
  'book-open':
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',

  // Contacto
  phone:
    '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',

  // Sacramentos y servicios (diseño nuevo)
  droplet: '<path d="M12 2.7 6.8 7.9a7.3 7.3 0 1 0 10.4 0Z"/>',
  rings:
    '<circle cx="9" cy="15" r="5.5"/><circle cx="15" cy="15" r="5.5"/><path d="M9.5 5.5 12 3l2.5 2.5"/>',
  chalice:
    '<path d="M7 3h10"/><path d="M7.5 3v3.5a4.5 4.5 0 0 0 9 0V3"/><path d="M12 11v7"/><path d="M8.5 21h7"/><path d="M9.5 21a2.5 2.5 0 0 1 5 0"/>',
  flame: '<path d="M12 3c2.2 3.2 4.2 4.8 4.2 8.2a4.2 4.2 0 0 1-8.4 0C7.8 7.8 9.8 6.2 12 3Z"/>',
  cross: '<path d="M12 3v18"/><path d="M7 8h10"/>',
  hands:
    '<path d="M8 13V6.5a1.75 1.75 0 0 1 3.5 0V11"/><path d="M11.5 11V4.5a1.75 1.75 0 0 1 3.5 0V13"/><path d="M15 11.5a1.75 1.75 0 0 1 3.5 0V15a6.5 6.5 0 0 1-6.5 6.5h-1A6.5 6.5 0 0 1 4.5 15v-2.5a1.75 1.75 0 0 1 3.5 0"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  mountain:
    '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  'hand-heart':
    '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 16-5-5L5 20"/>',
  mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
} as const;

export type IconName = keyof typeof icons;

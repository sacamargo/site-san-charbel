/**
 * Navegación del panel — una entrada = un módulo.
 */
export const adminNav = [
	{ href: '/admin', label: 'Inicio', exact: true },
	{ href: '/admin/eventos', label: 'Eventos' },
	{ href: '/admin/horarios', label: 'Horarios' },
	{ href: '/admin/contacto', label: 'Contacto' },
	{ href: '/admin/momentos', label: 'Momentos' },
	{ href: '/admin/servicios', label: 'Servicios' },
	{ href: '/admin/banner', label: 'Banner' },
] as const;

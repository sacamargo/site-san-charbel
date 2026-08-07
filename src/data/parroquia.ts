/**
 * Datos de la parroquia — constantes del sitio.
 *
 * ⚠️ PROVISIONAL. Los campos marcados PENDIENTE están bloqueados por §12.2 del
 * sistema de diseño y hay que confirmarlos con la parroquia antes de publicar.
 */

export const parroquia = {
  nombre: 'Parroquia San Chárbel',
  nombreCorto: 'San Chárbel',
  patrono: 'San Chárbel Makhlouf',
  tagline: 'Un lugar para encontrarte con Dios',

  // §0.1 — ubicación confirmada.
  barrio: 'Villa Carolina',
  ciudad: 'Barranquilla',
  departamento: 'Atlántico',
  pais: 'Colombia',

  // PENDIENTE §12.2.4 — dirección exacta en Villa Carolina.
  direccion: 'Dirección por confirmar',
  direccionCompleta: 'Villa Carolina, Barranquilla, Atlántico',

  // PENDIENTE §12.2 — teléfono y WhatsApp reales.
  telefono: null as string | null,
  whatsapp: null as string | null,
  email: null as string | null,

  // PENDIENTE §12.2.4 — confirmar jurisdicción.
  arquidiocesis: 'Arquidiócesis de Barranquilla',
  arquidiocesisUrl: null as string | null,
} as const;

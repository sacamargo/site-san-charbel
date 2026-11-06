/**
 * Espacio promocional de actividades de la parroquia — respaldo local
 * mientras no haya filas personalizadas en `parish_promotions` (Supabase).
 */

export interface PromocionParroquial {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descripcion: string;
  etiqueta: string;
  fecha_texto: string | null;
  lugar: string | null;
  imagen_url: string | null;
  cta_texto: string;
  cta_url: string;
  destacado: boolean;
  activo: boolean;
  orden: number;
}

export const promocionesIniciales: PromocionParroquial[] = [
  {
    id: 'promo-misa-san-charbel',
    titulo: 'Eucaristía mensual en honor a San Chárbel',
    subtitulo: 'Oración por los enfermos y bendición comunitaria',
    descripcion:
      'Nos reunimos como familia parroquial para presentar nuestras intenciones de salud y agradecer los favores recibidos por intercesión de San Chárbel Makhlouf.',
    etiqueta: 'Devoción patronal',
    fecha_texto: 'Cada mes · Consulta la agenda',
    lugar: 'Templo parroquial',
    imagen_url: null,
    cta_texto: 'Enviar petición de oración',
    cta_url: '/peticiones?servicio=intencion-misa',
    destacado: true,
    activo: true,
    orden: 1,
  },
  {
    id: 'promo-grupos-apostolados',
    titulo: 'Comunidades de Emaús y grupos parroquiales',
    subtitulo: 'Formación, oración y servicio fraterno',
    descripcion:
      'Conoce las pastorales, retiros de Emaús, grupos juveniles, catequesis familiar y ministerios de servicio abiertos para toda la comunidad de Villa Carolina.',
    etiqueta: 'Vida comunitaria',
    fecha_texto: 'Encuentros semanales',
    lugar: 'Salones parroquiales',
    imagen_url: null,
    cta_texto: 'Solicitar información',
    cta_url: '/peticiones?servicio=grupos-parroquiales',
    destacado: false,
    activo: true,
    orden: 2,
  },
  {
    id: 'promo-adoracion-jueves',
    titulo: 'Jueves de Adoración Eucarística',
    subtitulo: 'Encuentro de oración ante el Santísimo Sacramento',
    descripcion:
      'Un espacio semanal de silencio, alabanza y oración por las familias, los enfermos y la paz de nuestra ciudad.',
    etiqueta: 'Espiritualidad',
    fecha_texto: 'Jueves · Templo parroquial',
    lugar: 'Templo parroquial',
    imagen_url: null,
    cta_texto: 'Ver horarios de la parroquia',
    cta_url: '/servicios#horarios',
    destacado: false,
    activo: true,
    orden: 3,
  },
];

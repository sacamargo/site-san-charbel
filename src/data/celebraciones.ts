/**
 * Celebraciones — sustituto temporal de la tabla `celebraciones` (§9.2).
 *
 * ⚠️ CONTENIDO MIXTO. El Retiro de Emaús R18 es real (sale de su flyer); las
 * otras dos siguen siendo de ejemplo. Dos preguntas de §12.2 bloquean el resto:
 *   1. Qué día del mes es la misa a San Chárbel — estructura toda la agenda.
 *   2. Qué día es la fiesta patronal (24 de julio o tercer domingo de julio).
 *
 * Los componentes no importan este archivo: pasan por lib/queries/celebraciones.
 */
import type { Celebracion } from '@/lib/types';
import emausR18 from '@/assets/eventos/emaus-hombres-r18.png';
import adoracion from '@/assets/eventos/adoracion-eucaristica.webp';
import vigiliaColombia from '@/assets/eventos/vigilia-oracion-colombia.webp';
import novenaSanCharbel from '@/assets/eventos/novena-san-charbel.jpg';

export const celebraciones: Celebracion[] = [
  {
    id: 'retiro-emaus-hombres-18',
    slug: 'retiro-de-emaus-hombres-r18',
    titulo: 'Retiro de Emaús Hombres R18',
    resumen: 'Retiro de encuentro personal con Cristo, dirigido a los hombres de la comunidad.',
    contenido: '',
    imagen_url: null,
    // El flyer se cambió por una versión cuadrada de 1254×1254: entra en la
    // ranura sin recorte ninguno y ya no se queda corto de resolución, que era
    // el problema de la anterior (399px de ancho para una tarjeta que pide 544
    // en pantallas 2×).
    //
    // PESA 2.4MB EN PNG. Al servirla, Astro la reencoda y la reduce, así que
    // no llega así al visitante; lo que engorda es el repositorio. En webp
    // serían ~380KB sin pérdida apreciable.
    imagen: emausR18,
    // Los días (3, 4 y 5 de julio) y la cita salen del flyer.
    //
    // PENDIENTE — EL AÑO NO ESTÁ EN EL FLYER. Julio de 2026 ya pasó, así que
    // aquí va 2027 para no anunciar como próximo un retiro vencido. Si el
    // flyer era del de 2026, hay que despublicarlo, no cambiarle el año.
    fecha_inicio: '2027-07-03',
    fecha_fin: '2027-07-05',
    // El flyer no da hora de inicio ni sede. Se dejan vacíos en vez de
    // heredar los de la misa anterior: un dato inventado se lee como real.
    hora: null,
    lugar: null,
    dirigido_a: 'Hombres',
    categoria: 'Retiro',
    cita: 'El que beba del agua que yo le daré, no tendrá sed jamás',
    cita_referencia: 'Juan 4, 14',
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
    // PENDIENTE: la foto llegó con nombre de descarga ("Adoration-and-
    // Benediction-900x900"), así que no es de la parroquia. Antes de publicar,
    // confirmar de dónde salió y si se puede usar.
    imagen: adoracion,
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
    id: 'vigilia-oracion-colombia',
    slug: 'vigilia-de-oracion-por-colombia',
    titulo: 'Vigilia de oración por Colombia',
    resumen: 'Una noche de oración por la paz y la reconciliación del país.',
    contenido: '',
    imagen_url: null,
    // Apaisada (1536×1024). Cuando la ranura era 3:2 entraba entera; ahora es
    // cuadrada y pierde un tercio del ancho por los lados, recortado simétrico.
    // Es ilustrativa y generada, no la foto de una vigilia real.
    imagen: vigiliaColombia,
    // PENDIENTE: la fecha es la del evento de ejemplo anterior, no la de esta
    // vigilia. La hora va en null a propósito: la heredada eran las 16:00 y
    // una vigilia a las 4 de la tarde se contradice sola. Confirmar ambas.
    fecha_inicio: '2026-09-05',
    fecha_fin: null,
    hora: null,
    lugar: 'Templo parroquial',
    dirigido_a: 'Toda la comunidad',
    categoria: 'Oración',
    cita: null,
    cita_referencia: null,
    publicado: true,
    orden: 3,
  },
  {
    id: 'novena-san-charbel',
    slug: 'novena-en-honor-a-san-charbel',
    titulo: 'Novena en honor a San Chárbel',
    resumen: 'Nueve días de oración en honor al patrono de la parroquia.',
    contenido: '',
    imagen_url: null,
    // Vertical (385×519). En la ranura cuadrada pierde el 26% del alto por
    // abajo, así que se van el libro y la lámpara; con el anclaje arriba que
    // trae EventCard quedan enteros el halo, el rostro y las manos, que es lo
    // que identifica la estampa. Comprobados los cuatro anclajes: los de más
    // abajo salvan el libro pero cortan el halo, y eso se lee como error.
    imagen: novenaSanCharbel,
    // Del 22 al 30 de septiembre son nueve días contando ambos extremos, que
    // es justo lo que dura una novena: las fechas cuadran con el nombre.
    //
    // PENDIENTE — EL AÑO LO PONGO YO. Solo se dieron los días; septiembre de
    // 2026 es el próximo que viene, así que va ese. Confirmar.
    // La hora queda en null: no se dio ninguna y una inventada se lee igual de
    // real que una buena.
    fecha_inicio: '2026-09-22',
    fecha_fin: '2026-09-30',
    hora: null,
    lugar: 'Templo parroquial',
    dirigido_a: 'Toda la comunidad',
    categoria: 'Devoción',
    cita: null,
    cita_referencia: null,
    publicado: true,
    orden: 4,
  },
];

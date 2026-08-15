/**
 * Contenido de /san-charbel — sale del mockup de la página del santo.
 * Textos curados a mano; cuando haya fuente pastoral oficial, se revisan aquí.
 */
import type { IconName } from '@/components/ui/icons';

export interface HitoVida {
  anio: string;
  titulo: string;
  descripcion: string;
  icono: IconName;
}

export interface Virtud {
  nombre: string;
  descripcion: string;
  icono: IconName;
}

export interface Milagro {
  titulo: string;
  descripcion: string;
  /** Clave del asset en src/assets/san-charbel/ */
  imagen: 'sanaciones-velas' | 'respuestas-rosario' | 'presencia-annaya';
  alt: string;
}

export const hitosVida: HitoVida[] = [
  {
    anio: '1828',
    titulo: 'Nacimiento',
    descripcion: 'Nace en Bekaa Kafra, Líbano, en una familia campesina de fe profunda.',
    icono: 'home',
  },
  {
    anio: '1851',
    titulo: 'Ingreso al monasterio',
    descripcion: 'Entra al monasterio de San Marón en Annaya para seguir la vida monástica.',
    icono: 'cross',
  },
  {
    anio: '1853',
    titulo: 'Votos monásticos',
    descripcion: 'Profesa sus votos y recibe el nombre de Chárbel, en honor a un mártir de la Iglesia.',
    icono: 'book-open',
  },
  {
    anio: '1875',
    titulo: 'Vida de ermitaño',
    descripcion: 'Se retira a la ermita de San Pedro y San Pablo, entregado a la oración y la penitencia.',
    icono: 'mountain',
  },
  {
    anio: '1898',
    titulo: 'Tránsito a la gloria',
    descripcion: 'Muere en olor de santidad. Su tumba se convierte en lugar de peregrinación y milagros.',
    icono: 'cross',
  },
];

export const virtudes: Virtud[] = [
  {
    nombre: 'Fe profunda',
    descripcion: 'Confió plenamente en la voluntad de Dios, también en lo oculto y lo sencillo.',
    icono: 'hands',
  },
  {
    nombre: 'Humildad',
    descripcion: 'Vivió sin buscar reconocimiento: sirvió en silencio y con docilidad.',
    icono: 'leaf',
  },
  {
    nombre: 'Oración constante',
    descripcion: 'Hizo de la oración el centro de su día; su vida fue un diálogo continuo con Dios.',
    icono: 'heart',
  },
  {
    nombre: 'Penitencia',
    descripcion: 'Abrazó el sacrificio y la austeridad como camino de unión con Cristo.',
    icono: 'cross',
  },
  {
    nombre: 'Amor al prójimo',
    descripcion: 'Su santidad se tradujo en caridad concreta hacia quienes lo buscaban.',
    icono: 'users',
  },
];

export const milagros: Milagro[] = [
  {
    titulo: 'Sanaciones',
    descripcion: 'Testimonios de curaciones físicas y espirituales atribuidas a su intercesión.',
    imagen: 'sanaciones-velas',
    alt: 'Velas votivas encendidas en un ambiente de oración',
  },
  {
    titulo: 'Respuestas',
    descripcion: 'Historias de peticiones escuchadas y caminos que se abren en la fe.',
    imagen: 'respuestas-rosario',
    alt: 'Cruz de madera sobre un rosario',
  },
  {
    titulo: 'Presencia viva',
    descripcion: 'Peregrinos de todo el mundo siguen acudiendo a Annaya en busca de su amparo.',
    imagen: 'presencia-annaya',
    alt: 'Monasterio de San Marón en Annaya al atardecer',
  },
];

export const oracion = {
  titulo: 'Oración a San Chárbel',
  texto: `San Chárbel, siervo fiel de Dios,
tú que amaste la oración, la humildad y el silencio,
intercede por nosotros ante el Señor.

Enséñanos a confiar como tú confiaste,
a orar sin descanso
y a servir con un corazón sencillo.

Por tu intercesión, concédenos la gracia que hoy te pedimos
y la paz que solo Dios puede dar.

Amén.`,
  cita: 'Orad sin cesar',
  citaAutor: 'San Chárbel Makhlouf',
};

export const galeriaLabels = [
  'Interior del templo',
  'Bendición de San Chárbel',
  'Montañas del Líbano',
  'Altar y ofrenda',
  'Velas de fe',
  'Basílica y paisaje',
];

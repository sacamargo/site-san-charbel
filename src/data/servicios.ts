/**
 * Servicios de la parroquia — §"Servicios" del mockup.
 *
 * Contenido institucional del repo: cambia cuando cambia la oferta sacramental
 * de la parroquia, es decir, casi nunca.
 *
 * IMPORTANTE (docs/MVP-PLAN.md §Decisiones de producto):
 * No publicar listas cerradas de documentos o requisitos específicos hasta
 * recibir la aprobación formal del despacho parroquial. Mientras se validan,
 * cada ficha orienta sobre el sentido del sacramento, el canal de atención y
 * cómo consultar la disponibilidad en el despacho.
 */
import type { IconName } from '@/components/ui/icons';

export interface Servicio {
  slug: string;
  nombre: string;
  descripcion: string;
  href: string;
  icono: IconName;
  categoria: 'iniciacion' | 'alianza' | 'sanacion';
  introduccion: string;
  orientacion: string[];
  atencion: string;
}

export const servicios: Servicio[] = [
  {
    slug: 'bautismo',
    nombre: 'Bautismo',
    descripcion: 'Inicia el camino de la fe de tu hijo.',
    href: '/servicios/bautismo',
    icono: 'droplet',
    categoria: 'iniciacion',
    introduccion:
      'El Bautismo es el fundamento de toda la vida cristiana y la puerta de entrada a la comunidad de la Iglesia. Acompañamos a las familias y padrinos en la preparación para celebrar este sacramento.',
    orientacion: [
      'Acércate o comunícate con el despacho parroquial para consultar las fechas disponibles de celebración y de catequesis prebautismal.',
      'El despacho te indicará los documentos requeridos según la edad del bautizando y los requisitos para los padrinos.',
      'La inscripción y reserva de fecha se confirman directamente en el despacho una vez revisada la documentación.',
    ],
    atencion: 'Inscripción y orientación en el despacho parroquial.',
  },
  {
    slug: 'matrimonio',
    nombre: 'Matrimonio',
    descripcion: 'Dios bendice y acompaña su unión.',
    href: '/servicios/matrimonio',
    icono: 'rings',
    categoria: 'alianza',
    introduccion:
      'En el sacramento del Matrimonio, los esposos reciben la gracia de Cristo para amarse y acompañarse toda la vida. La parroquia guía a los novios durante el proceso prematrimonial y la preparación litúrgica.',
    orientacion: [
      'Comunícate con el despacho parroquial con antelación para verificar la disponibilidad de fecha y abrir el expediente matrimonial.',
      'El despacho informará sobre las partidas actualizadas, el curso prematrimonial y los trámites ante la Arquidiócesis de Barranquilla.',
      'La fecha queda reservada tras la entrevista inicial y la revisión en el despacho.',
    ],
    atencion: 'Apertura de expediente y reserva de fecha con cita en el despacho parroquial.',
  },
  {
    slug: 'primera-comunion',
    nombre: 'Primera Comunión',
    descripcion: 'Fortalece la fe de tu hijo en la Eucaristía.',
    href: '/servicios/primera-comunion',
    icono: 'chalice',
    categoria: 'iniciacion',
    introduccion:
      'La Primera Comunión prepara a los niños y adolescentes para encontrarse con Jesús en la Eucaristía y participar activamente en la vida de la comunidad parroquial.',
    orientacion: [
      'Consulta en el despacho parroquial los periodos de inscripción y los horarios de los encuentros de catequesis.',
      'El equipo de catequesis acompaña tanto a los niños como a sus padres durante el proceso de preparación.',
      'El despacho confirmará la edad mínima y los certificados requeridos al momento de la inscripción.',
    ],
    atencion: 'Inscripciones según el calendario de catequesis parroquial.',
  },
  {
    slug: 'confirmacion',
    nombre: 'Confirmación',
    descripcion: 'Fortalece tu fe con la acción del Espíritu Santo.',
    href: '/servicios/confirmacion',
    icono: 'flame',
    categoria: 'iniciacion',
    introduccion:
      'Por el sacramento de la Confirmación, los bautizados se vinculan más estrechamente a la Iglesia y se enriquecen con la fuerza especial del Espíritu Santo para dar testimonio de la fe.',
    orientacion: [
      'Acércate al despacho parroquial para conocer las convocatorias de catequesis de jóvenes y adultos.',
      'El despacho te informará los requisitos de edad, asistencia a los encuentros y condiciones para el padrino o madrina.',
      'Las celebraciones se programan en coordinación con la Arquidiócesis de Barranquilla.',
    ],
    atencion: 'Inscripciones abiertas según convocatoria en el despacho parroquial.',
  },
  {
    slug: 'confesion',
    nombre: 'Confesión',
    descripcion: 'Encuentro con la misericordia de Dios.',
    href: '/servicios/confesion',
    icono: 'cross',
    categoria: 'sanacion',
    introduccion:
      'El sacramento de la Reconciliación nos devuelve la paz del corazón y renueva nuestra comunión con Dios y con la Iglesia. No requiere inscripción previa en los horarios habituales del templo.',
    orientacion: [
      'Puedes acercarte directamente al templo en los horarios habituales de confesión, media hora antes de cada misa de martes a sábado.',
      'Dedica unos minutos previos de oración y examen de conciencia en silencio ante el altar.',
      'Si necesitas atención espiritual o confesión fuera del horario habitual, puedes solicitarla en el despacho parroquial.',
    ],
    atencion: 'Atención presencial en el templo antes de la Eucaristía, sin cita previa.',
  },
  {
    slug: 'uncion-de-los-enfermos',
    nombre: 'Unción de los enfermos',
    descripcion: 'Consuelo y fortaleza en la enfermedad.',
    href: '/servicios/uncion-de-los-enfermos',
    icono: 'hands',
    categoria: 'sanacion',
    introduccion:
      'Con la Unción de los enfermos, la Iglesia encomienda a los fieles que atraviesan una enfermedad grave o edad avanzada al Señor sufriente y glorificado, para que los alivie y fortalezca.',
    orientacion: [
      'Comunícate por teléfono o acércate al despacho parroquial para coordinar la visita del sacerdote al hogar o centro médico.',
      'Indica el nombre del enfermo, su ubicación y un teléfono de contacto de un familiar directo.',
      'También puede solicitarse en el templo al finalizar la Eucaristía cuando la persona puede desplazarse.',
    ],
    atencion: 'Solicitud directa por teléfono o en el despacho parroquial.',
  },
];

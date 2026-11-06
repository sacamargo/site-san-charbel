-- =============================================================================
-- Semilla inicial — Parroquia San Chárbel
-- Ejecutar DESPUÉS de 20260822160000_admin_foundation.sql
-- =============================================================================

insert into public.mass_schedules (tipo, dia, dias, horas, nota, orden, activo)
select * from (values
  ('misa'::text, 'Lunes a viernes', array[1,2,3,4,5]::smallint[], array['06:00','18:00']::text[], null::text, 1, true),
  ('misa', 'Sábados', array[6]::smallint[], array['06:00','18:00']::text[], null, 2, true),
  ('misa', 'Domingos', array[0]::smallint[], array['07:00','09:00','11:00','18:00']::text[], null, 3, true),
  ('confesion', 'Martes a sábado', array[2,3,4,5,6]::smallint[], array['17:00']::text[], 'Media hora antes de cada misa', 4, true),
  ('despacho', 'Lunes a viernes', array[1,2,3,4,5]::smallint[], array['08:00']::text[], '8:00 a.m. - 12:00 m.', 5, true)
) as v(tipo, dia, dias, horas, nota, orden, activo)
where not exists (select 1 from public.mass_schedules limit 1);

insert into public.parish_services (nombre, slug, categoria, descripcion_corta, introduccion, orientacion, atencion, descripcion_modal, icono, orden, activo)
select * from (values
  (
    'Bautismo',
    'bautismo',
    'iniciacion',
    'Inicia el camino de la fe de tu hijo.',
    'El Bautismo es el fundamento de toda la vida cristiana y la puerta de entrada a la comunidad de la Iglesia. Acompañamos a las familias y padrinos en la preparación para celebrar este sacramento.',
    array[
      'Acércate o comunícate con el despacho parroquial para consultar las fechas disponibles de celebración y de catequesis prebautismal.',
      'El despacho te indicará los documentos requeridos según la edad del bautizando y los requisitos para los padrinos.',
      'La inscripción y reserva de fecha se confirman directamente en el despacho una vez revisada la documentación.'
    ]::text[],
    'Inscripción y orientación en el despacho parroquial.',
    'Envía tu solicitud desde el formulario inferior o acércate al despacho parroquial.',
    'droplet',
    1,
    true
  ),
  (
    'Matrimonio',
    'matrimonio',
    'alianza',
    'Dios bendice y acompaña su unión.',
    'En el sacramento del Matrimonio, los esposos reciben la gracia de Cristo para amarse y acompañarse toda la vida. La parroquia guía a los novios durante el proceso prematrimonial y la preparación litúrgica.',
    array[
      'Comunícate con el despacho parroquial con antelación para verificar la disponibilidad de fecha y abrir el expediente matrimonial.',
      'El despacho informará sobre las partidas actualizadas, el curso prematrimonial y los trámites ante la Arquidiócesis de Barranquilla.',
      'La fecha queda reservada tras la entrevista inicial y la revisión en el despacho.'
    ]::text[],
    'Apertura de expediente y reserva de fecha con cita en el despacho parroquial.',
    'Envía tu solicitud de orientación prematrimonial y disponibilidad de fecha.',
    'rings',
    2,
    true
  ),
  (
    'Primera Comunión',
    'primera-comunion',
    'iniciacion',
    'Fortalece la fe de tu hijo en la Eucaristía.',
    'La Primera Comunión prepara a los niños y adolescentes para encontrarse con Jesús en la Eucaristía y participar activamente en la vida de la comunidad parroquial.',
    array[
      'Consulta en el despacho parroquial los periodos de inscripción y los horarios de los encuentros de catequesis.',
      'El equipo de catequesis acompaña tanto a los niños como a sus padres durante el proceso de preparación.',
      'El despacho confirmará la edad mínima y los certificados requeridos al momento de la inscripción.'
    ]::text[],
    'Inscripciones según el calendario de catequesis parroquial.',
    'Solicita información sobre las inscripciones de catequesis de Primera Comunión.',
    'chalice',
    3,
    true
  ),
  (
    'Confirmación',
    'confirmacion',
    'iniciacion',
    'Fortalece tu fe con la acción del Espíritu Santo.',
    'Por el sacramento de la Confirmación, los bautizados se vinculan más estrechamente a la Iglesia y se enriquecen con la fuerza especial del Espíritu Santo para dar testimonio de la fe.',
    array[
      'Acércate al despacho parroquial para conocer las convocatorias de catequesis de jóvenes y adultos.',
      'El despacho te informará los requisitos de edad, asistencia a los encuentros y condiciones para el padrino o madrina.',
      'Las celebraciones se programan en coordinación con la Arquidiócesis de Barranquilla.'
    ]::text[],
    'Inscripciones abiertas según convocatoria en el despacho parroquial.',
    'Solicita información sobre la preparación para el sacramento de la Confirmación.',
    'flame',
    4,
    true
  ),
  (
    'Confesión',
    'confesion',
    'sanacion',
    'Encuentro con la misericordia de Dios.',
    'El sacramento de la Reconciliación nos devuelve la paz del corazón y renueva nuestra comunión con Dios y con la Iglesia. No requiere inscripción previa en los horarios habituales del templo.',
    array[
      'Puedes acercarte directamente al templo en los horarios habituales de confesión, media hora antes de cada misa de martes a sábado.',
      'Dedica unos minutos previos de oración y examen de conciencia en silencio ante el altar.',
      'Si necesitas atención espiritual o confesión fuera del horario habitual, puedes solicitarla en el despacho parroquial.'
    ]::text[],
    'Atención presencial en el templo antes de la Eucaristía, sin cita previa.',
    'Si requieres dirección espiritual o cita fuera del horario habitual, escríbenos.',
    'cross',
    5,
    true
  ),
  (
    'Unción de los enfermos',
    'uncion-de-los-enfermos',
    'sanacion',
    'Consuelo y fortaleza en la enfermedad.',
    'Con la Unción de los enfermos, la Iglesia encomienda a los fieles que atraviesan una enfermedad grave o edad avanzada al Señor sufriente y glorificado, para que los alivie y fortalezca.',
    array[
      'Comunícate por teléfono o envía una solicitud para coordinar la visita del sacerdote al hogar o centro médico.',
      'Indica el nombre del enfermo, su ubicación y un teléfono de contacto de un familiar directo.',
      'También puede solicitarse en el templo al finalizar la Eucaristía cuando la persona puede desplazarse.'
    ]::text[],
    'Solicitud directa por formulario, teléfono o en el despacho parroquial.',
    'Solicita la visita pastoral para un familiar enfermo o adulto mayor.',
    'hands',
    6,
    true
  )
) as v(nombre, slug, categoria, descripcion_corta, introduccion, orientacion, atencion, descripcion_modal, icono, orden, activo)
where not exists (select 1 from public.parish_services limit 1);

insert into public.parish_promotions (titulo, subtitulo, descripcion, etiqueta, fecha_texto, lugar, cta_texto, cta_url, destacado, activo, orden)
select * from (values
  (
    'Misa mensual de sanación en honor a San Chárbel',
    'Oración por los enfermos y bendición con el aceite de San Chárbel',
    'Cada mes nos reunimos como comunidad para pedir la intercesión de nuestro patrono por la salud espiritual y corporal de nuestras familias.',
    'Devoción patronal',
    'Día 22 de cada mes · 6:00 p. m.',
    'Templo parroquial',
    'Enviar una petición',
    '/peticiones?servicio=intencion-misa',
    true,
    true,
    1
  ),
  (
    'Grupos de oración y apostolados parroquiales',
    'Comunidades de Emaús, pastoral familiar, jóvenes y ministerio de música',
    'Intégrate a los espacios de formación, servicio y vida fraterna de nuestra parroquia en Villa Carolina.',
    'Vida comunitaria',
    'Encuentros semanales',
    'Salones parroquiales',
    'Quiero integrarme',
    '/peticiones?servicio=apostolados',
    false,
    true,
    2
  ),
  (
    'Adoración al Santísimo Sacramento',
    'Hora Santa comunitaria por las familias y la paz de Colombia',
    'Un espacio de silencio, canto y adoración ante Jesús Sacramentado abierto a todos los fieles.',
    'Espiritualidad',
    'Jueves · 6:30 p. m.',
    'Templo parroquial',
    'Ver horarios',
    '/servicios',
    false,
    true,
    3
  )
) as v(titulo, subtitulo, descripcion, etiqueta, fecha_texto, lugar, cta_texto, cta_url, destacado, activo, orden)
where not exists (select 1 from public.parish_promotions limit 1);

update public.site_settings set
  telefono_fijo = '(605) 309 0700',
  telefono_movil = '317 658 4562',
  email = 'info@parroquiasancharbel.org',
  notification_gmail = 'info@parroquiasancharbel.org',
  mapa_lat = 11.0205836,
  mapa_lng = -74.8156569,
  mapa_zoom = 17,
  mapa_ficha = 'https://maps.google.com/?cid=17941626938708420674'
where id = 'default';

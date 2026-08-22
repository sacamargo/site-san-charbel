-- Semilla inicial (opcional). Ejecutar DESPUÉS de 20260822160000_admin_foundation.sql

insert into public.mass_schedules (tipo, dia, dias, horas, nota, orden, activo)
select * from (values
  ('misa'::text, 'Lunes a viernes', array[1,2,3,4,5]::smallint[], array['06:00','18:00']::text[], null::text, 1, true),
  ('misa', 'Sábados', array[6]::smallint[], array['06:00','18:00']::text[], null, 2, true),
  ('misa', 'Domingos', array[0]::smallint[], array['07:00','09:00','11:00','18:00']::text[], null, 3, true),
  ('confesion', 'Martes a sábado', array[2,3,4,5,6]::smallint[], array['17:00']::text[], 'Media hora antes de cada misa', 4, true),
  ('despacho', 'Lunes a viernes', array[1,2,3,4,5]::smallint[], array['08:00']::text[], '8:00 a.m. - 12:00 m.', 5, true)
) as v(tipo, dia, dias, horas, nota, orden, activo)
where not exists (select 1 from public.mass_schedules limit 1);

insert into public.parish_services (nombre, slug, descripcion_corta, descripcion_modal, icono, orden, activo)
select * from (values
  ('Bautismo', 'bautismo', 'Inicia el camino de la fe de tu hijo.', 'Próximamente: requisitos y formulario de solicitud.', 'droplet', 1, true),
  ('Matrimonio', 'matrimonio', 'Dios bendice y acompaña su unión.', 'Próximamente: requisitos y formulario de solicitud.', 'rings', 2, true),
  ('Primera Comunión', 'primera-comunion', 'Fortalece la fe de tu hijo en la Eucaristía.', 'Próximamente: requisitos y formulario de solicitud.', 'chalice', 3, true),
  ('Confirmación', 'confirmacion', 'Fortalece tu fe con la acción del Espíritu Santo.', 'Próximamente: requisitos y formulario de solicitud.', 'flame', 4, true),
  ('Confesión', 'confesion', 'Encuentro con la misericordia de Dios.', 'Próximamente: horarios y preparación.', 'cross', 5, true),
  ('Unción de los enfermos', 'uncion-de-los-enfermos', 'Consuelo y fortaleza en la enfermedad.', 'Próximamente: cómo solicitarla.', 'hands', 6, true)
) as v(nombre, slug, descripcion_corta, descripcion_modal, icono, orden, activo)
where not exists (select 1 from public.parish_services limit 1);

update public.site_settings set
  telefono_fijo = '(605) 309 0700',
  telefono_movil = '317 658 4562',
  email = 'info@parroquiasancharbel.org',
  mapa_lat = 11.0205836,
  mapa_lng = -74.8156569,
  mapa_zoom = 17,
  mapa_ficha = 'https://maps.google.com/?cid=17941626938708420674'
where id = 'default';

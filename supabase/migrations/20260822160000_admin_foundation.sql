-- =============================================================================
-- Fundación completa del Dashboard y Base de Datos — Parroquia San Chárbel
-- Aplicar en Supabase → SQL Editor (proyecto DEV / PROD).
-- No contiene service_role ni secretos.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Helpers generales
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Perfiles de administración (sin división por roles: todo usuario que
--    acceda al panel tiene todos los derechos de administración)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Cualquier usuario autenticado en el sistema de administración tiene todos los
-- permisos (no hay división por sub-roles). Mantenemos además la tabla profiles
-- sincronizada automáticamente mediante trigger en auth.users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null;
$$;

create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role)
  values (new.id, 'admin')
  on conflict (user_id) do update set role = 'admin';
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. events (Calendario y próximos eventos)
-- ---------------------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  titulo text not null,
  resumen text not null default '',
  contenido text not null default '',
  fecha_inicio date not null,
  fecha_fin date,
  hora time,
  lugar text,
  dirigido_a text,
  categoria text,
  cita text,
  cita_referencia text,
  flyer_url text,
  destacado boolean not null default false,
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events add column if not exists slug text unique;
alter table public.events add column if not exists contenido text not null default '';
alter table public.events add column if not exists dirigido_a text;
alter table public.events add column if not exists categoria text;
alter table public.events add column if not exists cita text;
alter table public.events add column if not exists cita_referencia text;
alter table public.events add column if not exists destacado boolean not null default false;

create index if not exists events_publicado_fecha_idx
  on public.events (publicado, fecha_inicio);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read"
  on public.events for select
  to anon, authenticated
  using (publicado = true);

drop policy if exists "events_admin_read_all" on public.events;
create policy "events_admin_read_all"
  on public.events for select
  to authenticated
  using (public.is_admin());

drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. mass_schedules (Horarios de misas, confesiones y despacho)
-- ---------------------------------------------------------------------------

create table if not exists public.mass_schedules (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('misa', 'confesion', 'despacho', 'adoracion', 'rosario')),
  dia text not null,
  dias smallint[] not null default '{}',
  horas text[] not null default '{}',
  nota text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists mass_schedules_set_updated_at on public.mass_schedules;
create trigger mass_schedules_set_updated_at
  before update on public.mass_schedules
  for each row execute function public.set_updated_at();

alter table public.mass_schedules enable row level security;

drop policy if exists "mass_schedules_public_read" on public.mass_schedules;
create policy "mass_schedules_public_read"
  on public.mass_schedules for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "mass_schedules_admin_read" on public.mass_schedules;
create policy "mass_schedules_admin_read"
  on public.mass_schedules for select
  to authenticated
  using (public.is_admin());

drop policy if exists "mass_schedules_admin_all" on public.mass_schedules;
create policy "mass_schedules_admin_all"
  on public.mass_schedules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. site_settings (Configuración global del sitio, textos, contacto y Gmail)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  nombre text not null default 'Parroquia San Chárbel',
  tagline text not null default 'Una comunidad que ora, celebra y sirve con amor',
  hero_eyebrow text not null default 'Bienvenido a',
  hero_titulo text not null default 'Parroquia San Chárbel',
  hero_subtitulo text not null default 'Somos una comunidad que ora, celebra y sirve con amor, bajo la intercesión de San Chárbel Makhlouf.',
  santo_titulo text not null default 'San Chárbel, ruega por nosotros',
  santo_texto text not null default 'San Chárbel Makhlouf, santo libanés del siglo XIX, ejemplo de oración, humildad y entrega a Dios. Su vida sigue inspirando a miles de fieles en el mundo.',
  footer_cita text not null default '«Que el Señor de los Milagros y San Chárbel guíen y bendigan a nuestra comunidad.»',
  direccion text not null default 'Calle 98 # 65-120',
  barrio text not null default 'Villa Carolina',
  ciudad text not null default 'Barranquilla',
  departamento text not null default 'Atlántico',
  telefono_fijo text,
  telefono_movil text,
  email text,
  notification_gmail text,
  gmail_webhook_url text,
  whatsapp text,
  facebook text,
  instagram text,
  youtube text,
  mapa_lat double precision,
  mapa_lng double precision,
  mapa_zoom integer default 17,
  mapa_ficha text,
  services_form_url text,
  revisado_en date,
  updated_at timestamptz not null default now()
);

alter table public.site_settings add column if not exists tagline text not null default 'Una comunidad que ora, celebra y sirve con amor';
alter table public.site_settings add column if not exists hero_eyebrow text not null default 'Bienvenido a';
alter table public.site_settings add column if not exists hero_titulo text not null default 'Parroquia San Chárbel';
alter table public.site_settings add column if not exists hero_subtitulo text not null default 'Somos una comunidad que ora, celebra y sirve con amor, bajo la intercesión de San Chárbel Makhlouf.';
alter table public.site_settings add column if not exists santo_titulo text not null default 'San Chárbel, ruega por nosotros';
alter table public.site_settings add column if not exists santo_texto text not null default 'San Chárbel Makhlouf, santo libanés del siglo XIX, ejemplo de oración, humildad y entrega a Dios. Su vida sigue inspirando a miles de fieles en el mundo.';
alter table public.site_settings add column if not exists footer_cita text not null default '«Que el Señor de los Milagros y San Chárbel guíen y bendigan a nuestra comunidad.»';
alter table public.site_settings add column if not exists notification_gmail text;
alter table public.site_settings add column if not exists gmail_webhook_url text;
alter table public.site_settings add column if not exists services_form_url text;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_settings (id, nombre, direccion, barrio, ciudad, departamento, email, notification_gmail)
values ('default', 'Parroquia San Chárbel', 'Calle 98 # 65-120', 'Villa Carolina', 'Barranquilla', 'Atlántico', 'info@parroquiasancharbel.org', 'info@parroquiasancharbel.org')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. gallery_moments (Momentos de la parroquia)
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_moments (
  id uuid primary key default gen_random_uuid(),
  imagen_url text not null,
  alt text not null default '',
  album text,
  orden integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_moments add column if not exists album text;

drop trigger if exists gallery_moments_set_updated_at on public.gallery_moments;
create trigger gallery_moments_set_updated_at
  before update on public.gallery_moments
  for each row execute function public.set_updated_at();

alter table public.gallery_moments enable row level security;

drop policy if exists "gallery_moments_public_read" on public.gallery_moments;
create policy "gallery_moments_public_read"
  on public.gallery_moments for select
  to anon, authenticated
  using (publicado = true);

drop policy if exists "gallery_moments_admin_read" on public.gallery_moments;
create policy "gallery_moments_admin_read"
  on public.gallery_moments for select
  to authenticated
  using (public.is_admin());

drop policy if exists "gallery_moments_admin_all" on public.gallery_moments;
create policy "gallery_moments_admin_all"
  on public.gallery_moments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. parish_services (Sacramentos y servicios parroquiales)
-- ---------------------------------------------------------------------------

create table if not exists public.parish_services (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  categoria text not null default 'iniciacion',
  descripcion_corta text not null default '',
  introduccion text not null default '',
  orientacion text[] not null default '{}',
  atencion text not null default '',
  descripcion_modal text not null default '',
  icono text not null default 'cross',
  form_embed_url text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.parish_services add column if not exists categoria text not null default 'iniciacion';
alter table public.parish_services add column if not exists introduccion text not null default '';
alter table public.parish_services add column if not exists orientacion text[] not null default '{}';
alter table public.parish_services add column if not exists atencion text not null default '';

drop trigger if exists parish_services_set_updated_at on public.parish_services;
create trigger parish_services_set_updated_at
  before update on public.parish_services
  for each row execute function public.set_updated_at();

alter table public.parish_services enable row level security;

drop policy if exists "parish_services_public_read" on public.parish_services;
create policy "parish_services_public_read"
  on public.parish_services for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "parish_services_admin_read" on public.parish_services;
create policy "parish_services_admin_read"
  on public.parish_services for select
  to authenticated
  using (public.is_admin());

drop policy if exists "parish_services_admin_all" on public.parish_services;
create policy "parish_services_admin_all"
  on public.parish_services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. hero_slides (Imágenes y banners de la parte inicial)
-- ---------------------------------------------------------------------------

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  imagen_url text not null,
  eyebrow text,
  titulo text,
  subtitulo text,
  cta_texto text,
  enlace text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hero_slides add column if not exists eyebrow text;
alter table public.hero_slides add column if not exists subtitulo text;
alter table public.hero_slides add column if not exists cta_texto text;

drop trigger if exists hero_slides_set_updated_at on public.hero_slides;
create trigger hero_slides_set_updated_at
  before update on public.hero_slides
  for each row execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists "hero_slides_public_read" on public.hero_slides;
create policy "hero_slides_public_read"
  on public.hero_slides for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "hero_slides_admin_read" on public.hero_slides;
create policy "hero_slides_admin_read"
  on public.hero_slides for select
  to authenticated
  using (public.is_admin());

drop policy if exists "hero_slides_admin_all" on public.hero_slides;
create policy "hero_slides_admin_all"
  on public.hero_slides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. parish_promotions (Espacio promocional de actividades de la iglesia)
-- ---------------------------------------------------------------------------

create table if not exists public.parish_promotions (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  descripcion text not null default '',
  etiqueta text not null default 'Actividad parroquial',
  fecha_texto text,
  lugar text,
  imagen_url text,
  cta_texto text not null default 'Conocer más',
  cta_url text not null default '/agenda',
  destacado boolean not null default false,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists parish_promotions_set_updated_at on public.parish_promotions;
create trigger parish_promotions_set_updated_at
  before update on public.parish_promotions
  for each row execute function public.set_updated_at();

alter table public.parish_promotions enable row level security;

drop policy if exists "parish_promotions_public_read" on public.parish_promotions;
create policy "parish_promotions_public_read"
  on public.parish_promotions for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "parish_promotions_admin_read" on public.parish_promotions;
create policy "parish_promotions_admin_read"
  on public.parish_promotions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "parish_promotions_admin_all" on public.parish_promotions;
create policy "parish_promotions_admin_all"
  on public.parish_promotions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 10. community_businesses (Directorio de negocios de feligreses)
-- ---------------------------------------------------------------------------

create table if not exists public.community_businesses (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null default 'Servicios',
  descripcion text not null default '',
  propietario text,
  telefono text,
  whatsapp text,
  direccion text,
  horario text,
  sitio_web text,
  instagram text,
  imagen_url text,
  destacado boolean not null default false,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists community_businesses_set_updated_at on public.community_businesses;
create trigger community_businesses_set_updated_at
  before update on public.community_businesses
  for each row execute function public.set_updated_at();

alter table public.community_businesses enable row level security;

drop policy if exists "community_businesses_public_read" on public.community_businesses;
create policy "community_businesses_public_read"
  on public.community_businesses for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "community_businesses_admin_read" on public.community_businesses;
create policy "community_businesses_admin_read"
  on public.community_businesses for select
  to authenticated
  using (public.is_admin());

drop policy if exists "community_businesses_admin_all" on public.community_businesses;
create policy "community_businesses_admin_all"
  on public.community_businesses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 11. parish_files (Repositorio de archivos descargables)
-- ---------------------------------------------------------------------------

create table if not exists public.parish_files (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null default '',
  categoria text not null default 'Documentos',
  archivo_url text not null,
  archivo_path text,
  nombre_archivo text not null,
  mime_type text not null default 'application/pdf',
  tamano_bytes bigint not null default 0,
  publicado boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists parish_files_set_updated_at on public.parish_files;
create trigger parish_files_set_updated_at
  before update on public.parish_files
  for each row execute function public.set_updated_at();

alter table public.parish_files enable row level security;

drop policy if exists "parish_files_public_read" on public.parish_files;
create policy "parish_files_public_read"
  on public.parish_files for select
  to anon, authenticated
  using (publicado = true);

drop policy if exists "parish_files_admin_read" on public.parish_files;
create policy "parish_files_admin_read"
  on public.parish_files for select
  to authenticated
  using (public.is_admin());

drop policy if exists "parish_files_admin_all" on public.parish_files;
create policy "parish_files_admin_all"
  on public.parish_files for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 12. service_requests (Formularios de peticiones y solicitudes de servicios)
-- ---------------------------------------------------------------------------

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  servicio_slug text not null default 'general',
  servicio_nombre text not null default 'Consulta general',
  tipo_peticion text not null default 'informacion',
  nombre_solicitante text not null,
  email text not null,
  telefono text not null,
  fecha_preferida date,
  mensaje text not null,
  consentimiento boolean not null default false,
  estado text not null default 'nueva' check (estado in ('nueva', 'en_proceso', 'atendida', 'archivada')),
  notas_admin text not null default '',
  notificado_gmail boolean not null default false,
  notificado_en timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_requests_estado_created_idx
  on public.service_requests (estado, created_at desc);

drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

alter table public.service_requests enable row level security;

-- El público general solo puede CREAR solicitudes válidas con consentimiento;
-- jamás leer, editar ni borrar las solicitudes de otras personas.
drop policy if exists "service_requests_public_insert" on public.service_requests;
create policy "service_requests_public_insert"
  on public.service_requests for insert
  to anon, authenticated
  with check (
    consentimiento = true
    and length(trim(nombre_solicitante)) >= 2
    and length(trim(telefono)) >= 5
    and length(trim(mensaje)) >= 5
  );

drop policy if exists "service_requests_admin_read" on public.service_requests;
create policy "service_requests_admin_read"
  on public.service_requests for select
  to authenticated
  using (public.is_admin());

drop policy if exists "service_requests_admin_all" on public.service_requests;
create policy "service_requests_admin_all"
  on public.service_requests for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 13. Storage buckets (Flyers, Momentos, Banners, Promociones, Comercios, Archivos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('event-flyers', 'event-flyers', true),
  ('moments', 'moments', true),
  ('hero-banners', 'hero-banners', true),
  ('promotions', 'promotions', true),
  ('community-businesses', 'community-businesses', true),
  ('parish-files', 'parish-files', true)
on conflict (id) do nothing;

drop policy if exists "storage_public_read_all_parish_buckets" on storage.objects;
create policy "storage_public_read_all_parish_buckets"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id in (
      'event-flyers',
      'moments',
      'hero-banners',
      'promotions',
      'community-businesses',
      'parish-files'
    )
  );

drop policy if exists "storage_admin_write_all_parish_buckets" on storage.objects;
create policy "storage_admin_write_all_parish_buckets"
  on storage.objects for all
  to authenticated
  using (
    bucket_id in (
      'event-flyers',
      'moments',
      'hero-banners',
      'promotions',
      'community-businesses',
      'parish-files'
    )
    and public.is_admin()
  )
  with check (
    bucket_id in (
      'event-flyers',
      'moments',
      'hero-banners',
      'promotions',
      'community-businesses',
      'parish-files'
    )
    and public.is_admin()
  );

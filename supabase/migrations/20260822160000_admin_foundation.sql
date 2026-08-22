-- Fundación admin — Parroquia San Chárbel
-- Aplicar en Supabase → SQL Editor (proyecto DEV).
-- No contiene service_role ni secretos.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

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
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

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
-- events
-- ---------------------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  resumen text not null default '',
  fecha_inicio date not null,
  fecha_fin date,
  hora time,
  lugar text,
  flyer_url text,
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins need to see unpublished rows too:
drop policy if exists "events_admin_read_all" on public.events;
create policy "events_admin_read_all"
  on public.events for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- mass_schedules
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
-- site_settings (fila única)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  nombre text not null default 'Parroquia San Chárbel',
  direccion text not null default '',
  barrio text not null default '',
  ciudad text not null default '',
  departamento text not null default '',
  telefono_fijo text,
  telefono_movil text,
  email text,
  whatsapp text,
  facebook text,
  instagram text,
  youtube text,
  mapa_lat double precision,
  mapa_lng double precision,
  mapa_zoom integer default 17,
  mapa_ficha text,
  revisado_en date,
  updated_at timestamptz not null default now()
);

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

insert into public.site_settings (id, nombre, direccion, barrio, ciudad, departamento)
values ('default', 'Parroquia San Chárbel', 'Calle 98 # 65-120', 'Villa Carolina', 'Barranquilla', 'Atlántico')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- gallery_moments
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_moments (
  id uuid primary key default gen_random_uuid(),
  imagen_url text not null,
  alt text not null default '',
  orden integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
-- parish_services (lista abierta)
-- ---------------------------------------------------------------------------

create table if not exists public.parish_services (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion_corta text not null default '',
  descripcion_modal text not null default '',
  icono text not null default 'cross',
  form_embed_url text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
-- hero_slides
-- ---------------------------------------------------------------------------

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  imagen_url text not null,
  titulo text,
  enlace text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
-- Storage buckets
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('event-flyers', 'event-flyers', true),
  ('moments', 'moments', true),
  ('hero-banners', 'hero-banners', true)
on conflict (id) do nothing;

drop policy if exists "storage_public_read_event_flyers" on storage.objects;
create policy "storage_public_read_event_flyers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-flyers');

drop policy if exists "storage_public_read_moments" on storage.objects;
create policy "storage_public_read_moments"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'moments');

drop policy if exists "storage_public_read_hero_banners" on storage.objects;
create policy "storage_public_read_hero_banners"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'hero-banners');

drop policy if exists "storage_admin_write_event_flyers" on storage.objects;
create policy "storage_admin_write_event_flyers"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'event-flyers' and public.is_admin())
  with check (bucket_id = 'event-flyers' and public.is_admin());

drop policy if exists "storage_admin_write_moments" on storage.objects;
create policy "storage_admin_write_moments"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'moments' and public.is_admin())
  with check (bucket_id = 'moments' and public.is_admin());

drop policy if exists "storage_admin_write_hero_banners" on storage.objects;
create policy "storage_admin_write_hero_banners"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'hero-banners' and public.is_admin())
  with check (bucket_id = 'hero-banners' and public.is_admin());

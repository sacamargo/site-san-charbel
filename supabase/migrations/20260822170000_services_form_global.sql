-- Un solo Google Form para todos los servicios (no uno por fila).
alter table public.site_settings
  add column if not exists services_form_url text;

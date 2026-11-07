/**
 * Consultas de configuración global del sitio (`site_settings` en Supabase)
 * con fallback seguro a `src/data/parroquia.ts`.
 */
import { parroquia } from '@/data/parroquia';
import { getPublicSupabaseClient } from '@/db/supabase';

export interface SiteSettings {
  nombre: string;
  nombreCorto: string;
  patrono: string;
  tagline: string;
  heroEyebrow: string;
  heroTitulo: string;
  heroSubtitulo: string;
  santoTitulo: string;
  santoTexto: string;
  footerCita: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  departamento: string;
  pais: string;
  telefonoFijo: string;
  telefonoMovil: string;
  email: string;
  notificationGmail: string;
  gmailWebhookUrl: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  servicesFormUrl: string | null;
  mapa: {
    lat: number;
    lng: number;
    zoom: number;
    ficha: string;
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    nombre: parroquia.nombre,
    nombreCorto: parroquia.nombreCorto,
    patrono: parroquia.patrono,
    tagline: parroquia.tagline,
    heroEyebrow: 'Bienvenido a',
    heroTitulo: parroquia.nombre,
    heroSubtitulo:
      'Somos una comunidad que ora, celebra y sirve con amor, bajo la intercesión de San Chárbel Makhlouf.',
    santoTitulo: 'San Chárbel, ruega por nosotros',
    santoTexto:
      'San Chárbel Makhlouf, santo libanés del siglo XIX, ejemplo de oración, humildad y entrega a Dios. Su vida sigue inspirando a miles de fieles en el mundo.',
    footerCita:
      '«Que el Señor de los Milagros y San Chárbel guíen y bendigan a nuestra comunidad.»',
    direccion: parroquia.direccion,
    barrio: parroquia.barrio,
    ciudad: parroquia.ciudad,
    departamento: parroquia.departamento,
    pais: parroquia.pais,
    telefonoFijo: parroquia.telefonoFijo,
    telefonoMovil: parroquia.telefonoMovil,
    email: parroquia.email,
    notificationGmail: parroquia.email,
    gmailWebhookUrl: null,
    whatsapp: parroquia.whatsapp,
    facebook: parroquia.facebook,
    instagram: parroquia.instagram,
    youtube: parroquia.youtube,
    servicesFormUrl: null,
    mapa: {
      lat: parroquia.mapa.lat,
      lng: parroquia.mapa.lng,
      zoom: parroquia.mapa.zoom,
      ficha: parroquia.mapa.ficha,
    },
  };

  const client = getPublicSupabaseClient();
  if (!client) return defaults;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return defaults;

    return {
      ...defaults,
      nombre: data.nombre || defaults.nombre,
      tagline: data.tagline || defaults.tagline,
      heroEyebrow: data.hero_eyebrow || defaults.heroEyebrow,
      heroTitulo: data.hero_titulo || defaults.heroTitulo,
      heroSubtitulo: data.hero_subtitulo || defaults.heroSubtitulo,
      santoTitulo: data.santo_titulo || defaults.santoTitulo,
      santoTexto: data.santo_texto || defaults.santoTexto,
      footerCita: data.footer_cita || defaults.footerCita,
      direccion: data.direccion || defaults.direccion,
      barrio: data.barrio || defaults.barrio,
      ciudad: data.ciudad || defaults.ciudad,
      departamento: data.departamento || defaults.departamento,
      telefonoFijo: data.telefono_fijo || defaults.telefonoFijo,
      telefonoMovil: data.telefono_movil || defaults.telefonoMovil,
      email: data.email || defaults.email,
      notificationGmail: data.notification_gmail || data.email || defaults.notificationGmail,
      gmailWebhookUrl: data.gmail_webhook_url || null,
      whatsapp: data.whatsapp ?? defaults.whatsapp,
      facebook: data.facebook ?? defaults.facebook,
      instagram: data.instagram ?? defaults.instagram,
      youtube: data.youtube ?? defaults.youtube,
      servicesFormUrl: data.services_form_url ?? null,
      mapa: {
        lat: typeof data.mapa_lat === 'number' ? data.mapa_lat : defaults.mapa.lat,
        lng: typeof data.mapa_lng === 'number' ? data.mapa_lng : defaults.mapa.lng,
        zoom: typeof data.mapa_zoom === 'number' ? data.mapa_zoom : defaults.mapa.zoom,
        ficha: data.mapa_ficha || defaults.mapa.ficha,
      },
    };
  } catch {
    return defaults;
  }
}

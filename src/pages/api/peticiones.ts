import type { APIRoute } from 'astro';
import { getPublicSupabaseClient } from '@/db/supabase';
import {
  buildGmailComposeUrl,
  sendRequestToGmail,
  type ServiceRequestPayload,
} from '@/lib/admin/gmail-notify';
import { verifySameOrigin } from '@/lib/admin/security';
import { getSiteSettings } from '@/lib/queries/settings';
import { getServicios } from '@/lib/queries/servicios';

export const POST: APIRoute = async ({ request, redirect, url }) => {
  const acceptsJson = (request.headers.get('accept') || '').includes('application/json');

  if (!verifySameOrigin(request)) {
    if (acceptsJson) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Origen de petición no válido.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
    }
    return redirect('/peticiones?estado=error', 303);
  }

  const form = await request.formData();

  // Honeypot anti-bots
  const honeypot = String(form.get('website_url') ?? '').trim();
  if (honeypot) {
    if (acceptsJson) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirect('/peticiones?estado=enviado', 303);
  }

  const servicioSlug = String(form.get('servicio_slug') ?? 'general').trim() || 'general';
  const tipoPeticion = String(form.get('tipo_peticion') ?? 'Solicitud de servicio').trim();
  const nombreSolicitante = String(form.get('nombre_solicitante') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const telefono = String(form.get('telefono') ?? '').trim();
  const fechaPreferida = String(form.get('fecha_preferida') ?? '').trim() || null;
  const mensaje = String(form.get('mensaje') ?? '').trim();
  const consentimiento = form.get('consentimiento') === 'on' || form.get('consentimiento') === 'true';
  const returnTo = String(form.get('return_to') ?? '/peticiones').trim();
  const safeReturn =
    returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/peticiones';

  if (
    nombreSolicitante.length < 2 ||
    telefono.length < 5 ||
    !email.includes('@') ||
    mensaje.length < 5 ||
    !consentimiento
  ) {
    if (acceptsJson) {
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            'Por favor completa tu nombre, teléfono, correo electrónico, detalle de la petición y acepta el tratamiento de datos.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    const target = new URL(safeReturn, url);
    target.searchParams.set('estado', 'incompleto');
    return redirect(`${target.pathname}${target.search}#formulario-peticion`, 303);
  }

  const listaServicios = await getServicios();
  const catalogoExtra: Record<string, string> = {
    'intencion-misa': 'Intención de Misa / Oración',
    'bendicion-hogar': 'Bendición de hogar o negocio',
    'grupos-parroquiales': 'Grupos parroquiales y apostolados',
    'emprendimiento': 'Registro de emprendimiento parroquial',
    general: 'Consulta general al despacho',
  };

  const servicioEncontrado = listaServicios.find((s) => s.slug === servicioSlug);
  const servicioNombre =
    servicioEncontrado?.nombre ||
    catalogoExtra[servicioSlug] ||
    String(form.get('servicio_nombre') ?? 'Servicio parroquial');

  const payload: ServiceRequestPayload = {
    servicio_slug: servicioSlug,
    servicio_nombre: servicioNombre,
    tipo_peticion: tipoPeticion,
    nombre_solicitante: nombreSolicitante,
    email,
    telefono,
    fecha_preferida: fechaPreferida,
    mensaje,
    created_at: new Date().toISOString(),
  };

  const settings = await getSiteSettings();
  const notifyResult = await sendRequestToGmail(payload, {
    targetGmail: settings.notificationGmail,
    webhookUrl: settings.gmailWebhookUrl,
  });

  const client = getPublicSupabaseClient();
  if (client) {
    try {
      await client.from('service_requests').insert({
        servicio_slug: payload.servicio_slug,
        servicio_nombre: payload.servicio_nombre,
        tipo_peticion: payload.tipo_peticion,
        nombre_solicitante: payload.nombre_solicitante,
        email: payload.email,
        telefono: payload.telefono,
        fecha_preferida: payload.fecha_preferida,
        mensaje: payload.mensaje,
        consentimiento: true,
        notificado_gmail: notifyResult.sent,
        notificado_en: notifyResult.sent ? new Date().toISOString() : null,
      });
    } catch (err) {
      console.error('[api/peticiones] No se pudo insertar en Supabase:', err);
    }
  }

  const gmailFallbackUrl = buildGmailComposeUrl(
    settings.notificationGmail,
    payload,
    'forward_to_parish',
  );

  if (acceptsJson) {
    return new Response(
      JSON.stringify({
        ok: true,
        notifiedAutomatically: notifyResult.sent,
        notificationGmail: settings.notificationGmail,
        gmailComposeUrl: gmailFallbackUrl,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const target = new URL(safeReturn, url);
  target.searchParams.set('estado', 'enviado');
  return redirect(`${target.pathname}${target.search}#formulario-peticion`, 303);
};

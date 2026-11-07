/**
 * Notificación y reenvío de formularios de peticiones a un correo Gmail.
 *
 * Soporta tres mecanismos complementarios:
 *   1. Envío automático servidor-a-servidor mediante Webhook de Google Apps Script
 *      (`gmail_webhook_url` en `site_settings` o `GMAIL_WEBHOOK_URL` en `.env`)
 *      o API de Resend (`RESEND_API_KEY`).
 *   2. Enlace directo a Gmail Web Compose (`https://mail.google.com/mail/?view=cm...`)
 *      prellenado con destinatario, asunto y cuerpo completo.
 *   3. Enlace `mailto:` estándar para cualquier cliente de correo.
 */

export interface ServiceRequestPayload {
  id?: string;
  servicio_slug: string;
  servicio_nombre: string;
  tipo_peticion: string;
  nombre_solicitante: string;
  email: string;
  telefono: string;
  fecha_preferida?: string | null;
  mensaje: string;
  created_at?: string;
}

export function formatRequestEmailSubject(req: ServiceRequestPayload): string {
  return `[Parroquia San Chárbel] Nueva solicitud: ${req.servicio_nombre} — ${req.nombre_solicitante}`;
}

export function formatRequestEmailBody(req: ServiceRequestPayload): string {
  const lines = [
    'PARROQUIA SAN CHÁRBEL — SOLICITUD DESDE LA PÁGINA WEB',
    '======================================================',
    '',
    `Servicio / Sacramento: ${req.servicio_nombre}`,
    `Tipo de petición:      ${req.tipo_peticion}`,
    `Solicitante:           ${req.nombre_solicitante}`,
    `Teléfono / WhatsApp:   ${req.telefono}`,
    `Correo electrónico:    ${req.email}`,
    `Fecha preferida:       ${req.fecha_preferida || 'No especificada'}`,
    `Fecha de registro:     ${req.created_at ? new Date(req.created_at).toLocaleString('es-CO') : new Date().toLocaleString('es-CO')}`,
    '',
    'Mensaje / Detalle de la petición:',
    '---------------------------------',
    req.mensaje,
    '',
    '---------------------------------',
    'Gestionado desde el Dashboard de la Parroquia San Chárbel.',
  ];
  return lines.join('\n');
}

/**
 * Construye una URL que abre directamente Gmail en el navegador con el correo
 * listo para enviar al Gmail de la parroquia (o para responder al solicitante).
 */
export function buildGmailComposeUrl(
  toEmail: string,
  req: ServiceRequestPayload,
  mode: 'forward_to_parish' | 'reply_to_requester' = 'forward_to_parish',
): string {
  const to = mode === 'forward_to_parish' ? toEmail : req.email;
  const su =
    mode === 'forward_to_parish'
      ? formatRequestEmailSubject(req)
      : `Respuesta de la Parroquia San Chárbel — ${req.servicio_nombre}`;
  const body =
    mode === 'forward_to_parish'
      ? formatRequestEmailBody(req)
      : [
          `Estimado(a) ${req.nombre_solicitante}:`,
          '',
          `Recibimos en la Parroquia San Chárbel tu solicitud sobre "${req.servicio_nombre}".`,
          '',
          'Con gusto te orientamos:',
          '',
          '',
          'Fraternalmente,',
          'Despacho Parroquial — Parroquia San Chárbel',
          'Villa Carolina, Barranquilla',
        ].join('\n');

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to,
    su,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildMailtoUrl(toEmail: string, req: ServiceRequestPayload): string {
  const params = new URLSearchParams({
    subject: formatRequestEmailSubject(req),
    body: formatRequestEmailBody(req),
  });
  return `mailto:${encodeURIComponent(toEmail)}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Intenta enviar automáticamente la solicitud al correo Gmail configurado.
 * Nunca lanza excepción para no bloquear el guardado en base de datos.
 */
export async function sendRequestToGmail(
  req: ServiceRequestPayload,
  options: {
    targetGmail?: string | null;
    webhookUrl?: string | null;
  } = {},
): Promise<{ sent: boolean; channel: 'webhook' | 'resend' | 'none' }> {
  const toEmail =
    options.targetGmail?.trim() ||
    'info@parroquiasancharbel.org';

  const webhookUrl =
    options.webhookUrl?.trim() ||
    import.meta.env.GMAIL_WEBHOOK_URL?.trim() ||
    '';

  const subject = formatRequestEmailSubject(req);
  const text = formatRequestEmailBody(req);

  // 1. Webhook de Google Apps Script (Gmail nativo sin costo) o webhook HTTP
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          replyTo: req.email,
          subject,
          text,
          request: req,
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (response.ok) {
        return { sent: true, channel: 'webhook' };
      }
    } catch (err) {
      console.error('[gmail-notify] Error en webhook:', err);
    }
  }

  // 2. Resend API (si RESEND_API_KEY está configurada)
  const resendKey = import.meta.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Parroquia San Chárbel <notificaciones@parroquiasancharbel.org>',
          to: [toEmail],
          reply_to: req.email,
          subject,
          text,
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (response.ok) {
        return { sent: true, channel: 'resend' };
      }
    } catch (err) {
      console.error('[gmail-notify] Error en Resend:', err);
    }
  }

  return { sent: false, channel: 'none' };
}

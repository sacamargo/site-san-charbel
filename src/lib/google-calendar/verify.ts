/**
 * Verificación de la conexión con Google Calendar.
 *
 * Pensada para el momento de conectar un calendario: una sola llamada
 * liviana (metadata del calendario, no eventos) que confirma que el ID y la
 * clave de API funcionan juntos, y devuelve la identidad real del calendario
 * para que quien lo conecta pueda confirmar a simple vista que es el
 * correcto.
 *
 * Nace de un error real: se probó la integración contra el calendario
 * PRINCIPAL de una cuenta ajena a la parroquia en vez de un calendario
 * secundario dedicado — público, con todos los detalles visibles. Esta
 * función no puede saber "de quién debería ser" el calendario, pero sí puede
 * mostrar su nombre para que un humano lo confirme, y avisar cuando el ID
 * tiene la forma de un calendario principal en vez de uno dedicado.
 */

import { describeGoogleCalendarFailure } from './errors';
import type { AgendaConfig } from './config';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars';
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * No se usa `GET /calendars/{id}` (metadata pura) a propósito: en al menos un
 * proyecto de Google Cloud real ese endpoint rechazó la clave de API con 401
 * "API keys are not supported by this API", mientras que `events.list` —el
 * que de verdad usa el sitio— acepta la misma clave sin problema. La
 * respuesta de `events.list` ya trae el `summary`/`description`/`timeZone`
 * del calendario junto con los eventos, así que pedimos una página mínima de
 * ahí: se verifica el endpoint real, no uno con reglas de auth distintas.
 */

/**
 * Un calendario secundario dedicado tiene un ID con esta forma. El
 * calendario principal de una cuenta usa directamente su email como ID —
 * que es justo la confusión que este aviso busca prevenir.
 */
const DEDICATED_CALENDAR_ID = /@group\.calendar\.google\.com$/i;

export interface CalendarIdentity {
  id: string;
  summary: string;
  description: string | null;
  timeZone: string | null;
}

export interface VerifyResult {
  ok: boolean;
  calendar: CalendarIdentity | null;
  /** Avisos que no impiden usar el calendario, pero vale la pena revisar. */
  warnings: string[];
  error: string | null;
}

/**
 * Prueba que `config.calendarId` + `config.apiKey` funcionan juntos contra
 * la Calendar API real. No lanza: cualquier fallo vuelve como
 * `{ ok: false, error }` para que quien llama decida cómo mostrarlo.
 */
export async function verifyGoogleCalendarConnection(config: AgendaConfig): Promise<VerifyResult> {
  const url = new URL(`${CALENDAR_API_BASE}/${encodeURIComponent(config.calendarId)}/events`);
  url.searchParams.set('key', config.apiKey);
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('fields', 'summary,description,timeZone');

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      ok: false,
      calendar: null,
      warnings: [],
      error: `No se pudo contactar a Google: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    return {
      ok: false,
      calendar: null,
      warnings: [],
      error: describeGoogleCalendarFailure(response.status, body),
    };
  }

  const payload = (await response.json()) as {
    summary?: string;
    description?: string;
    timeZone?: string;
  };

  const warnings: string[] = [];
  if (!DEDICATED_CALENDAR_ID.test(config.calendarId)) {
    warnings.push(
      'El ID no tiene la forma "...@group.calendar.google.com" de un calendario secundario dedicado. ' +
        'Si es una dirección de correo normal, es el calendario PRINCIPAL de esa cuenta: confirma que de ' +
        'verdad sea el calendario dedicado de la parroquia y no uno personal o de otra organización.',
    );
  }

  return {
    ok: true,
    calendar: {
      id: config.calendarId,
      summary: payload.summary?.trim() || '(sin nombre)',
      description: payload.description?.trim() || null,
      timeZone: payload.timeZone ?? null,
    },
    warnings,
    error: null,
  };
}

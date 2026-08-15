/**
 * Cliente de lectura de la API de Google Calendar v3.
 *
 * Solo lectura. No hay creación, edición ni eliminación de eventos desde la
 * aplicación, y no la va a haber: la parroquia administra la agenda
 * directamente en Google Calendar.
 *
 * Usa una clave de API (no OAuth) porque el calendario es público. La clave
 * vive solo en el servidor.
 */

import { TIME_ZONE } from '@/lib/format';
import type { AgendaConfig } from './config';

const API_BASE = 'https://www.googleapis.com/calendar/v3/calendars';

/** Si Google tarda más que esto, servimos lo que haya en caché. */
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * Tope de páginas por consulta: 8 × 250 = 2000 eventos.
 *
 * No es un número arbitrario. Con `singleEvents=true` cada repetición de un
 * evento recurrente cuenta como una entrada, así que una misa diaria produce
 * unos 365 eventos al año. Dos series diarias en una ventana de 13 meses ya
 * pasan de 750, que era el tope anterior — y la cola se perdía sin avisar.
 *
 * Si alguna vez se alcanza este tope, se registra en consola: un recorte
 * silencioso se lee como "está todo" cuando no lo está.
 */
const MAX_PAGES = 8;
const PAGE_SIZE = 250;

export interface GoogleEventDate {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface GoogleEvent {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: GoogleEventDate;
  end?: GoogleEventDate;
}

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'GoogleCalendarError';
  }
}

function describeFailure(status: number, body: string): string {
  if (status === 404) {
    return 'El calendario no existe o no está marcado como público.';
  }
  if (status === 403) {
    return 'La clave de API fue rechazada: revisa que la Calendar API esté habilitada y que las restricciones de la clave permitan este uso.';
  }
  if (status === 400) {
    return `Google rechazó los parámetros de la consulta. ${body.slice(0, 200)}`;
  }
  return `Google respondió ${status}. ${body.slice(0, 200)}`;
}

/**
 * Trae los eventos entre dos instantes, ya expandidos: `singleEvents=true`
 * convierte cada repetición de un evento recurrente en una entrada propia,
 * que es justo lo que necesita un calendario de solo lectura.
 */
export async function fetchEvents(
  config: AgendaConfig,
  range: { timeMin: Date; timeMax: Date },
): Promise<GoogleEvent[]> {
  const events: GoogleEvent[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`${API_BASE}/${encodeURIComponent(config.calendarId)}/events`);
    url.searchParams.set('key', config.apiKey);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('showDeleted', 'false');
    url.searchParams.set('timeZone', TIME_ZONE);
    url.searchParams.set('timeMin', range.timeMin.toISOString());
    url.searchParams.set('timeMax', range.timeMax.toISOString());
    url.searchParams.set('maxResults', String(PAGE_SIZE));
    // Pedimos solo los campos que usamos: la respuesta completa de Google trae
    // asistentes, organizadores y recordatorios que aquí no pintan nada.
    url.searchParams.set(
      'fields',
      'nextPageToken,items(id,status,summary,description,location,htmlLink,start,end)',
    );
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new GoogleCalendarError(describeFailure(response.status, body), response.status);
    }

    const payload = (await response.json()) as {
      items?: GoogleEvent[];
      nextPageToken?: string;
    };

    events.push(...(payload.items ?? []));

    pageToken = payload.nextPageToken;
    if (!pageToken) break;

    if (page === MAX_PAGES - 1) {
      console.warn(
        `[agenda] Se alcanzó el tope de ${MAX_PAGES * PAGE_SIZE} eventos y el calendario tiene más. ` +
          'La agenda queda incompleta al final de la ventana. Revisa si hay eventos recurrentes ' +
          'sin fecha de fin, o reduce WINDOW_MONTHS_FORWARD en src/lib/agenda/window.ts.',
      );
    }
  }

  return events;
}

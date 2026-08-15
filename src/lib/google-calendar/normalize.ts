/**
 * Traducción de un evento de Google al `ParishEvent` que consume el sitio.
 *
 * Aquí vive la parte fea del asunto: Google devuelve descripciones en HTML,
 * envuelve los enlaces salientes en un redirector propio, y da la fecha de fin
 * de los eventos de todo el día de forma **exclusiva**.
 */

import { UTC_OFFSET } from '@/lib/agenda/format';
import type { ParishEvent } from '@/lib/types';
import type { GoogleEvent, GoogleEventDate } from './client';

/**
 * Convención de flyers acordada: la parroquia pega la URL de la imagen en la
 * descripción del evento, idealmente con una etiqueta. Los tres se aceptan:
 *
 *     Flyer: https://…/afiche.jpg
 *     Afiche: https://drive.google.com/file/d/ABC123/view
 *     https://…/afiche.png            (sin etiqueta, si es la única imagen)
 */
const FLYER_LABEL = /(?:flyer|afiche|imagen|pieza|cartel)\s*[:\-–]\s*(https?:\/\/\S+)/i;

const IMAGE_URL = /\.(?:jpe?g|png|webp|avif|gif)(?:\?[^\s]*)?$/i;
const DRIVE_FILE = /drive\.google\.com\/file\/d\/([\w-]+)/i;
const DRIVE_OPEN = /drive\.google\.com\/(?:open|uc)\?[^\s]*[?&]id=([\w-]+)/i;

const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39|apos);/g, (match) => ENTITIES[match] ?? match)
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)));
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|div|li|tr|h[1-6])>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Google reescribe los enlaces como `google.com/url?q=…`. Deshacemos eso. */
function unwrapRedirect(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('google.com') && parsed.pathname === '/url') {
      const target = parsed.searchParams.get('q') ?? parsed.searchParams.get('url');
      if (target) return target;
    }
  } catch {
    // Una URL malformada no vale un error: se devuelve intacta.
  }
  return url;
}

function collectUrls(html: string): string[] {
  const found: string[] = [];

  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    found.push(decodeEntities(match[1]!));
  }
  for (const match of htmlToText(html).matchAll(/https?:\/\/[^\s<>"')\]]+/gi)) {
    found.push(match[0]);
  }

  return [...new Set(found.map(unwrapRedirect))];
}

/**
 * Un enlace de Drive "para ver" no sirve como `src` de una imagen. Se traduce
 * a la forma de descarga directa, que sí se puede incrustar.
 */
function toDirectImageUrl(url: string): string {
  const driveId = url.match(DRIVE_FILE)?.[1] ?? url.match(DRIVE_OPEN)?.[1];
  return driveId ? `https://drive.google.com/uc?export=view&id=${driveId}` : url;
}

function looksLikeImage(url: string): boolean {
  return IMAGE_URL.test(url) || DRIVE_FILE.test(url) || DRIVE_OPEN.test(url);
}

export function extractFlyer(rawDescription: string | undefined): {
  flyerUrl: string | null;
  description: string | null;
} {
  if (!rawDescription?.trim()) return { flyerUrl: null, description: null };

  const text = htmlToText(rawDescription);
  const labelled = text.match(FLYER_LABEL);
  const candidate = labelled
    ? unwrapRedirect(labelled[1]!)
    : (collectUrls(rawDescription).find(looksLikeImage) ?? null);

  let description = text;
  if (labelled) {
    description = description.replace(labelled[0], '');
  }
  if (candidate) {
    // La URL cruda también sobra en el texto visible: ya se muestra como imagen.
    description = description.split(candidate).join('');
  }
  description = description
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    flyerUrl: candidate ? toDirectImageUrl(candidate) : null,
    description: description || null,
  };
}

/** Un evento es "de todo el día" cuando Google manda `date` en vez de `dateTime`. */
function isAllDay(start: GoogleEventDate | undefined): boolean {
  return Boolean(start?.date && !start.dateTime);
}

/** `YYYY-MM-DD` → instante en Bogotá. Colombia es UTC-5 fijo, sin verano. */
function parseAllDay(date: string, endOfDay: boolean): Date {
  const time = endOfDay ? '23:59:59.999' : '00:00:00.000';
  return new Date(`${date}T${time}${UTC_OFFSET}`);
}

function shiftDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number];
  const shifted = new Date(Date.UTC(year, month - 1, day + days, 12));
  return shifted.toISOString().slice(0, 10);
}

/**
 * Devuelve `null` para todo lo que no se pueda mostrar con honestidad:
 * eventos cancelados, sin título o sin fecha de inicio.
 */
export function toParishEvent(item: GoogleEvent): ParishEvent | null {
  if (!item.id || item.status === 'cancelled') return null;

  const title = item.summary?.trim();
  if (!title) return null;

  const allDay = isAllDay(item.start);
  let start: Date;
  let end: Date;

  if (allDay) {
    const startDate = item.start?.date;
    if (!startDate) return null;
    start = parseAllDay(startDate, false);
    // Google da el fin exclusivo: un evento de un solo día llega como
    // start 2026-07-03 / end 2026-07-04. Lo pasamos a inclusivo.
    const rawEnd = item.end?.date;
    const lastDay = rawEnd ? shiftDays(rawEnd, -1) : startDate;
    end = parseAllDay(lastDay < startDate ? startDate : lastDay, true);
  } else {
    const startIso = item.start?.dateTime;
    if (!startIso) return null;
    start = new Date(startIso);
    end = item.end?.dateTime ? new Date(item.end.dateTime) : start;
  }

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (end < start) end = start;

  const { flyerUrl, description } = extractFlyer(item.description);

  return {
    id: item.id,
    title,
    description,
    start,
    end,
    allDay,
    location: item.location?.trim() || null,
    flyerUrl,
    sourceUrl: item.htmlLink ?? null,
  };
}

export function toParishEvents(items: GoogleEvent[]): ParishEvent[] {
  return items
    .map(toParishEvent)
    .filter((event): event is ParishEvent => event !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

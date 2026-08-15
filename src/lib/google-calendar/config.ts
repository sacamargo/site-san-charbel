/**
 * Configuración de la agenda leída del entorno.
 *
 * `process.env` primero, `import.meta.env` como respaldo: con el adaptador de
 * Node las variables se resuelven en tiempo de ejecución, no de compilación.
 * Así el mismo build sirve para DEV y PROD sin recompilar.
 */

export type AgendaSource = 'api' | 'embed';

export interface AgendaConfig {
  calendarId: string;
  apiKey: string;
  source: AgendaSource;
  ttlMs: number;
  staleMs: number;
}

function readEnv(name: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const value = fromProcess ?? fromImport;
  return value?.trim() ? value.trim() : undefined;
}

function readSeconds(name: string, fallbackSeconds: number): number {
  const raw = readEnv(name);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return (Number.isFinite(parsed) && parsed >= 0 ? parsed : fallbackSeconds) * 1000;
}

/** La fuente elegida por el equipo. Por defecto, el render propio. */
export function readSource(): AgendaSource {
  return readEnv('AGENDA_SOURCE') === 'embed' ? 'embed' : 'api';
}

/**
 * El ID del calendario público. Se necesita también en la variante `embed`,
 * donde va dentro del `src` del iframe. No es un secreto: el calendario es
 * público por diseño. La clave de API sí lo es y nunca sale de aquí.
 */
export function readCalendarId(): string | null {
  return readEnv('GOOGLE_CALENDAR_ID') ?? null;
}

/** `null` si falta algo. La página lo traduce a un estado `not-configured`. */
export function readConfig(): AgendaConfig | null {
  const calendarId = readCalendarId();
  const apiKey = readEnv('GOOGLE_CALENDAR_API_KEY');
  if (!calendarId || !apiKey) return null;

  return {
    calendarId,
    apiKey,
    source: readSource(),
    ttlMs: readSeconds('AGENDA_CACHE_TTL_SECONDS', 600),
    staleMs: readSeconds('AGENDA_CACHE_STALE_SECONDS', 86_400),
  };
}

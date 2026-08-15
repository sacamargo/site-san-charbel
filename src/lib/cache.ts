/**
 * Caché en memoria con revalidación en segundo plano.
 *
 * El requisito de la agenda es explícito: no depender de una llamada a la API
 * en cada interacción, y no bloquear la página. Esta caché cubre las dos cosas.
 *
 *   fresca            → se devuelve tal cual, sin tocar la red
 *   vieja pero viva   → se devuelve al instante y se revalida por detrás
 *   caída de Google   → se devuelve la copia vieja marcada como `stale`
 *
 * Vive en el proceso del adaptador de Node, así que se pierde en cada
 * despliegue. Es lo correcto para este tamaño: la alternativa (Redis) sería
 * infraestructura nueva para un sitio que hace una llamada cada diez minutos.
 */

interface Entry<T> {
  value: T;
  fetchedAt: number;
  freshUntil: number;
  staleUntil: number;
}

export interface CacheOptions {
  /** Milisegundos durante los que el valor se considera fresco. */
  ttlMs: number;
  /** Milisegundos adicionales durante los que se acepta servir la copia vieja. */
  staleMs: number;
}

export interface CacheHit<T> {
  value: T;
  /** `true` si lo que se devuelve no es una respuesta fresca. */
  stale: boolean;
  fetchedAt: Date;
}

const store = new Map<string, Entry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

async function load<T>(
  key: string,
  options: CacheOptions,
  loader: () => Promise<T>,
): Promise<Entry<T>> {
  const pending = inFlight.get(key) as Promise<Entry<T>> | undefined;
  if (pending) return pending;

  const promise = (async () => {
    const value = await loader();
    const now = Date.now();
    const entry: Entry<T> = {
      value,
      fetchedAt: now,
      freshUntil: now + options.ttlMs,
      staleUntil: now + options.ttlMs + options.staleMs,
    };
    store.set(key, entry);
    return entry;
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, promise);
  return promise;
}

export async function withCache<T>(
  key: string,
  options: CacheOptions,
  loader: () => Promise<T>,
): Promise<CacheHit<T>> {
  const now = Date.now();
  const entry = store.get(key) as Entry<T> | undefined;

  if (entry && now < entry.freshUntil) {
    return { value: entry.value, stale: false, fetchedAt: new Date(entry.fetchedAt) };
  }

  if (entry && now < entry.staleUntil) {
    // Servimos ya y revalidamos por detrás. El fallo se traga a propósito:
    // la próxima petición lo volverá a intentar y el visitante no se entera.
    void load(key, options, loader).catch(() => undefined);
    return { value: entry.value, stale: true, fetchedAt: new Date(entry.fetchedAt) };
  }

  try {
    const fresh = await load(key, options, loader);
    return { value: fresh.value, stale: false, fetchedAt: new Date(fresh.fetchedAt) };
  } catch (error) {
    if (entry) {
      // Google se cayó y la copia ya venció, pero una agenda vieja informa más
      // que una página vacía. Se muestra con aviso.
      return { value: entry.value, stale: true, fetchedAt: new Date(entry.fetchedAt) };
    }
    throw error;
  }
}

/** Solo para pruebas. */
export function clearCache(): void {
  store.clear();
  inFlight.clear();
}

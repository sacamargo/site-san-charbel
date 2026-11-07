import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { wrapWithHybridFallback } from '@/lib/admin/local-store';

/**
 * Cliente Supabase para lectura/escritura desde el servidor (frontmatter de
 * .astro, consultas públicas con fallback local).
 *
 * Incluye:
 * - Detección de valores de ejemplo (`tu-proyecto`, `tu_clave`)
 * - Caché en memoria de 30s para lecturas `GET /rest/v1/*` (se invalida al
 *   instante ante cualquier escritura POST/PATCH/PUT/DELETE desde el Dashboard)
 * - Timeout de 1.5s por petición y cortacircuitos de 60s si Supabase no responde
 */
export function isPlaceholderSupabaseConfig(url?: string, key?: string): boolean {
  if (!url || !key) return true;
  const u = url.trim().toLowerCase();
  const k = key.trim().toLowerCase();
  if (!u.startsWith('http://') && !u.startsWith('https://')) return true;
  if (
    u.includes('tu-proyecto') ||
    u.includes('your-project') ||
    u.includes('example.com') ||
    u.includes('127.0.0.1:54321') ||
    k.includes('tu_clave') ||
    k.includes('your_key') ||
    k.includes('local-placeholder')
  ) {
    return true;
  }
  return false;
}

function readSupabaseConfig(): { url: string; key: string } | null {
  const url =
    import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const key =
    import.meta.env.SUPABASE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (isPlaceholderSupabaseConfig(url, key)) return null;
  return { url: url!, key: key! };
}

let circuitOpenUntil = 0;

interface CachedResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: string;
  expiresAt: number;
}

const restGetCache = new Map<string, CachedResponse>();
const REST_CACHE_TTL_MS = 30_000;

export const resilientSupabaseFetch: typeof fetch = async (input, init) => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const method = (init?.method ?? 'GET').toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    restGetCache.clear();
  }

  if (
    Date.now() < circuitOpenUntil ||
    urlStr.includes('127.0.0.1:54321') ||
    urlStr.includes('tu-proyecto')
  ) {
    return new Response(JSON.stringify({ message: 'Supabase offline / fallback active' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  const isCacheableRestGet = method === 'GET' && urlStr.includes('/rest/v1/');
  if (isCacheableRestGet) {
    const hit = restGetCache.get(urlStr);
    if (hit && Date.now() < hit.expiresAt) {
      return new Response(hit.body, {
        status: hit.status,
        statusText: hit.statusText,
        headers: hit.headers,
      });
    }
  }

  try {
    const timeoutSignal = AbortSignal.timeout(1500);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, timeoutSignal])
      : timeoutSignal;
    const response = await fetch(input, { ...init, signal });
    if (response.status >= 520) {
      circuitOpenUntil = Date.now() + 60_000;
    } else if (isCacheableRestGet) {
      const body = await response.text();
      const headers = Array.from(response.headers.entries());
      restGetCache.set(urlStr, {
        status: response.status,
        statusText: response.statusText,
        headers,
        body,
        expiresAt: Date.now() + REST_CACHE_TTL_MS,
      });
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return response;
  } catch (err) {
    circuitOpenUntil = Date.now() + 60_000;
    throw err;
  }
};

let cachedClient: SupabaseClient | null = null;
let fallbackOnlyClient: SupabaseClient | null = null;

export function getPublicSupabaseClient(): SupabaseClient {
  if (Date.now() < circuitOpenUntil) {
    if (!fallbackOnlyClient) fallbackOnlyClient = wrapWithHybridFallback(null);
    return fallbackOnlyClient;
  }
  if (cachedClient) return cachedClient;
  const cfg = readSupabaseConfig();
  if (!cfg) {
    if (!fallbackOnlyClient) fallbackOnlyClient = wrapWithHybridFallback(null);
    return fallbackOnlyClient;
  }
  const raw = createClient(cfg.url, cfg.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: resilientSupabaseFetch },
  });
  cachedClient = wrapWithHybridFallback(raw);
  return cachedClient;
}

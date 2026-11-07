import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para lectura/escritura desde el servidor (frontmatter de
 * .astro, consultas públicas con fallback local).
 *
 * Incluye timeout de 2.5s por petición y cortacircuitos temporal de 30s si el
 * proyecto de Supabase está pausado o sin red, evitando que las páginas públicas
 * o del dashboard se queden esperando múltiples timeouts en serie.
 */
function readSupabaseConfig(): { url: string; key: string } | null {
  const url =
    import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const key =
    import.meta.env.SUPABASE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;
  return { url, key };
}

let circuitOpenUntil = 0;

export const resilientSupabaseFetch: typeof fetch = async (input, init) => {
  if (Date.now() < circuitOpenUntil) {
    return new Response(JSON.stringify({ message: 'Supabase circuit breaker active' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const timeoutSignal = AbortSignal.timeout(2500);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, timeoutSignal])
      : timeoutSignal;
    return await fetch(input, { ...init, signal });
  } catch (err) {
    circuitOpenUntil = Date.now() + 30_000;
    throw err;
  }
};

let cachedClient: SupabaseClient | null = null;

export function getPublicSupabaseClient(): SupabaseClient | null {
  if (Date.now() < circuitOpenUntil) return null;
  if (cachedClient) return cachedClient;
  const cfg = readSupabaseConfig();
  if (!cfg) return null;
  cachedClient = createClient(cfg.url, cfg.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: resilientSupabaseFetch },
  });
  return cachedClient;
}

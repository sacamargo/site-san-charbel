import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para lectura/escritura desde el servidor (frontmatter de
 * .astro, consultas públicas con fallback local).
 *
 * No lanza excepción al importarse si faltan las variables de entorno (p. ej.
 * en CI o compilación estática sin `.env`): devuelve `null` en
 * `getPublicSupabaseClient()` para que cada consulta caiga limpiamente a los
 * datos locales del repositorio.
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

let cachedClient: SupabaseClient | null = null;

export function getPublicSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const cfg = readSupabaseConfig();
  if (!cfg) return null;
  cachedClient = createClient(cfg.url, cfg.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { resilientSupabaseFetch } from '@/db/supabase';
import type { AstroCookies } from 'astro';

/**
 * Cliente SSR con cookies — autenticación y operaciones protegidas del
 * dashboard (/admin y subdominio admin.*).
 */
export function hasSupabaseConfig(): boolean {
  const url =
    import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const key =
    import.meta.env.SUPABASE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
}

function getSupabaseConfig() {
  const url =
    import.meta.env.SUPABASE_URL ??
    import.meta.env.PUBLIC_SUPABASE_URL ??
    'http://127.0.0.1:54321';
  const key =
    import.meta.env.SUPABASE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.local-placeholder';

  return { url, key };
}

export function createSupabaseServerClient({
  request,
  cookies,
}: {
  request: Request;
  cookies: AstroCookies;
}) {
  const { url, key } = getSupabaseConfig();
  const isHttps = new URL(request.url).protocol === 'https:';
  const cookieDomain = import.meta.env.ADMIN_COOKIE_DOMAIN?.trim() || undefined;

  return createServerClient(url, key, {
    global: {
      fetch: resilientSupabaseFetch,
    },
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, {
            ...options,
            path: options?.path ?? '/',
            sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
            secure: options?.secure ?? isHttps,
            ...(cookieDomain ? { domain: cookieDomain } : {}),
          });
        });
      },
    },
  });
}

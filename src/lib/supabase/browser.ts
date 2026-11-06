import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de navegador — flujos del cliente como recuperación de contraseña.
 */
export function createSupabaseBrowserClient() {
  const url =
    import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const key =
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase no está configurado. Define PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.',
    );
  }

  return createBrowserClient(url, key);
}

/**
 * Autenticación del panel administrativo (/admin y subdominio admin.*).
 *
 * Sin división por roles: cualquier usuario autenticado en el sistema tiene
 * todos los derechos de administración del sitio.
 */
import { createSupabaseServerClient, hasSupabaseConfig } from '@/lib/supabase/server';
import type { AstroCookies } from 'astro';

export async function getAdminSession(request: Request, cookies: AstroCookies) {
  if (!hasSupabaseConfig()) {
    return { supabase: null, user: null, isAdmin: false };
  }

  try {
    const supabase = createSupabaseServerClient({ request, cookies });
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { supabase, user: null, isAdmin: false };
    }

    // Sincronización silenciosa en `profiles` si la tabla existe: todo usuario
    // autenticado recibe derechos completos de administración.
    try {
      await supabase
        .from('profiles')
        .upsert({ user_id: user.id, role: 'admin' }, { onConflict: 'user_id' });
    } catch {
      // Si la tabla aún no fue migrada, no bloqueamos al usuario autenticado.
    }

    return {
      supabase,
      user,
      isAdmin: true,
    };
  } catch {
    return { supabase: null, user: null, isAdmin: false };
  }
}

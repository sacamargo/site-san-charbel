/**
 * Autenticación del panel administrativo (/admin y subdominio admin.*).
 *
 * Sin división por roles: cualquier usuario autenticado en el sistema tiene
 * todos los derechos de administración del sitio.
 *
 * Incluye soporte tanto para cuentas de Supabase Auth como para la credencial
 * maestra de acceso inmediato (`admin@parroquiasancharbel.org` / `SanCharbel2026!`,
 * configurable vía `ADMIN_MASTER_EMAIL` y `ADMIN_MASTER_PASSWORD`).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createSupabaseServerClient, hasSupabaseConfig } from '@/lib/supabase/server';
import type { AstroCookies } from 'astro';
import type { User } from '@supabase/supabase-js';

export const MASTER_SESSION_COOKIE = 'sc_admin_master';

function readEnv(name: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const value = fromProcess ?? fromImport;
  return value?.trim() ? value.trim() : undefined;
}

export function getMasterCredentials() {
  return {
    email: (readEnv('ADMIN_MASTER_EMAIL') ?? 'admin@parroquiasancharbel.org').toLowerCase(),
    password: readEnv('ADMIN_MASTER_PASSWORD') ?? 'SanCharbel2026!',
  };
}

function getSigningSecret(): string {
  return (
    readEnv('ADMIN_SESSION_SECRET') ??
    readEnv('SUPABASE_KEY') ??
    readEnv('PUBLIC_SUPABASE_ANON_KEY') ??
    'san-charbel-admin-hmac-key-2026'
  );
}

export function createMasterSessionToken(email: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 horas
  const payload = `${email.toLowerCase()}|${exp}`;
  const sig = createHmac('sha256', getSigningSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`, 'utf-8').toString('base64url');
}

export function verifyMasterSessionToken(token: string | undefined): { email: string } | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;
    const [email, expStr, sig] = parts as [string, string, string];
    const exp = Number(expStr);
    if (!email || !Number.isFinite(exp) || Date.now() > exp) return null;

    const payload = `${email}|${expStr}`;
    const expectedSig = createHmac('sha256', getSigningSecret()).update(payload).digest('hex');
    const a = Buffer.from(sig, 'utf-8');
    const b = Buffer.from(expectedSig, 'utf-8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    return { email };
  } catch {
    return null;
  }
}

export function matchesMasterCredentials(email: string, password: string): boolean {
  const master = getMasterCredentials();
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== master.email) return false;
  const a = Buffer.from(password, 'utf-8');
  const b = Buffer.from(master.password, 'utf-8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function getAdminSession(request: Request, cookies: AstroCookies) {
  const supabase = hasSupabaseConfig()
    ? createSupabaseServerClient({ request, cookies })
    : null;

  if (supabase) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
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
      }
    } catch {
      // Continuar a verificación de sesión maestra firmada
    }
  }

  const masterCookie = cookies.get(MASTER_SESSION_COOKIE)?.value;
  const masterSession = verifyMasterSessionToken(masterCookie);
  if (masterSession) {
    const fallbackUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: masterSession.email,
      app_metadata: { role: 'admin' },
      user_metadata: { role: 'admin' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    return {
      supabase,
      user: fallbackUser,
      isAdmin: true,
    };
  }

  return { supabase, user: null, isAdmin: false };
}

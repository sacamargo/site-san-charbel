import type { AstroCookies } from 'astro';

const CSRF_COOKIE = 'sc_admin_csrf';
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

/**
 * Extrae la IP del cliente desde cabeceras de proxy (Vercel / Cloudflare) o fallback.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('cf-connecting-ip')?.trim() ||
    'local'
  );
}

/**
 * Comprueba si una IP está bloqueada temporalmente por demasiados intentos fallidos.
 */
export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, retryAfterSeconds: 0, remainingAttempts: MAX_ATTEMPTS };
  }

  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, retryAfterSeconds: 0, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - record.firstAttemptAt)) / 1000),
    );
    return { allowed: false, retryAfterSeconds, remainingAttempts: 0 };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remainingAttempts: MAX_ATTEMPTS - record.count,
  };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    record.count += 1;
  }
}

export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Detecta si la petición entra por el subdominio administrativo (p. ej.
 * `admin.parroquiasancharbel.org` o `admin.localhost:4321`).
 */
export function isAdminSubdomain(request: Request): boolean {
  const configuredHost = import.meta.env.ADMIN_SUBDOMAIN_HOST?.trim().toLowerCase();
  const hostHeader = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    new URL(request.url).host
  )
    .toLowerCase()
    .trim();

  const hostname = hostHeader.split(':')[0] ?? '';

  if (configuredHost) {
    const cleanConfigured = configuredHost.split(':')[0] ?? configuredHost;
    if (hostHeader === configuredHost || hostname === cleanConfigured) {
      return true;
    }
  }

  return hostname.startsWith('admin.');
}

/**
 * Asegura que exista un token CSRF en cookie HttpOnly y lo devuelve para
 * inyectarlo en los formularios.
 */
export function ensureCsrfToken(cookies: AstroCookies, request: Request): string {
  const existing = cookies.get(CSRF_COOKIE)?.value;
  if (existing && existing.length >= 32) {
    return existing;
  }
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const isHttps = new URL(request.url).protocol === 'https:';

  cookies.set(CSRF_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps,
    maxAge: 60 * 60 * 12,
  });

  return token;
}

/**
 * Verifica que una petición POST provenga del mismo origen (protección CSRF).
 */
export function verifySameOrigin(request: Request): boolean {
  const targetOrigin = new URL(request.url).origin;
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (origin) {
    try {
      const o = new URL(origin);
      if (o.origin === targetOrigin || (forwardedHost && o.host === forwardedHost)) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const r = new URL(referer);
      if (r.origin === targetOrigin || (forwardedHost && r.host === forwardedHost)) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Evita vulnerabilidades de Open Redirect en el parámetro `next`.
 */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next) return '/admin';
  const trimmed = next.trim();
  if (!trimmed.startsWith('/admin') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return '/admin';
  }
  return trimmed;
}

/**
 * Aplica cabeceras HTTP de endurecimiento para el dashboard administrativo.
 */
export function applyAdminSecurityHeaders(headers: Headers): void {
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
}

/**
 * Valida la fortaleza de una contraseña nueva en el flujo de recuperación.
 */
export function validateStrongPassword(password: string): string | null {
  if (password.length < 10) {
    return 'La contraseña debe tener al menos 10 caracteres.';
  }
  if (!/[A-ZÁÉÍÓÚÑ]/.test(password)) {
    return 'La contraseña debe incluir al menos una letra mayúscula.';
  }
  if (!/[a-záéíóúñ]/.test(password)) {
    return 'La contraseña debe incluir al menos una letra minúscula.';
  }
  if (!/\d/.test(password)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  return null;
}

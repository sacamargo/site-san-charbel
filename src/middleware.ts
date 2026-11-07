import { defineMiddleware } from 'astro:middleware';
import { getAdminSession } from '@/lib/admin/auth';
import {
  applyAdminSecurityHeaders,
  ensureCsrfToken,
  isAdminSubdomain,
  verifySameOrigin,
} from '@/lib/admin/security';

const PUBLIC_AUTH_PATHS = new Set([
  '/admin/login',
  '/admin/logout',
  '/admin/recuperar',
  '/admin/restablecer',
]);

/**
 * Middleware de seguridad y enrutamiento de subdominio para el Dashboard.
 *
 * - Soporta subdominio dedicado (`admin.dominio.com` o `admin.localhost:4321`)
 *   y ruta `/admin/*` mientras los dominios no estén asignados.
 * - Aplica cabeceras HTTP de seguridad (anti-clickjacking, nosniff, no-store).
 * - Verifica origen en peticiones POST contra CSRF.
 * - Exige usuario autenticado en todos los módulos del dashboard.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  // Ignorar assets estáticos e internos de Astro
  if (
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/_image') ||
    pathname.startsWith('/favicon')
  ) {
    return next();
  }

  const onAdminSubdomain = isAdminSubdomain(context.request);
  context.locals.isSubdomainAdmin = onAdminSubdomain;

  // Si entra por el subdominio admin.* en la raíz o en una ruta corta (/login, /eventos…),
  // redirigimos a la ruta canónica /admin/... dentro del mismo subdominio.
  if (onAdminSubdomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    const targetPath = pathname === '/' ? '/admin' : `/admin${pathname}`;
    return context.redirect(`${targetPath}${search}`, 302);
  }

  // Si se activó el aislamiento estricto por subdominio en producción y alguien
  // intenta abrir /admin desde el dominio público principal:
  if (
    !onAdminSubdomain &&
    pathname.startsWith('/admin') &&
    import.meta.env.PUBLIC_ADMIN_SUBDOMAIN_ONLY === 'true'
  ) {
    const adminBase = import.meta.env.PUBLIC_ADMIN_SUBDOMAIN_URL?.trim();
    if (adminBase) {
      const target = new URL(`${pathname}${search}`, adminBase);
      return context.redirect(target.toString(), 302);
    }
    return new Response('No encontrado', { status: 404 });
  }

  if (!pathname.startsWith('/admin')) {
    return next();
  }

  // Verificar mismo origen en cualquier POST dirigido a /admin/*
  if (context.request.method === 'POST' && !verifySameOrigin(context.request)) {
    return new Response('Petición bloqueada por política de origen (CSRF).', {
      status: 403,
    });
  }

  context.locals.csrfToken = ensureCsrfToken(context.cookies, context.request);

  if (PUBLIC_AUTH_PATHS.has(pathname)) {
    const response = await next();
    applyAdminSecurityHeaders(response.headers);
    return response;
  }

  const { user, isAdmin } = await getAdminSession(context.request, context.cookies);

  if (!user || !isAdmin) {
    const login = new URL('/admin/login', context.url);
    login.searchParams.set('next', pathname);
    return context.redirect(login.toString(), 302);
  }

  context.locals.adminUser = user;
  context.locals.isAdmin = true;

  const response = await next();
  applyAdminSecurityHeaders(response.headers);
  return response;
});

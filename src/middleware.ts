import { defineMiddleware } from 'astro:middleware';
import { getAdminSession } from '@/lib/admin/auth';

/**
 * Protege /admin/* excepto login.
 * Quien no sea admin vuelve al login.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (!pathname.startsWith('/admin')) {
		return next();
	}

	if (pathname === '/admin/login' || pathname === '/admin/logout') {
		return next();
	}

	const { user, isAdmin } = await getAdminSession(context.request, context.cookies);

	if (!user || !isAdmin) {
		const login = new URL('/admin/login', context.url);
		if (user && !isAdmin) {
			login.searchParams.set('error', 'sin-permiso');
		} else {
			login.searchParams.set('next', pathname);
		}
		return context.redirect(login.toString());
	}

	context.locals.adminUser = user;
	context.locals.isAdmin = true;

	return next();
});

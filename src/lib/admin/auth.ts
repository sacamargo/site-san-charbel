/**
 * Auth helpers del panel /admin.
 */
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { AstroCookies } from 'astro';

export async function getAdminSession(request: Request, cookies: AstroCookies) {
	const supabase = createSupabaseServerClient({ request, cookies });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { supabase, user: null, isAdmin: false };
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('user_id', user.id)
		.maybeSingle();

	return {
		supabase,
		user,
		isAdmin: profile?.role === 'admin',
	};
}

export function requireAdminRedirect(isAdmin: boolean, user: unknown) {
	if (!user) return '/admin/login';
	if (!isAdmin) return '/admin/login?error=sin-permiso';
	return null;
}

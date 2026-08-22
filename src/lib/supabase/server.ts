import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

/**
 * Cliente SSR con cookies — login/sesión del panel /admin.
 * Misma config que src/db/supabase.ts.
 */
function getSupabaseConfig() {
	const url =
		import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
	const key =
		import.meta.env.SUPABASE_KEY ??
		import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!url || !key) {
		throw new Error(
			'Supabase no está configurado. Copia .env.example a .env.local y define SUPABASE_URL y SUPABASE_KEY.',
		);
	}

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

	return createServerClient(url, key, {
		cookies: {
			getAll() {
				return parseCookieHeader(request.headers.get('Cookie') ?? '');
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, options);
				});
			},
		},
	});
}

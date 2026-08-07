import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

function getSupabaseConfig() {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!url || !publishableKey) {
		throw new Error(
			'Supabase is not configured. Copy .env.example to .env and add the project URL and publishable key.',
		);
	}

	return { url, publishableKey };
}

export function createSupabaseServerClient({
	request,
	cookies,
}: {
	request: Request;
	cookies: AstroCookies;
}) {
	const { url, publishableKey } = getSupabaseConfig();

	return createServerClient(url, publishableKey, {
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

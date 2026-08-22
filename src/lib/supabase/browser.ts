import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de navegador — formularios del admin que corren en el client.
 * Requiere PUBLIC_SUPABASE_* (o los espejos en .env.local).
 */
export function createSupabaseBrowserClient() {
	const url =
		import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
	const key =
		import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
		import.meta.env.SUPABASE_KEY;

	if (!url || !key) {
		throw new Error(
			'Supabase no está configurado. En .env.local define también PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
		);
	}

	return createBrowserClient(url, key);
}

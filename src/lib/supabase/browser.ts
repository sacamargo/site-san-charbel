import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!url || !publishableKey) {
		throw new Error(
			'Supabase is not configured. Copy .env.example to .env and add the project URL and publishable key.',
		);
	}

	return createBrowserClient(url, publishableKey);
}

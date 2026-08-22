import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para el servidor (frontmatter de .astro, endpoints, admin).
 *
 * Lee SUPABASE_URL / SUPABASE_KEY (como en el snippet oficial) y, si faltan,
 * cae a PUBLIC_SUPABASE_* para no romper entornos que ya usan esos nombres.
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

const { url, key } = getSupabaseConfig();

export const supabase: SupabaseClient = createClient(url, key);

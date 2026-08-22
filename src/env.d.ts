/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly SUPABASE_URL: string;
	readonly SUPABASE_KEY: string;
	readonly PUBLIC_SUPABASE_URL: string;
	readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		adminUser?: import('@supabase/supabase-js').User;
		isAdmin?: boolean;
	}
}

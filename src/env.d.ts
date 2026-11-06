/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_KEY?: string;
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly GOOGLE_CALENDAR_ID?: string;
  readonly GOOGLE_CALENDAR_API_KEY?: string;
  readonly GOOGLE_CALENDAR_SOURCE?: string;
  readonly ADMIN_SUBDOMAIN_HOST?: string;
  readonly PUBLIC_ADMIN_SUBDOMAIN_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly ADMIN_COOKIE_DOMAIN?: string;
  readonly PUBLIC_ADMIN_SUBDOMAIN_ONLY?: string;
  readonly RESEND_API_KEY?: string;
  readonly GMAIL_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    adminUser?: import('@supabase/supabase-js').User;
    isAdmin?: boolean;
    isSubdomainAdmin?: boolean;
    csrfToken?: string;
  }
}

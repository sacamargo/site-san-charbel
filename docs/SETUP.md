# Configuración local

## Requisitos

- Node.js `>=22.12.0`.
- npm.
- Acceso al proyecto Supabase DEV `san-charbel-dev`.

No es necesario tener Docker ni una instancia local de Supabase para levantar Astro.

## Primera instalación

Desde la raíz del repositorio:

```bash
npm ci --ignore-scripts
cp .env.example .env.local
```

Completa `.env.local` con la URL y la publishable key del proyecto Supabase. Ese archivo está ignorado por Git y nunca debe compartirse.

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=sb_publishable_...
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

El cliente de servidor vive en `src/db/supabase.ts`. Para Auth/SSR del admin se usan `src/lib/supabase/server.ts` y `browser.ts`.

## Desarrollo

```bash
npm run dev
```

La aplicación queda disponible normalmente en `http://localhost:4321`.

## Verificación

```bash
npm run build
```

No se requiere una conexión válida a Supabase para la pantalla inicial, porque los helpers solo validan las variables cuando se utilizan.

## Supabase

El proyecto remoto de desarrollo es la única instancia autorizada para pruebas. La base de datos de producción se configurará después y tendrá variables de entorno distintas.

La base DEV está recién creada y todavía no tiene tablas. El primer análisis de seguridad de Supabase mostró una advertencia sobre la función automática `public.rls_auto_enable`, creada por la configuración del proyecto. Antes de crear tablas o exponer funcionalidades, debemos revisar o restringir esa función y volver a ejecutar el Security Advisor.

Las tablas futuras deberán:

1. Crearse mediante migraciones versionadas.
2. Tener RLS activado.
3. Tener políticas explícitas para `anon` y `authenticated`.
4. Mantener cualquier clave de servicio únicamente en servidor o funciones protegidas.

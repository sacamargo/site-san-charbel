# Admin — puesta en marcha (Supabase)

Trabajo en la rama `admin-develop`. El panel vive en `/admin`.

## 1. Aplicar migraciones (obligatorio)

En el dashboard de Supabase → **SQL Editor** → New query.

1. Pega y ejecuta todo el contenido de:
   - [`supabase/migrations/20260822160000_admin_foundation.sql`](../supabase/migrations/20260822160000_admin_foundation.sql)
2. Luego el de semilla (opcional pero recomendado):
   - [`supabase/migrations/20260822160100_admin_seed.sql`](../supabase/migrations/20260822160100_admin_seed.sql)

Eso crea tablas, RLS, buckets de Storage y la fila de contacto.

## 2. Crear el primer usuario admin

1. Supabase → **Authentication** → Users → **Add user** (email + contraseña).
2. Copia el **User UID**.
3. En SQL Editor:

```sql
insert into public.profiles (user_id, role)
values ('PEGAR-UUID-AQUI', 'admin')
on conflict (user_id) do update set role = 'admin';
```

Sin esa fila en `profiles`, el login funciona en Auth pero el panel rechaza el acceso.

## 3. Variables locales

Ya deberías tener `.env.local` con:

```env
SUPABASE_URL=...
SUPABASE_KEY=...
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## 4. Probar

```bash
npm run dev
```

Abre `http://localhost:4321/admin/login` e inicia sesión.

## 5. Vercel (cuando despliegues `admin-develop` o hagas merge)

En el proyecto de Vercel → Settings → Environment Variables, añade las mismas cuatro variables. Redeploy.

## Módulos

| Ruta | Función |
| --- | --- |
| `/admin/eventos` | Crear / publicar / borrar eventos |
| `/admin/horarios` | Horarios de misa y servicios |
| `/admin/contacto` | Dirección, teléfonos, redes |
| `/admin/momentos` | Fotos del carrusel |
| `/admin/servicios` | Lista abierta + pegar iframe Google Forms |
| `/admin/banner` | Slides de publicidad |

## Google Forms en Servicios

En el admin, pega el HTML del iframe (Enviar → Incorporar) o la URL `viewform`. Solo se aceptan URLs de `https://docs.google.com/forms/`.

# Guía de Configuración del Dashboard Administrativo y Subdominio — San Chárbel

Este documento describe cómo configurar, desplegar y administrar el panel de gestión integral de la **Parroquia San Chárbel** (`/admin` o subdominio `admin.*`).

---

## 1. Módulos incluidos en el Dashboard

El panel administrativo controla todas las secciones dinámicas del sitio público:

| Módulo | Ruta en Dashboard | Tabla en Supabase | Bucket en Storage | Sección Pública |
| :--- | :--- | :--- | :--- | :--- |
| **Resumen general** | `/admin` | Todas (métricas) | — | Portada y páginas internas |
| **Peticiones y Formularios** | `/admin/solicitudes` | `service_requests` | — | `/peticiones` y bloque en `/` |
| **Calendario y Eventos** | `/admin/eventos` | `events` | `event-flyers` | `/agenda`, `/agenda/[slug]` y carrusel en `/` |
| **Banner Principal (Hero)** | `/admin/banner` | `hero_slides` + `site_settings` | `hero-banners` | Hero principal en `/` |
| **Promociones Parroquiales** | `/admin/promociones` | `parish_promotions` | `promotions` | Bloque promocional en `/` |
| **Directorio de Emprendimientos** | `/admin/comercios` | `community_businesses` | `community-businesses` | `/emprendimientos` y bloque en `/` |
| **Repositorio de Descargas** | `/admin/archivos` | `parish_files` | `parish-files` | `/descargas` y bloque en `/` |
| **Servicios y Sacramentos** | `/admin/servicios` | `parish_services` | — | `/servicios`, `/servicios/[slug]` y `/` |
| **Horarios de Misa** | `/admin/horarios` | `mass_schedules` + `site_settings` | — | `/horarios` y bloque en `/` |
| **Galería de Momentos** | `/admin/momentos` | `gallery_moments` | `moments` | Carrusel de momentos en `/` |
| **Contacto y Ajustes Globales** | `/admin/contacto` | `site_settings` | — | Footer, WhatsApp, Correo Gmail receptor |

---

## 2. Base de Datos y Storage en Supabase

En el **SQL Editor** de tu proyecto Supabase (`san-charbel-dev` o `PROD`), ejecuta en orden las dos migraciones incluidas en el repositorio:

1. `supabase/migrations/20260822160000_admin_foundation.sql`
   - Crea todas las tablas, índices, triggers `updated_at`, políticas RLS y los 6 buckets públicos de Storage (`event-flyers`, `moments`, `hero-banners`, `promotions`, `community-businesses`, `parish-files`).
   - Configura acceso administrativo sin división de roles: cualquier usuario autenticado en Supabase Auth obtiene automáticamente permisos completos de administración (`public.is_admin()` devuelve `auth.uid() is not null` y un trigger asigna `role = 'admin'` en `public.profiles`).
2. `supabase/migrations/20260822160100_admin_seed.sql`
   - Inserta los horarios base, los 6 sacramentos/servicios parroquiales, actividades promocionales iniciales y los ajustes de contacto/Gmail.

---

## 3. Creación de Usuarios Administradores y Recuperación de Contraseña

### Crear usuario administrador
1. Ve a **Supabase Dashboard → Authentication → Users → Add user → Create new user**.
2. Ingresa el correo electrónico y contraseña del administrador y marca **Auto Confirm User**.
3. No necesitas ejecutar ningún SQL adicional: todo usuario autenticado tiene derechos completos de administración sobre todos los módulos.

### Recuperación de contraseña por correo
- La pantalla de acceso (`/admin/login`) incluye el enlace **«¿Olvidaste tu contraseña?»** hacia `/admin/recuperar`.
- Al ingresar su correo, Supabase envía un enlace de recuperación que redirige a `/admin/restablecer`.
- En **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**, agrega:
  - `http://localhost:4321/admin/restablecer`
  - `http://admin.localhost:4321/admin/restablecer`
  - `https://tu-dominio.com/admin/restablecer`
  - `https://admin.tu-dominio.com/restablecer` (y `https://admin.tu-dominio.com/admin/restablecer`)

---

## 4. Configuración del Subdominio Administrativo

El middleware (`src/middleware.ts`) soporta dos modos simultáneos para que puedas trabajar hoy sin dominio comprado y activar el subdominio apenas asignes tu DNS:

1. **Acceso por subdominio (`admin.tudominio.com` o `admin.localhost:4321`)**:
   - Cualquier host que comience con `admin.` (o coincida con `ADMIN_SUBDOMAIN_HOST`) reescribe automáticamente las rutas limpias (`/login`, `/eventos`, `/solicitudes`, etc.) hacia `/admin/*`.
2. **Acceso por ruta (`/admin/*`)**:
   - Mientras los dominios definitivos no estén asignados, puedes entrar directamente a `/admin/login`.
3. **Aislamiento exclusivo en subdominio (opcional)**:
   - Cuando tengas el subdominio en producción, si defines `PUBLIC_ADMIN_SUBDOMAIN_ONLY=true` y `PUBLIC_ADMIN_SUBDOMAIN_URL=https://admin.parroquiasancharbel.org`, cualquier intento de abrir `/admin` desde el dominio público redirigirá automáticamente al subdominio administrativo.

---

## 5. Estándares de Seguridad Implementados en el Acceso

- **Verificación criptográfica de sesión SSR**: Uso de `supabase.auth.getUser()` en servidor con cookies `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
- **Protección contra fuerza bruta (Rate Limiting)**: Límite por IP en `/admin/login` y `/admin/recuperar` (máximo 6 intentos fallidos en 15 minutos con bloqueo temporal de 15 minutos y encabezado `Retry-After`).
- **Protección CSRF y validación de origen**: Verificación de encabezados `Origin` / `Referer` contra el host activo en todas las peticiones `POST` administrativas y de API, más cookie CSRF `sc_csrf`.
- **Cabeceras de endurecimiento HTTP**: `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `Cache-Control: no-store, no-cache, must-revalidate`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin` y `X-Robots-Tag: noindex, nofollow`.
- **Prevención de Open Redirect**: Sanitización estricta del parámetro `?next=` mediante `sanitizeNextPath()`.
- **Política de contraseñas en restablecimiento**: Mínimo 10 caracteres combinando mayúsculas, minúsculas y números.

---

## 6. Reenvío de Peticiones a Correo Gmail

El sistema de formularios (`/peticiones` y bloque en la portada) guarda cada solicitud en la tabla `service_requests` y ofrece dos mecanismos complementarios de envío a Gmail:

1. **Correo Gmail destino configurable desde el Dashboard**:
   - En `/admin/contacto` (o directamente en la barra superior de `/admin/solicitudes`) puedes definir el **Correo Gmail receptor de formularios** (`notification_gmail`, por defecto `parroquiasancharbelbaq@gmail.com`).
2. **Despacho directo en 1 clic a Gmail Web (`mail.google.com`)**:
   - En `/admin/solicitudes`, cada petición incluye el botón **«Reenviar a Gmail»**, que abre Gmail Web Compose con destinatario, asunto y ficha completa de la petición listos para enviar o reenviar a la secretaría parroquial, además de respuesta directa al feligrés por Gmail o WhatsApp.
3. **Reenvío automático en segundo plano (Webhook / Google Apps Script o Resend)**:
   - Si configuras `GMAIL_FORWARD_WEBHOOK_URL` en `.env` (por ejemplo, un Web App de Google Apps Script conectado a tu cuenta Gmail parroquial) o `RESEND_API_KEY`, cada formulario enviado en `/api/peticiones` o reenviado desde `/admin/solicitudes` se despacha automáticamente en segundo plano y registra la marca `forwarded_to_gmail_at`.

### Ejemplo rápido de Google Apps Script para `GMAIL_FORWARD_WEBHOOK_URL` (100% gratuito con tu cuenta Gmail)

Si deseas que el propio Gmail de la parroquia envíe el correo automáticamente sin servicios de pago:

1. Abre [script.google.com](https://script.google.com) con la cuenta Gmail de la parroquia y crea un proyecto con este código:
   ```javascript
   function doPost(e) {
     var data = JSON.parse(e.postData.contents);
     GmailApp.sendEmail(data.to, data.subject, data.text, {
       htmlBody: data.html,
       replyTo: data.replyTo || data.to
     });
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
2. Haz clic en **Implementar → Nueva implementación → Aplicación web**, elige **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona**.
3. Copia la URL generada y pégala en `GMAIL_FORWARD_WEBHOOK_URL` dentro de tus variables de entorno.

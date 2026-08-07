# Plan de MVP — Parroquia San Chárbel

Este documento convierte la investigación de estructura de páginas en un plan implementable y filtra lo necesario para lanzar una primera versión operable.

## Objetivo

Resolver primero: horarios, contacto, próximos eventos, requisitos de sacramentos e información básica de San Chárbel.

## Alcance de lanzamiento

| Área | Primera versión | Fuente |
| --- | --- | --- |
| Inicio | Horarios resumidos, evento destacado y accesos principales | Mixto |
| Horarios | Misas, confesiones, adoración, misa a San Chárbel y despacho | Supabase |
| Contacto | Dirección, referencias, mapa, teléfono, WhatsApp y correo | Supabase/configuración |
| Agenda | Lista cronológica de eventos vigentes y flyers | Supabase + Storage |
| San Chárbel | Resumen biográfico y oración validada | Repositorio |
| Sacramentos | Requisitos, documentos, pasos, solicitud y contacto | Repositorio + Supabase |

La agenda no será un calendario mensual. El administrador publica eventos y el sitio muestra los próximos por fecha.

## Panel administrativo mínimo

- Autenticación para administradores.
- CRUD de eventos.
- Publicado/no publicado, destacado, fecha de inicio y vencimiento.
- Flyer en Storage.
- CRUD de horarios, servicios y contacto.
- Bandeja privada de solicitudes de sacramentos.
- Cambio de estado y notas internas para cada solicitud.
- Envío de correo de confirmación de recepción.

## Modelo de datos inicial

Crear mediante migraciones, con RLS desde el inicio:

- `site_settings`: contacto, ubicación y redes.
- `mass_schedules`: horarios recurrentes y excepciones.
- `parish_services`: confesiones, adoración y despacho.
- `events`: título, resumen, categoría, fecha, lugar, contacto, publicación y vencimiento.
- `event_media`: archivo de Storage y texto alternativo.
- `sacrament_requests`: tipo de sacramento, datos de contacto mínimos, preferencia de fecha, estado, timestamps y notas internas.

No crear todavía tablas para noticias, peticiones de oración, testimonios o donaciones.

## Fases

### Fase 0 — Fundación técnica

Astro, Tailwind, Supabase, variables DEV/PROD, documentación, flujo de ramas y componentes base.

### Fase 1 — Información crítica

Horarios, servicios, contacto, ubicación, datos validados, SEO básico y rendimiento móvil.

### Fase 2 — Eventos operables

Migración, Storage, Auth administrativa, panel de publicación y agenda pública.

### Fase 3 — Contenido pastoral

San Chárbel, oración validada, sacramentos y requisitos reales, más el inicio compuesto.

### Fase 4 — Solicitudes de sacramentos

- Formulario específico por sacramento, no formulario genérico.
- Validación de campos y consentimiento informado.
- Inserción pública limitada: el visitante puede crear, pero no leer ni modificar solicitudes.
- Acceso solo para administradores autorizados mediante Supabase Auth y RLS.
- Edge Function para enviar el correo de recepción mediante un proveedor transaccional.
- El secreto del proveedor vive en los secrets de Supabase, nunca en Astro, el navegador o Git.
- Estado inicial `received`; la parroquia decide luego si pasa a `contacted`, `confirmed` o `rejected`.

## Decisiones de producto

- No usar formularios públicos genéricos en el MVP. La excepción es la solicitud específica de sacramentos, con campos mínimos, consentimiento y política de privacidad.
- El correo automático confirma recepción, no confirma disponibilidad ni aprobación de la reserva.
- No guardar información médica ni detalles pastorales innecesarios en la solicitud.
- RLS debe impedir `SELECT` de `anon`; solo `INSERT` controlado para público y lectura/actualización para administradores autorizados.
- No publicar requisitos hasta recibir aprobación de la parroquia.
- Registrar la última revisión de horarios y contacto.
- Si nadie mantiene la agenda semanalmente, reducirla a celebraciones anuales y fijas.
- Las fotos, dirección, horarios, requisitos y textos litúrgicos necesitan aprobación.

## Fuera del MVP

Donaciones en línea, peticiones de oración, inscripciones generales, noticias como CMS, galería administrable, testimonios, streaming, calendario avanzado y múltiples roles.

## Criterio de éxito

Una persona móvil encuentra horarios, contacto y eventos rápidamente, y un administrador mantiene esos datos sin desplegar código.

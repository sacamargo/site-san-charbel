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
| Sacramentos | Requisitos, documentos, pasos y contacto | Repositorio |

La agenda no será un calendario mensual. El administrador publica eventos y el sitio muestra los próximos por fecha.

## Panel administrativo mínimo

- Autenticación para administradores.
- CRUD de eventos.
- Publicado/no publicado, destacado, fecha de inicio y vencimiento.
- Flyer en Storage.
- CRUD de horarios, servicios y contacto.

## Modelo de datos inicial

Crear mediante migraciones, con RLS desde el inicio:

- `site_settings`: contacto, ubicación y redes.
- `mass_schedules`: horarios recurrentes y excepciones.
- `parish_services`: confesiones, adoración y despacho.
- `events`: título, resumen, categoría, fecha, lugar, contacto, publicación y vencimiento.
- `event_media`: archivo de Storage y texto alternativo.

No crear todavía tablas para noticias, peticiones, inscripciones, testimonios o donaciones.

## Fases

### Fase 0 — Fundación técnica

Astro, Tailwind, Supabase, variables DEV/PROD, documentación, flujo de ramas y componentes base.

### Fase 1 — Información crítica

Horarios, servicios, contacto, ubicación, datos validados, SEO básico y rendimiento móvil.

### Fase 2 — Eventos operables

Migración, Storage, Auth administrativa, panel de publicación y agenda pública.

### Fase 3 — Contenido pastoral

San Chárbel, oración validada, sacramentos y requisitos reales, más el inicio compuesto.

## Decisiones de producto

- No usar formularios públicos en el MVP: WhatsApp y teléfono reducen riesgo de datos sensibles y carga operativa.
- No publicar requisitos hasta recibir aprobación de la parroquia.
- Registrar la última revisión de horarios y contacto.
- Si nadie mantiene la agenda semanalmente, reducirla a celebraciones anuales y fijas.
- Las fotos, dirección, horarios, requisitos y textos litúrgicos necesitan aprobación.

## Fuera del MVP

Donaciones en línea, peticiones de oración, inscripciones, noticias como CMS, galería administrable, testimonios, streaming, calendario avanzado y múltiples roles.

## Criterio de éxito

Una persona móvil encuentra horarios, contacto y eventos rápidamente, y un administrador mantiene esos datos sin desplegar código.

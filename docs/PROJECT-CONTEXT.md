# Contexto del proyecto

## Propósito

Construir una landing rápida y clara para la Parroquia San Chárbel de Villa Carolina, Barranquilla, con un panel administrativo mínimo para publicar eventos y actualizar información parroquial.

## Decisiones incorporadas de la investigación

- El sitio debe guiar e informar antes que decorar: el dato útil va primero.
- Cada página debe funcionar como entrada independiente desde Google.
- Horarios y contacto son las páginas de mayor prioridad.
- En el contexto hispano, sacramentos significa principalmente requisitos y documentos.
- La agenda será una lista cronológica editable; no se construirá un calendario complejo.
- El contenido estático no se conecta a Supabase innecesariamente.

## MVP acordado

### Público — lanzamiento

- Inicio con horarios resumidos, evento destacado y accesos principales.
- Horarios de misas y servicios, con avisos especiales.
- Contacto, ubicación, teléfono, WhatsApp, correo y despacho.
- Agenda de eventos y anuncios como lista cronológica.
- Información introductoria de San Chárbel.
- Sacramentos: índice y fichas de requisitos validados.

### Administración

- Supabase Auth para administradores.
- CRUD de eventos, publicación, destacados y vencimiento.
- Flyers en Supabase Storage.
- Actualización de horarios, servicios y contacto.

Los textos de sacramentos, oración y biografía se mantienen versionados en el repositorio.

## Fuera del MVP

- Donaciones en línea.
- Formularios públicos que almacenen datos personales.
- Peticiones de oración, por su posible contenido sensible.
- Noticias como módulo separado.
- Calendario mensual complejo; la agenda será una lista.
- Galería administrable completa.
- Testimonios, streaming y aplicación móvil.

## Orden de implementación

1. Fundación: layout, navegación, estilos, SEO y datos validados.
2. Información crítica: `/horarios` y `/contacto`.
3. Producto central: `/agenda` con eventos y flyers desde Supabase.
4. Contenido diferencial: `/san-charbel` y sacramentos.
5. Inicio compuesto con enlaces funcionales y eventos vigentes.
6. Operación: Auth, RLS, Storage y separación DEV/PROD.

## Criterios de salida del MVP

- Una persona encuentra el horario de misa desde un celular rápidamente.
- Una persona encuentra la dirección y puede escribir por WhatsApp.
- Un administrador publica un evento con flyer, fecha, lugar y contacto.
- Los eventos vencidos no aparecen como próximos.
- Horarios y contacto tienen fuente editable y fecha de revisión.
- No hay información parroquial inventada; el contenido está aprobado.
- Todas las tablas expuestas tienen RLS y políticas revisadas.

## Entornos

- DEV: `san-charbel-dev`, utilizado para desarrollo y datos de prueba.
- PROD: proyecto separado, todavía no creado.

El entorno DEV no tiene todavía tablas ni migraciones de negocio.

## Regla de contenido

Horarios, teléfonos, correos, dirección, redes sociales, requisitos y textos litúrgicos deben validarse con la parroquia. Ningún agente debe inventar o asumir esos valores.

# División de responsabilidades — MVP

Este documento define la propiedad inicial de cada área del MVP de la Parroquia San Chárbel.
La división busca evitar duplicidad de trabajo y dejar claros los contratos de integración.

## Equipo

| Persona | Área principal | Entregables principales |
| --- | --- | --- |
| Daniel | Landing pública | Layout Astro, navegación, hero, eventos destacados, collage estático, horarios integrados, contacto y footer |
| Camilo | Agenda | Integración de Google Calendar en solo lectura, vista mensual, lista de próximos eventos, caché, flyers y estados vacíos |
| Santiago | Contenido y servicios | Página de San Chárbel, página Servicios, sacramentos, requisitos, formulario y validaciones de usuario |
| Gustavo | Administración y plataforma | Supabase Auth, modelo de datos, migraciones, RLS, panel administrativo, solicitudes, estados, notas internas y correo de confirmación |

## Límites de cada área

### Daniel — Landing pública

- Construir la página principal y sus secciones reutilizables.
- Mantener la navegación: `Inicio | San Charbel | Agenda | Servicios`.
- Mostrar eventos consumiendo el contrato definido por Camilo.
- Integrar horarios, servicios, contacto, ubicación, collage estático y footer.
- Garantizar diseño responsive, accesibilidad básica y rendimiento móvil.
- No crear CRUD para eventos, galerías ni contenido administrativo.

### Camilo — Agenda

- Usar Google Calendar como fuente de verdad.
- Implementar lectura pública de eventos sin duplicarlos en Supabase.
- Construir vista mensual de solo lectura y lista de próximos eventos.
- Manejar eventos vencidos, días sin eventos, errores de consulta y caché.
- Definir cómo se muestran los flyers mediante enlace o recurso asociado al evento.
- No implementar creación, edición o eliminación de eventos desde la aplicación.

### Santiago — Contenido y servicios

- Construir la página de San Chárbel con contenido aprobado.
- Construir la página Servicios y las fichas de sacramentos.
- Mostrar requisitos, documentos, pasos y canales de contacto.
- Diseñar el formulario específico de solicitud por sacramento.
- Validar campos, consentimiento y estados de carga, éxito y error.
- Coordinar con Gustavo el contrato de `sacrament_requests`.
- Confesión y Unción de los enfermos serán informativos hasta decidir si requieren reservas.

### Gustavo — Administración y plataforma

- Configurar Supabase Auth para administradores.
- Crear migraciones para configuración del sitio, horarios, servicios y solicitudes.
- Diseñar y revisar RLS; las solicitudes no deben ser visibles para visitantes anónimos.
- Construir la bandeja administrativa de solicitudes.
- Implementar estados: `received`, `contacted`, `confirmed` y `rejected`.
- Añadir notas internas y detalle privado de cada solicitud.
- Implementar el correo de confirmación de recepción mediante una Edge Function.
- Mantener secretos fuera del navegador, Git y variables públicas.
- Separar configuración DEV y PROD.

## Contratos de integración

1. La agenda viene de Google Calendar; Supabase no tendrá tabla de eventos.
2. La landing consume eventos y horarios mediante interfaces compartidas, no mediante datos duplicados.
3. El formulario de Santiago crea una solicitud; el panel de Gustavo la revisa y actualiza.
4. El correo confirma recepción, pero no confirma disponibilidad ni aprobación de la reserva.
5. La galería de la landing es estática y no tendrá CMS en el MVP.
6. Los textos de San Chárbel, requisitos, horarios y contacto deben estar aprobados antes de publicarse.

## Coordinación y entrega

- Cada persona trabaja en una rama propia creada desde `development`.
- Los cambios se integran mediante Pull Request hacia `development`.
- Daniel y Camilo coordinan el contrato visual y de datos de eventos.
- Santiago y Gustavo coordinan el contrato de solicitudes y sus estados.
- Ninguna persona debe modificar migraciones, políticas RLS o secretos sin revisar el impacto con Gustavo.
- Antes de integrar, cada PR debe incluir validación local y una descripción clara de los cambios.

## Fuera de las responsabilidades del MVP

- Donaciones en línea.
- Galería administrable.
- Noticias como CMS.
- Peticiones de oración públicas.
- Escritura de eventos hacia Google Calendar.
- Múltiples roles administrativos.

# San Chárbel — guía para agentes

## Contexto del producto

Este repositorio contiene el monolito de la Parroquia San Chárbel de Villa Carolina, Barranquilla. La aplicación tendrá una landing pública rápida y un panel administrativo pequeño para gestionar eventos, flyers, horarios e información parroquial.

## Decisiones actuales

- Frontend y servidor: Astro.
- Estilos: Tailwind CSS 4 mediante el plugin oficial de Vite.
- Backend: Supabase hospedado (Postgres, Auth y Storage).
- Entorno actual: Supabase DEV (`san-charbel-dev`). PROD se mantendrá separado.
- Gestor de paquetes: npm. Mantener `package-lock.json` actualizado.
- Instalar dependencias con `npm ci --ignore-scripts`.
- No usar Docker para el desarrollo normal; Supabase local será opcional.
- No exponer claves `service_role` o secret keys en el navegador ni en Git.
- No crear tablas ni políticas directamente en PROD sin una migración revisada.

## Flujo de trabajo

1. Leer este archivo y `docs/SETUP.md`.
2. Revisar `git status` y la rama activa antes de modificar.
3. Trabajar en ramas descriptivas; no trabajar directamente en `main`.
4. Consultar primero los datos reales antes de inventar horarios, teléfonos, correos o información pastoral.
5. Mantener cambios pequeños y verificables.
6. Ejecutar `npm run build` antes de entregar cambios de Astro.
7. No ejecutar scripts de dependencias durante instalaciones.
8. No borrar migraciones, datos o configuración remota sin autorización explícita.

## Comandos

```bash
npm ci --ignore-scripts
npm run dev
npm run build
npm run preview
```

Para levantar el servidor en segundo plano, usar `astro dev --background` y gestionarlo con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Documentación de referencia

- `docs/SETUP.md`: configuración local y Supabase DEV.
- `docs/PROJECT-CONTEXT.md`: alcance del producto y decisiones de MVP.
- `src/lib/supabase/server.ts`: cliente Supabase para SSR y cookies.
- `src/lib/supabase/browser.ts`: cliente Supabase para el navegador.

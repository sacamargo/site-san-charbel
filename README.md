# site-san-charbel

Sitio web de la Iglesia San Charbel (Villa Carolina, Barranquilla), hecho con [Astro](https://astro.build).

La aplicación es un monolito Astro con Tailwind CSS y Supabase como backend gestionado. El entorno conectado localmente es `san-charbel-dev`; producción se configurará en un proyecto Supabase separado.

Consulta [docs/SETUP.md](docs/SETUP.md) para levantar el proyecto y [docs/PROJECT-CONTEXT.md](docs/PROJECT-CONTEXT.md) para el alcance del MVP y las decisiones del proyecto.

## Comandos

| Comando           | Acción                                      |
| :---------------- | :------------------------------------------ |
| `npm ci --ignore-scripts` | Instala dependencias usando el lockfile, sin scripts de terceros |
| `cp .env.example .env` | Crea la configuración local de entorno |
| `npm run dev`     | Servidor local en `localhost:4321`          |
| `npm run build`   | Build de producción en `./dist/`            |
| `npm run preview` | Vista previa del build local                |

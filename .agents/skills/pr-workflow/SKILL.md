---
name: pr-workflow
description: Flujo de trabajo Git para San Chárbel: crear ramas de trabajo desde development, validar cambios, publicar la rama personal y abrir o actualizar un Pull Request hacia development. Usar cuando un agente vaya a implementar cambios, preparar un PR, corregir observaciones de revisión o publicar trabajo en este repositorio.
---

# Flujo de ramas y Pull Requests

## Reglas del repositorio

- Repositorio remoto esperado: `sacamargo/site-san-charbel`.
- `main` es la rama estable de referencia.
- `development` es la rama de integración y debe partir de `main`.
- Toda tarea nueva debe partir de `origin/development`, nunca directamente de `main`.
- La rama de trabajo debe seguir el formato `feature/<descripcion>`, `fix/<descripcion>` o `chore/<descripcion>`.
- El Pull Request siempre debe apuntar de la rama de trabajo hacia `development`.
- No hacer push directo a `main` ni a `development`.

## Inicio de una tarea

1. Confirmar el repositorio y revisar el estado:

   ```bash
   git remote -v
   git status -sb
   git fetch origin
   ```

2. Si el árbol tiene cambios ajenos a la tarea, detenerse y pedir aclaración. No usar `git add -A` silenciosamente.

3. Crear la rama desde la referencia remota de integración:

   ```bash
   git switch --create feature/<descripcion> origin/development
   ```

   Si la rama ya existe, verificar que sea la rama correcta antes de cambiarse a ella. No borrar ni sobrescribir ramas existentes.

## Implementación y validación

- Leer `AGENTS.md`, `docs/SETUP.md` y `docs/PROJECT-CONTEXT.md` antes de cambiar código.
- Mantener el alcance de la tarea y evitar cambios no relacionados.
- No versionar `.env`, contraseñas, claves `service_role`, tokens ni archivos privados.
- Para dependencias usar el lockfile y preferir `npm ci --ignore-scripts`.
- Antes del commit ejecutar las validaciones relevantes; para cambios Astro, como mínimo:

  ```bash
  ASTRO_TELEMETRY_DISABLED=1 npm run build
  npm audit --omit=dev --audit-level=high
  git diff --check
  ```

- Revisar el diff y el estado antes de confirmar:

  ```bash
  git diff --stat
  git status -sb
  ```

## Commit y publicación

1. Crear un commit descriptivo que represente la tarea:

   ```bash
   git add <archivos-intencionados>
   git commit -m "<descripcion breve>"
   ```

2. Publicar únicamente la rama de trabajo:

   ```bash
   git push --set-upstream origin feature/<descripcion>
   ```

3. Confirmar que la rama publicada contiene el commit esperado y que no se incluyó `.env`.

## Separación de cuentas

Este proyecto es personal y usa GitHub como `GustavoG18`. No cambiar, cerrar sesión ni reemplazar la cuenta laboral `gguerrero-biai` para publicar este repositorio.

- Preferir una llave SSH personal configurada solo en este repositorio mediante `core.sshCommand`.
- Verificar que `git remote -v` use el remoto personal esperado y que la configuración SSH sea local al repositorio.
- Antes de crear un PR en la interfaz, verificar que GitHub muestre `GustavoG18` como usuario activo.
- Si el navegador o `gh` muestran `gguerrero-biai`, detenerse antes de enviar el formulario o crear el PR.
- Nunca copiar tokens, claves privadas, contraseñas ni valores completos de `.env` en la conversación, el PR o el repositorio.

## Crear o actualizar el Pull Request

- Crear un PR desde `feature/<descripcion>` hacia `development`.
- Usar un título breve y un cuerpo que explique qué cambió, por qué, impacto y validaciones ejecutadas.
- Crear el PR como Draft salvo que el usuario pida explícitamente uno listo para revisión.
- Verificar en GitHub el usuario, rama origen, rama destino y archivos cambiados antes de crear el PR.
- Para cambios posteriores, continuar haciendo commits en la misma rama; no crear otra rama para el mismo PR.
- No hacer merge ni cambiar el PR a listo para revisión sin autorización explícita.

## Cierre de la tarea

Informar siempre:

- rama creada y commit publicado;
- rama destino del PR;
- URL y estado del PR;
- validaciones ejecutadas;
- cualquier bloqueo de autenticación, permisos o CI.

Si el push o la creación del PR falla, conservar el trabajo local y explicar el bloqueo. No cambiar cuentas globales ni usar force-push como solución automática.

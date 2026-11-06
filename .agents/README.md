# Skills de agentes del proyecto

Este directorio lo descubre Antigravity automáticamente al abrir el repositorio.

| Ruta | Origen | Versionado | Commit |
|---|---|---|---|
| `skills/pr-workflow/` | Propio del proyecto | Sí | — |
| `plugins/supabase/` | [supabase/agent-skills](https://github.com/supabase/agent-skills) (oficial) | Sí | `c9be0e9` |
| `plugins/agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — skills, `agents/` y `references/` | Sí | `301b02b` |
| `vendor/antigravity-awesome-skills/` | [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | **No** (~100 MB) | `828257c` |
| `vendor/vibes-plug/` | [roedyrustam/vibes-plug](https://github.com/roedyrustam/vibes-plug) | **No** | `c1ebe24` |
| `vendor/antigravity-skills/` | [rmyndharis/antigravity-skills](https://github.com/rmyndharis/antigravity-skills) | **No** | `364ea63` |

## Catálogos comunitarios (`vendor/`)

Suman más de 3.300 skills. Registrarlos todos inyectaría miles de descripciones en cada
conversación, así que `skills.json` activa **solo los relevantes para este stack**
(Astro, Tailwind, Supabase/Postgres, accesibilidad, SEO local, seguridad, Vercel).
El resto queda en disco: para activar otro, añade su carpeta a `include_only`.

Para descargarlos en otra máquina, con los mismos commits revisados:

```powershell
powershell -File .agents/sync-vendor.ps1
```

## Qué no se instaló a propósito

- **Hooks** de `addyosmani/agent-skills` (`hooks/*.sh`): ejecutan scripts en cada sesión.
- **Servidor MCP / CLI** de `vibes-plug` (`vibes db:eval`, `npx`): ejecutan código de terceros
  fuera de revisión. AGENTS.md prohíbe ejecutar scripts de dependencias.
- Los `AGENTS.md`/`CLAUDE.md` de cada repo: configuran el repo de origen, no este proyecto.

Los subagentes (`agents/*.md`) se copiaron como referencia; los de addyosmani ya están
disponibles como `code-reviewer`, `test-engineer`, `security-auditor` y
`web-performance-auditor`.

## Design system

`docs/design-system.md` is the visual and structural source of truth: color and
spacing tokens, typography, the component catalog, page templates, the Supabase
schema, and the pre-PR checklist. Read it before building any UI. If something
you need isn't defined there, propose it and add it to the doc first — don't
invent it in a component.

Hard rules from that doc, easy to get wrong:

- Never write a raw hex color or an off-scale spacing value in a component. Always a token.
- Green is limited to four uses only (§1.3). Everywhere else, gold is the accent.
- Required vocabulary: **Pastorales** (not Ministerios), **Agenda** (not Eventos),
  **La Parroquia** (not Nosotros). Applies to routes, titles, components, and tables.
- "Chárbel" carries the accent in visible text; paths and slugs use `san-charbel`.

Component names are English PascalCase (`Button`, `AgendaCard`). Routes, slugs,
database tables/columns, and all user-facing copy are Spanish.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

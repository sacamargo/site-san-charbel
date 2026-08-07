# Mockups de la portada

| Archivo | Qué es |
|---|---|
| `inicio-escritorio.png` | Inicio en escritorio |
| `inicio-movil.png` | Inicio en móvil |

## Cómo se leen

Estos mockups mandan en **cómo se ve**: composición, ritmo, color, densidad. No mandan en
**qué existe ni cómo se llama** — eso es del documento 02 y de `../design-system.md`
(§0.2). Donde se contradigan, gana el sistema de diseño.

## Lo que ya está superado en ambos

Se dibujaron antes de cerrar la arquitectura, así que hay tres cosas que **no** hay que
copiar:

1. **El menú de 8 ítems** (Inicio, Nosotros, Horarios, Sacramentos, Ministerios, Eventos,
   Noticias, Contacto). Son 6: Inicio · La Parroquia · San Chárbel · Sacramentos ·
   Comunidad · Contacto.
2. **El vocabulario del pie y del menú**: "Ministerios" → **Pastorales**,
   "Eventos" → **Agenda**, "Nosotros" → **La Parroquia**.
3. **"SAN CHARBEL" sin tilde**. En texto visible siempre lleva tilde: **San Chárbel**.
   Sin tilde solo en rutas y nombres de archivo (`san-charbel`).

## Lo que sí se tomó de aquí

- La **InfoBar de tres celdas de orientación** (Próxima misa · Dirección · Despacho), en
  lugar de las cuatro celdas de horarios que pedía §7.1. Motivo: el horario completo ya
  tiene su propia sección justo debajo y no debe salir dos veces en la misma pantalla.
- El **chevron** al final de cada fila pulsable.
- El **botón perfilado sobre el hero** (`outline-on-dark`), que no existía en §6.2.

Los tres cambios están registrados en `../design-system.md`.

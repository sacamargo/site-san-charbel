/**
 * Anclas estables dentro de la página de agenda.
 *
 * Las celdas del calendario enlazan al grupo del día en la lista de abajo.
 * Es lo que hace que el calendario sirva sin una línea de JavaScript.
 */

export function eventAnchorId(eventId: string): string {
  return `evento-${eventId.replace(/[^A-Za-z0-9_-]/g, '-')}`;
}

/** `dia-2026-08-12` a partir de la clave del día. */
export function dayAnchorId(dayKey: string): string {
  return `dia-${dayKey}`;
}

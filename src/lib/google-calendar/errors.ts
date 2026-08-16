/**
 * Mensajes legibles para los códigos de error más comunes de la Calendar API.
 *
 * Compartido entre `client.ts` (trae eventos) y `verify.ts` (prueba la
 * conexión): los dos hablan con el mismo API y fallan de las mismas formas.
 */
export function describeGoogleCalendarFailure(status: number, body: string): string {
  if (status === 404) {
    return 'El calendario no existe o no está marcado como público.';
  }
  if (status === 403) {
    return 'La clave de API fue rechazada: revisa que la Calendar API esté habilitada y que las restricciones de la clave permitan este uso.';
  }
  if (status === 400) {
    return `Google rechazó los parámetros de la consulta. ${body.slice(0, 200)}`;
  }
  return `Google respondió ${status}. ${body.slice(0, 200)}`;
}

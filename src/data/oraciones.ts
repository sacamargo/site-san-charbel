/**
 * Oraciones — contenido institucional (§9.1: vive en el repo, no en Supabase).
 *
 * ⚠️ TEXTO PENDIENTE. El de abajo es el marcador de posición que aparece en el
 * mockup: una cita del Evangelio, no la oración a San Chárbel de la parroquia.
 * Se puso tal cual para no inventar una oración devocional, que en un sitio
 * parroquial sería peor que un hueco visible.
 *
 * Hay que pedirle a la parroquia el texto de la oración que rezan y sustituirlo
 * aquí. Cuando llegue, cambia también `referencia` a "Oración a San Chárbel".
 */

export interface Oracion {
  id: string;
  texto: string;
  referencia: string;
  /** Marca temporal para revisión editorial. */
  pendiente?: boolean;
}

export const oracionPortada: Oracion = {
  id: 'portada',
  texto:
    'El que me ama, cumplirá mi palabra, y mi Padre lo amará, y vendremos a él y haremos morada en él.',
  referencia: 'Juan 14, 23',
  pendiente: true,
};

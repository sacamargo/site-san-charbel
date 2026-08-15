/**
 * Momentos — las fotos de la parroquia que se ven en la portada.
 *
 * POR QUÉ ES UN ARCHIVO Y NO UNA CONSULTA. La galería del MVP es estática y
 * versionada en el repositorio, sin CMS (`docs/MVP-PLAN.md`, "Alcance de
 * lanzamiento"). El tipo `FotoGaleria` de `lib/types.ts` describe la tabla
 * `galeria` de una galería administrable **futura**, que queda fuera del MVP:
 * no se usa aquí a propósito, para no aparentar que esto sale de Supabase.
 *
 * AÑADIR UNA FOTO: dejar el archivo en `src/assets/momentos/` y añadir dos
 * líneas aquí. El import es obligatorio — Astro necesita el módulo para
 * procesar la imagen; una ruta suelta en texto no le sirve.
 *
 * Que entren ya en **webp**: la foto de la vigilia pesaba 1.9MB en PNG y quedó
 * en 138KB sin pérdida visible, y aquí se acumulan todas en la misma página.
 *
 * EL `alt` NO ES OPCIONAL (§5 de `docs/DESIGN.md`). Describe la escena, no la
 * titula: es lo único que oye quien no ve la foto, así que "Bendición a los
 * hombres de la comunidad" sirve y "Plan Misión" no dice nada.
 *
 * NO HAY CAMPO DE ENCUADRE, y es deliberado. El carrusel da a todas la misma
 * altura y deja que el ancho salga de su proporción, así que no se recorta
 * ninguna y no hay nada que anclar. `EventCard` sí conserva el suyo: sus
 * tarjetas siguen siendo 3:2 fijas y ahí el recorte es inevitable.
 */
import homilia from '@/assets/momentos/homilia-plan-mision.webp';
import bendicion from '@/assets/momentos/bendicion-plan-mision.webp';
import procesion from '@/assets/momentos/procesion-santisimo.webp';
import comunidad from '@/assets/momentos/comunidad-reunida.webp';
import temploLleno from '@/assets/momentos/templo-lleno.webp';
import sacerdotes from '@/assets/momentos/sacerdotes.webp';
import ramos from '@/assets/momentos/domingo-de-ramos.webp';

export interface Momento {
  imagen: ImageMetadata;
  alt: string;
}

export const momentos: Momento[] = [
  {
    imagen: homilia,
    alt: 'El párroco durante la homilía, ante el crucifijo del presbiterio',
  },
  {
    imagen: bendicion,
    alt: 'Bendición a los hombres de la comunidad en la misa del Plan Misión',
  },
  {
    imagen: procesion,
    alt: 'Procesión con el Santísimo bajo palio, acompañada por la comunidad',
  },
  {
    imagen: comunidad,
    alt: 'La comunidad reunida ante el altar del templo, vestida de blanco',
  },
  {
    imagen: temploLleno,
    alt: 'El templo lleno de fieles durante la celebración de la misa',
  },
  {
    imagen: sacerdotes,
    alt: 'Dos sacerdotes en el presbiterio, ante el crucifijo del altar',
  },
  {
    imagen: ramos,
    alt: 'Bendición de ramos en la calle, el Domingo de Ramos',
  },
];

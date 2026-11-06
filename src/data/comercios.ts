/**
 * Directorio de negocios y emprendimientos de feligreses (`community_businesses`).
 *
 * El contenido real se administra desde el Dashboard en `/admin/comercios`.
 */

export interface ComercioParroquial {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  propietario: string | null;
  telefono: string | null;
  whatsapp: string | null;
  direccion: string | null;
  horario: string | null;
  sitio_web: string | null;
  instagram: string | null;
  imagen_url: string | null;
  destacado: boolean;
  activo: boolean;
  orden: number;
}

export const comerciosIniciales: ComercioParroquial[] = [];

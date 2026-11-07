/**
 * Repositorio de documentos y archivos descargables (`parish_files`).
 *
 * Los documentos se suben y publican desde `/admin/archivos`.
 */

export interface ArchivoParroquial {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  archivo_url: string;
  archivo_path: string | null;
  nombre_archivo: string;
  mime_type: string;
  tamano_bytes: number;
  publicado: boolean;
  orden: number;
  created_at?: string;
}

export const archivosIniciales: ArchivoParroquial[] = [];

/**
 * Datos de la parroquia — constantes del sitio.
 *
 * Los datos de contacto salen del mockup (docs/mockups/inicio.png), donde
 * aparecen escritos. **Conviene que la parroquia los confirme** antes de
 * publicar: un diseño puede llevar datos de relleno con pinta de reales.
 */

export const parroquia = {
  nombre: 'Parroquia San Chárbel',
  nombreCorto: 'San Chárbel',
  patrono: 'San Chárbel Makhlouf',
  tagline: 'Una comunidad que ora, celebra y sirve con amor',

  // Ubicación
  direccion: 'Calle 98 # 65-120',
  barrio: 'Villa Carolina',
  ciudad: 'Barranquilla',
  departamento: 'Atlántico',
  pais: 'Colombia',
  get direccionCompleta() {
    return `${this.direccion}, ${this.barrio}, ${this.ciudad}, ${this.departamento}`;
  },

  // Contacto
  telefonoFijo: '(605) 309 0700',
  telefonoMovil: '317 658 4562',

  /**
   * ⚠️ El mockup escribe "info@parroquiasanchárbel.org", CON TILDE en el
   * dominio. Un dominio con tilde es un IDN: hay que registrarlo aparte y
   * muchos clientes de correo y validadores lo rechazan. Se usa la forma sin
   * tilde, que es casi con seguridad la intención. **Confirmar con la
   * parroquia cuál es la dirección real.**
   */
  email: 'info@parroquiasancharbel.org',

  // PENDIENTE: el diseño muestra los iconos pero no las URLs.
  facebook: null as string | null,
  instagram: null as string | null,
  youtube: null as string | null,
  whatsapp: null as string | null,

  arquidiocesis: 'Arquidiócesis de Barranquilla',
  arquidiocesisUrl: null as string | null,
} as const;

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
  /**
   * ⚠️ ESTA DIRECCIÓN CONTRADICE A LA FICHA DE GOOGLE. La de aquí sale del
   * mockup. La ficha del `cid` de abajo dice, palabra por palabra:
   *
   *     Cra 71 #91A-26, Riomar, Barranquilla, Atlántico
   *     Teléfono 302 8346450 · Plus code 25CM+6P
   *
   * No es una diferencia de matiz: cambian la vía y el número. Encaja además
   * con lo que se ve en el mapa incrustado, donde el pin cae entre las calles
   * 90a–93 y la Carrera 71; «Calle 98» y «Carrera 65» no aparecen por ninguna
   * parte. Todo apunta a que el mockup llevaba una dirección de relleno.
   *
   * NO SE HA CAMBIADO NADA a propósito: una ficha de Google también puede
   * estar desactualizada, y quien decide es la parroquia. Pero mientras esto
   * siga así, la página enseña una dirección que lleva a un sitio y un mapa
   * que lleva a otro. **Preguntar y corregir.**
   *
   * Los teléfonos de abajo tampoco coinciden con el de la ficha; misma
   * conversación.
   */
  direccion: 'Calle 98 # 65-120',
  barrio: 'Villa Carolina',
  ciudad: 'Barranquilla',
  departamento: 'Atlántico',
  pais: 'Colombia',
  get direccionCompleta() {
    return `${this.direccion}, ${this.barrio}, ${this.ciudad}, ${this.departamento}`;
  },

  /**
   * Ubicación exacta, sacada de la ficha de la parroquia en Google Maps.
   *
   * Estas coordenadas NO se retocan a ojo: son las de la ficha real. Si el pin
   * cayera mal, se corrige en Google y se vuelven a copiar de allí.
   *
   * Las URLs van escritas enteras y no concatenadas: apuntan a un servicio de
   * terceros, se leen mejor completas y así se pueden pegar en el navegador
   * para comprobarlas.
   *
   * En Google el lugar se llama «Parroquia San Charbel» — sin tilde en
   * «Charbel». Es cosa de la ficha, no del sitio; aquí la tilde se mantiene.
   */
  mapa: {
    lat: 11.0205836,
    lng: -74.8156569,
    zoom: 17,
    /**
     * ENLAZA SIEMPRE POR `cid`, NO POR COORDENADAS. El `cid` es el
     * identificador que Google da al lugar, así que abre la ficha de la
     * parroquia entera: nombre, fotos, teléfono y el botón de indicaciones.
     *
     * Hubo aquí un enlace de indicaciones construido con
     * `dir/?api=1&destination=<lat>,<lng>`, y el resultado era pobre: Maps no
     * reconoce unas coordenadas sueltas como lugar, así que enseñaba un punto
     * en el mapa sin nombre ni fotos. Comprobado abriendo las dos: por `cid`
     * el título es «Parroquia San Charbel»; por coordenadas, «Tu ubicación a
     * Cra 71 #91A-26».
     *
     * Para un enlace de indicaciones CON nombre haría falta el place ID
     * moderno (`ChIJ…`), que la ficha pública no expone. Desde la ficha, las
     * indicaciones están a un toque.
     */
    ficha: 'https://maps.google.com/?cid=17941626938708420674',
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

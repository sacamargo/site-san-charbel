# Conectar la agenda con Google Calendar

Guía paso a paso. No hace falta saber nada de Google Cloud antes de empezar.

Al terminar tendrás dos valores para pegar en un archivo `.env`:

```
GOOGLE_CALENDAR_ID=...
GOOGLE_CALENDAR_API_KEY=...
```

**Tiempo aproximado:** 15 minutos. **Costo:** cero. La lectura de calendarios públicos entra
en la cuota gratuita de Google (1.000.000 de peticiones al día); nuestra agenda hace unas 144.

---

## Parte 1 — Crear el calendario de la parroquia

> Hazlo con la cuenta de correo de la parroquia, **no con tu cuenta personal**. Quien tenga esa
> cuenta administra la agenda, y no queremos que dependa de una persona.

1. Entra a [calendar.google.com](https://calendar.google.com).
2. En la barra izquierda, junto a **Otros calendarios**, pulsa el **+** → **Crear calendario**.
3. Nombre: `Agenda Parroquia San Chárbel`.
4. Zona horaria: **(GMT-05:00) Bogotá**.
5. Pulsa **Crear calendario** y espera a que aparezca en la lista de la izquierda.

### Hacerlo público

Sin este paso la API responde `404` y la agenda queda vacía.

6. En la lista de la izquierda, pasa el cursor sobre el calendario nuevo → **⋮** →
   **Configuración y uso compartido**.
7. Baja hasta **Permisos de acceso a los eventos**.
8. Marca **Hacer disponible para el público**.
9. En el desplegable de al lado elige **Ver todos los detalles del evento**.
   - Si eliges *"Ver solo libre/ocupado"*, la API devuelve eventos sin título ni descripción y la
     agenda se ve como una lista de casillas vacías.
10. Google mostrará una advertencia de que el calendario será visible para cualquiera. Acepta.

> **Qué significa esto en la práctica:** cualquiera con el enlace puede ver los títulos, fechas,
> lugares y descripciones. Es exactamente lo que queremos —es una cartelera pública— pero por
> eso **no se escriben datos privados** ahí: nada de teléfonos de feligreses, nombres de
> personas en situaciones delicadas, ni notas internas.

### Copiar el ID del calendario

11. En esa misma pantalla de configuración, baja hasta **Integrar calendario**.
12. Copia el valor de **ID de calendario**. Se ve así:

    ```
    c_a1b2c3d4e5f6g7h8@group.calendar.google.com
    ```

Ese es tu `GOOGLE_CALENDAR_ID`. Guárdalo.

---

## Parte 2 — Crear la clave de API en Google Cloud

Google Cloud suena más grande de lo que es: aquí solo se usa para pedir un permiso de lectura.

1. Entra a [console.cloud.google.com](https://console.cloud.google.com) con la misma cuenta.
2. La primera vez te pedirá aceptar los términos y elegir país. Acepta.
3. Arriba a la izquierda, junto al logo, hay un selector de proyecto. Pulsa **Selecciona un
   proyecto** → **Proyecto nuevo**.
   - Nombre: `parroquia-san-charbel`
   - Ubicación: déjala como está.
   - **Crear**. Tarda unos segundos.
4. Asegúrate de que el selector de arriba muestre `parroquia-san-charbel`. Si no, selecciónalo.

### Habilitar la Calendar API

5. En el buscador de arriba escribe `Google Calendar API` y entra al resultado del
   **Marketplace de APIs**.
6. Pulsa **Habilitar**. Espera a que termine.

> Si te saltas este paso, la API responde `403` y verás el aviso *"La agenda no está disponible
> ahora mismo"*.

### Crear la clave

7. Menú lateral (☰) → **API y servicios** → **Credenciales**.
8. Arriba: **+ Crear credenciales** → **Clave de API**.
9. Aparece un cuadro con la clave. **Cópiala ahora**: empieza por `AIza...`.

Esa es tu `GOOGLE_CALENDAR_API_KEY`.

### Restringir la clave (importante)

Una clave sin restringir sirve para cualquier API de Google y, si se filtra, alguien podría
usarla a nombre del proyecto.

10. En el mismo cuadro pulsa **Editar clave de API** (o entra a la clave desde
    **Credenciales**).
11. En **Restricciones de API**, elige **Restringir clave** y marca solo
    **Google Calendar API**.
12. En **Restricciones de aplicación**, deja **Ninguna**.
    - *¿Por qué ninguna?* Las restricciones por sitio web (HTTP referrer) solo funcionan cuando
      la llamada sale del navegador. La nuestra sale del **servidor**, así que esa restricción
      la rompería. Si más adelante el sitio tiene IP fija, se puede restringir por **direcciones
      IP**.
13. **Guardar**. Los cambios tardan hasta 5 minutos en aplicarse.

---

## Parte 3 — Conectarlo al proyecto

En la carpeta del proyecto, crea un archivo llamado `.env` (copiando `.env.example`):

```bash
cp .env.example .env
```

Ábrelo y rellena las dos líneas:

```
GOOGLE_CALENDAR_ID=c_a1b2c3d4e5f6g7h8@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=AIzaSy...
```

Reinicia el servidor:

```bash
npm run dev
```

Abre `http://localhost:4321/agenda`. Si creaste algún evento de prueba en el calendario, debe
aparecer.

> `.env` está en `.gitignore`: **nunca se sube a GitHub**. Cada compañero crea el suyo, y en el
> servidor de producción las dos variables se configuran en el panel del hosting.

---

## Cómo se usa a partir de ahora

La parroquia crea y edita eventos **en Google Calendar**, como cualquier calendario. El sitio
los recoge solo. No hay panel de eventos que aprender, y no se puede escribir al calendario
desde la web.

Lo que se ve en el sitio, campo por campo:

| En Google Calendar | En el sitio |
|---|---|
| Título | Título de la tarjeta |
| Fecha y hora | Insignia de fecha y la línea de hora |
| Ubicación | Línea con el icono de lugar |
| Descripción | Texto de la tarjeta |
| URL de imagen en la descripción | Flyer de la tarjeta (ver [`AGENDA.md`](AGENDA.md) §3) |

**Los cambios tardan hasta 10 minutos en verse.** No es un error: el sitio guarda una copia
para no llamar a Google en cada visita. Si necesitas verlo al instante, reinicia el servidor.

---

## Si algo no funciona

| Lo que ves | Qué pasó | Cómo se arregla |
|---|---|---|
| *"La agenda todavía no está conectada"* | Falta una de las dos variables en `.env` | Revisa que estén escritas sin comillas y reinicia |
| *"La agenda no está disponible ahora mismo"* | Google rechazó la consulta | Mira la terminal: el mensaje dice si fue 403, 404 u otra cosa |
| En terminal: `404` | El calendario no es público, o el ID está mal | Repite Parte 1, pasos 6–10, y vuelve a copiar el ID |
| En terminal: `403` | La Calendar API no está habilitada, o la clave está restringida de más | Parte 2, pasos 5–6 y 10–13 |
| El calendario carga pero los eventos no tienen título | El permiso quedó en *"Ver solo libre/ocupado"* | Parte 1, paso 9 |
| Un evento sale un día corrido | No debería: está probado. Avísame con la fecha exacta | — |

Para ver el mensaje exacto, mira la terminal donde corre `npm run dev`: los errores se
registran con el prefijo `[agenda]`.

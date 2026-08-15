# Banner San Chárbel → VEO 3

## Archivo

Usa esta imagen (sin texto de UI):

`docs/veo/san-charbel-banner-veo.png`

También está en el sitio como `src/assets/san-charbel/banner.png`.

## Duración recomendada

**4 segundos**, en bucle.

- Suficiente para un movimiento sutil (barba, tela, niebla, luz).
- Corto para que el loop no se note “pesado” en un hero.
- Si VEO solo ofrece 5–8 s, elige la opción más corta disponible (ideal ≤ 6 s).

## Prompt para VEO 3

```text
Subtle cinematic looping animation from this still image. Keep the exact composition, character, and landscape unchanged: Saint Charbel Makhlouf on the right as an elderly Maronite monk with long white beard, black hooded habit, soft golden halo, Lebanese mountains and stone monastery at golden hour behind him. Very small motion only: gentle breeze moving a few strands of the beard and the edge of the hood fabric; soft atmospheric haze drifting slowly over distant mountains; warm sunlight shifting almost imperceptibly; tiny dust motes floating in the light. No camera cut, no zoom, no pan, no morphing face, no new objects, no text, no watermark. Seamless loop, meditative sacred mood, photorealistic, high detail.
```

## Notas de uso en la web

Cuando tengas el MP4/WebM:

1. Sustituye (o complementa) la `<Image>` del hero en `src/pages/san-charbel.astro` por un `<video autoplay muted loop playsinline>`.
2. Mantén la imagen estática como `poster` y fallback.
3. El texto del hero (“Conoce a…”) debe seguir en HTML, no dentro del video.

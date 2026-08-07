// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // `site` queda pendiente hasta que se confirme el dominio de producción.
  // Sin él no se pueden emitir canonical ni Open Graph absolutos.

  // Sistema de diseño §2.1 — Playfair Display (display) + Nunito Sans (texto),
  // self-hosted con font-display: swap. La API de fuentes de Astro descarga y
  // sirve los archivos desde nuestro dominio, y genera fallbacks ajustados por
  // métricas (capsize), que es lo que sostiene el objetivo de CLS < 0.05 (§8.4).
  //
  // El precarga selectiva ("solo los dos cortes del hero") se declara en
  // BaseLayout.astro con el prop `preload` de <Font />, no aquí.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      weights: [400, 700],
      styles: ['normal'],
      // 'latin' cubre á é í ó ú ñ ü ¿ ¡ — todo lo que necesita el español.
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Nunito Sans',
      cssVariable: '--font-nunito',
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['-apple-system', 'Segoe UI', 'sans-serif'],
    },
  ],
});

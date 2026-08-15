// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },

  // Tipografía self-hosted, sin dependencias añadidas: Astro descarga los
  // archivos, los sirve desde nuestro dominio y genera fallbacks ajustados por
  // métricas (lo que sostiene el objetivo de CLS).
  //
  // Las variables que genera (--font-playfair, --font-nunito) se puentean a
  // Tailwind en el @theme de src/styles/global.css. Si borras este bloque,
  // <Font /> revienta en tiempo de petición y toda la tipografía del sitio cae
  // a la del navegador.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      weights: [400, 700],
      styles: ['normal', 'italic'],
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

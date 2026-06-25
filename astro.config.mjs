import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  site: 'https://wenhaoyu-bryan.github.io',
  base: '/AI-PM-Workbench',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});

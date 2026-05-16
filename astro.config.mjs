// ⛔ DO NOT EDIT for routine content updates.
// Astro build config (site URL, integrations). Edit only for build behavior.
// For content updates, edit src/data/*.yaml or src/content/wiki/*.md.

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://limelab.science',
  integrations: [tailwind({ applyBaseStyles: false })],
  build: {
    format: 'directory',
  },
  redirects: {
    '/team': '/people/',
  },
});

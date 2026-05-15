import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://limelab.science',
  integrations: [tailwind({ applyBaseStyles: false })],
  build: {
    format: 'directory',
  },
});

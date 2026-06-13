import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://qdn.vn',
  // Inline the page's CSS into <style> in <head> so it isn't a separate
  // render-blocking request — collapses the critical request chain to the HTML.
  build: { inlineStylesheets: 'always' },
  integrations: [tailwind({ applyBaseStyles: false })],
});

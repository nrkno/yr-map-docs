// @ts-check
import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

// https://astro.build/config
export default defineConfig({
  site: 'https://nrkno.github.io',
  base: 'yr-map-docs',
  output: 'static',
  build: {
    assets: 'assets',
  },
  vite: {
    plugins: [glsl()],
  },
});

import { defineConfig } from 'astro/config';

// Publicado em https://ayr-farias.github.io/13-Luas/
// Para domínio próprio ou outro nome de repositório, ajuste `site` e `base`.
export default defineConfig({
  site: 'https://ayr-farias.github.io',
  base: '/13-Luas',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { businessSchema } from './src/data/businessSchema.js'

// Resolve image imports to prepared responsive files, keeping full-size masters
// out of the production bundle. Preparation runs before the build.
function optimizedImages() {
  let images = {};
  try { images = JSON.parse(readFileSync('.cache/local-images.json', 'utf8')); } catch { /* First dev run can use source images. */ }
  return {
    name: 'ubc-optimized-images', enforce: 'pre',
    transformIndexHtml(html) {
      return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, value, close) =>
        open + JSON.stringify(JSON.parse(value).map(item => item['@id'] === businessSchema['@id'] ? businessSchema : item)) + close);
    },
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !/\.(png|jpe?g|webp)$/.test(source)) return;
      const image = images[resolve(dirname(importer), source)];
      if (image) return '\0ubc-image:' + image.src;
    },
    load(id) {
      if (id.startsWith('\0ubc-image:')) return `export default ${JSON.stringify(id.slice('\0ubc-image:'.length))};`;
    },
    transform(code, id) {
      if (!id.endsWith('.css')) return;
      return code.replace(/url\(['"]?(\.[^)'"\s]+)['"]?\)/g, (full, source) => {
        const image = images[resolve(dirname(id), source)];
        return image ? `url('${image.src}')` : full;
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [optimizedImages(), react()],
  build: { manifest: true },
  css: {
    // Inline PostCSS config — prevents Vite from searching parent directories
    // for postcss.config files from unrelated projects.
    // This project uses vanilla CSS and needs no PostCSS plugins.
    postcss: {
      plugins: [],
    },
  },
})


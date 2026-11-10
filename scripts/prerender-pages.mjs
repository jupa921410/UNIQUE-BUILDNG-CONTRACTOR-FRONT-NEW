import { build } from 'vite';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export async function writePrerenderedPages(root, dist, template) {
  const temporary = join(root, '.tmp-prerender');
  try {
    await build({ root, logLevel: 'warn', build: { ssr: 'scripts/prerender-entry.jsx', outDir: temporary, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'entry.mjs' } } } });
    const { renderPages } = await import(pathToFileURL(join(temporary, 'entry.mjs')).href);
    for (const page of renderPages()) {
      let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escape(page.title)}</title>`)
        .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escape(page.canonical)}" />`)
        .replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root">${page.content}</div>`);
      for (const [key, value] of Object.entries({ description: page.description, 'og:title': page.title, 'og:description': page.description, 'og:url': page.canonical, 'og:type': page.type, 'og:image': page.image, 'twitter:image': page.image, 'twitter:title': page.title, 'twitter:description': page.description, 'twitter:url': page.canonical, ...(page.noindex ? { robots: 'noindex, nofollow' } : {}) })) {
        html = html.replace(new RegExp(`<meta\\s+(?:name|property)="${key}"[^>]*>`, 'i'), match => match.replace(/content="[^"]*"/, () => `content="${escape(value)}"`));
      }
      const output = page.path === '/404' ? join(dist, '404.html') : join(dist, page.path.slice(1), 'index.html');
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, html);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

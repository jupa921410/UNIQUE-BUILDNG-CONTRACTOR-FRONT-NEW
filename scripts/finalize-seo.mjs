import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import sharp from 'sharp';
import { businessSchema, SITE_URL } from '../src/data/businessSchema.js';
import { metaDescription, pageDescriptions } from '../src/data/seoMetadata.js';

const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
export async function finalizeSeo(dist) {
  const manifest = JSON.parse(await readFile(join(dist, '.vite/manifest.json'), 'utf8'));
  const publicImages = JSON.parse(await readFile(join(dist, '../.cache/public-images.json'), 'utf8'));
  for (const [url, image] of Object.entries(publicImages)) {
    if (url.startsWith('/blog/images/') || url === '/meta.jpg') {
      // Retain these public URLs for schema and external shares, with optimized bytes.
      let buffer = await readFile(join(dist, image.src.slice(1)));
      if (url === '/meta.jpg') {
        for (let quality = 72; quality >= 22; quality -= 10) {
          buffer = await sharp(join(dist, image.src.slice(1))).jpeg({ quality, mozjpeg: true }).toBuffer();
          if (buffer.length <= 150000) break;
        }
        if (buffer.length > 150000) throw new Error('Business image exceeds 150 KB');
      }
      await writeFile(join(dist, url.slice(1)), buffer);
    }
  }
  await mkdir(join(dist, 'previews'), { recursive: true });
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) { await walk(path); continue; }
      if (!entry.name.endsWith('.html')) continue;
      let html = await readFile(path, 'utf8');
      const relativePath = relative(dist, path).replaceAll('\\', '/');
      const canonicalPath = '/' + relativePath.replace(/(?:^|\/)index\.html$/, '');
      const component = canonicalPath.startsWith('/service-areas/') ? 'CityPage' : ({ '/aboutus': 'AboutUsPage', '/service-areas': 'ServiceAreasPage', '/resources': 'ResourcesPage', '/specialized': 'SpecializedPage', '/privacy': 'LegalPage', '/terms': 'LegalPage' })[canonicalPath];
      const entryKey = Object.keys(manifest).find(key => key.endsWith(`/${component}.jsx`));
      const styles = new Set(), visited = new Set();
      const collectStyles = key => {
        if (!key || visited.has(key)) return;
        visited.add(key);
        for (const css of manifest[key]?.css || []) styles.add(css);
        for (const dependency of manifest[key]?.imports || []) collectStyles(dependency);
      };
      collectStyles(entryKey);
      for (const css of styles) if (!html.includes(`href="/${css}"`)) html = html.replace('</head>', `<link rel="stylesheet" href="/${css}" /></head>`);
      html = html.replace(/<meta\s+name="keywords"[^>]*>\s*/gi, '');
      html = html.replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")([^"]*)("[^>]*>)/gi,
        (_, before, content, after) => before + escape(metaDescription(pageDescriptions[canonicalPath] || decode(content))) + after);
      html = html.replace(/<img\b[^>]*>/g, tag => {
        const source = decode(tag.match(/\bsrc="([^"]*)"/)?.[1] || '');
        const image = publicImages[source];
        if (!image) return tag;
        return tag.replace(/\s(?:srcset|sizes|decoding|loading)="[^"]*"/g, '').replace(/\bsrc="[^"]*"/, `src="${escape(image.src)}"`)
          .replace(/\s*\/?>(?=$)/, ` srcset="${escape(image.srcSet)}" sizes="(max-width: 640px) 100vw, 960px" decoding="async" loading="lazy" />`);
      });
      html = html.replace(/(<script[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (full, open, value, close) => {
        const replaceBusiness = item => {
          if (Array.isArray(item)) return item.map(replaceBusiness);
          if (!item || typeof item !== 'object') return item;
          if (item['@id'] === businessSchema['@id'] && item.name) return businessSchema;
          return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, replaceBusiness(value)]));
        };
        return open + JSON.stringify(replaceBusiness(JSON.parse(value))).replaceAll('<', '\\u003c') + close;
      });
      const route = relative(dist, path).replaceAll('\\', '/').replace(/(?:^|\/)index\.html$/, '') || 'home';
      const previewName = route.replace(/[^a-z0-9-]/gi, '-') + '.jpg';
      const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || 'Unique Building Contractors').split(' | ')[0];
      const words = title.split(/\s+/), lines = [''];
      for (const word of words) {
        if ((lines.at(-1) + word).length > 24) lines.push('');
        lines[lines.length - 1] += word + ' ';
      }
      const text = `<svg width="1200" height="630"><rect width="590" height="630" fill="#112033"/><text x="55" y="85" font-size="20" font-family="sans-serif" fill="#c19d63">UNIQUE BUILDING CONTRACTORS</text><text x="55" y="190" font-family="sans-serif" font-size="38" font-weight="600" fill="white">${lines.slice(0, 7).map((line, index) => `<tspan x="55" dy="${index ? 50 : 0}">${escape(line.trim())}</tspan>`).join('')}</text><text x="55" y="570" font-family="sans-serif" font-size="21" fill="#c19d63">TAMPA BAY, FL · (813) 523-7828</text></svg>`;
      const image = await sharp(join(dist, 'blog/images/interior.webp')).resize(610, 630, { fit: 'cover' }).toBuffer();
      await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#112033' } }).composite([{ input: image, left: 590, top: 0 }, { input: Buffer.from(text) }]).jpeg({ quality: 76 }).toFile(join(dist, 'previews', previewName));
      const previewUrl = `${SITE_URL}/previews/${previewName}`;
      html = html.replace(/(<meta\s+(?:name|property)="(?:og:image|twitter:image)"\s+content=")[^"]*("[^>]*>)/g, (_, before, after) => before + previewUrl + after);
      await writeFile(path, html);
    }
  }
  await walk(dist);
}

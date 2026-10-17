import sharp from 'sharp';
import { mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, relative } from 'node:path';
import { loadEnv } from 'vite';

const root = resolve(import.meta.dirname, '..');
const env = loadEnv('production', root, 'VITE_');
const api = (process.env.VITE_API_BASE_URL || env.VITE_API_BASE_URL || 'https://admin.uniquebuildingcontractors.com').replace(/\/$/, '');
const response = await fetch(`${api}/api/showcase`, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw new Error(`Portfolio preparation failed: ${response.status}`);
const payload = await response.json();
const projects = Array.isArray(payload) ? payload : payload.data;
if (!Array.isArray(projects)) throw new Error('Expected published project list');
await mkdir(join(root, '.cache'), { recursive: true });
await writeFile(join(root, '.cache/projects.json'), JSON.stringify(projects));

const output = join(root, 'public/media');
await mkdir(output, { recursive: true });
const sources = new Map();
async function walk(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) await walk(path);
    else if (/\.(jsx|js)$/.test(path)) {
      const text = await readFile(path, 'utf8');
      for (const match of text.matchAll(/import\s+\w+\s+from\s+['"]([^'"]+\.(?:png|jpe?g|webp))['"]/g)) {
        if (!match[1].startsWith('.')) continue;
        const absolute = resolve(dirname(path), match[1]);
        sources.set(absolute, { path: absolute });
      }
    }
  }
}
await walk(join(root, 'src'));
for (const name of await readdir(join(root, 'public/blog/images'))) {
  if (/\.webp$/.test(name)) sources.set(`/blog/images/${name}`, { path: join(root, 'public/blog/images', name) });
}
sources.set('/meta.jpg', { path: join(root, 'public/meta.jpg') });
for (const project of projects) for (const item of project.images || []) {
  // Width-only resizing preserves the equirectangular aspect ratio for the 360 viewer.
  if (['image', 'image_360'].includes(item.media_type) && item.url) sources.set(item.url, { remote: item.url });
}

const imports = [], entries = [], localImages = {}, publicImages = {};
let index = 0;
for (const [key, source] of sources) {
  const buffer = source.remote ? await (async () => {
    const result = await fetch(source.remote, { signal: AbortSignal.timeout(30000) });
    if (!result.ok) throw new Error(`Image download failed: ${result.status} ${source.remote}`);
    return Buffer.from(await result.arrayBuffer());
  })() : await readFile(source.path);
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
  const meta = await sharp(buffer).metadata();
  const widths = [...new Set([480, 960, Math.min(meta.width, 1280)].filter(width => width <= meta.width))].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const name = `${hash}-${width}.webp`;
    try {
      const existing = await stat(join(output, name));
      if (existing.size <= 150000) {
        variants.push({ src: `/media/${name}`, width, bytes: existing.size });
        continue;
      }
    } catch { /* Encode a new source or width. */ }
    let encoded;
    for (let quality = 82; quality >= 22; quality -= 10) {
      encoded = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, alphaQuality: 55, effort: 5 }).toBuffer();
      if (encoded.length <= 150000) break;
    }
    if (encoded.length > 150000) throw new Error(`Image exceeds 150 KB: ${key}, ${width}`);
    await writeFile(join(output, name), encoded);
    variants.push({ src: `/media/${name}`, width, bytes: encoded.length });
  }
  let expression = JSON.stringify(key);
  if (!key.startsWith('/') && !source.remote || key.startsWith(root)) {
    const identifier = `image${index++}`;
    imports.push(`import ${identifier} from ${JSON.stringify('../' + relative(join(root, 'src'), source.path).replaceAll('\\', '/'))};`);
    expression = identifier;
  }
  const largest = variants.at(-1);
  const image = { src: largest.src, srcSet: variants.map(v => `${v.src} ${v.width}w`).join(', '), width: largest.width, height: Math.round(largest.width * meta.height / meta.width) };
  if (source.path && key.startsWith(root)) localImages[source.path] = image;
  else publicImages[key] = image;
  entries.push(`[${expression}, ${JSON.stringify(image)}]`);
}
await writeFile(join(root, 'src/data/responsiveImages.js'), `${imports.join('\n')}\nexport const responsiveImages = new Map([\n${entries.join(',\n')}\n]);\n`);
await writeFile(join(root, '.cache/local-images.json'), JSON.stringify(localImages));
await writeFile(join(root, '.cache/public-images.json'), JSON.stringify(publicImages));
console.log(`Prepared responsive images for ${sources.size} sources; every variant is at most 150 KB.`);

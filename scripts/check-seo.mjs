import { readFile, access, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { businessSchema, SITE_URL } from '../src/data/businessSchema.js';
import { PHASE1_CITIES } from '../src/data/serviceAreasData.js';

const dist = 'dist';
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const errors = [];
const titles = new Map();
const exists = async path => { try { await access(path); return true; } catch { return false; } };
const fail = (url, message) => errors.push(`${url}: ${message}`);
for (const url of urls) {
  const { pathname } = new URL(url);
  const file = join(dist, decodeURIComponent(pathname), 'index.html');
  if (!await exists(file)) { fail(url, 'missing prerendered page'); continue; }
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) fail(url, 'missing title');
  else if (titles.has(title)) fail(url, `duplicate title with ${titles.get(title)}`);
  else titles.set(title, url);
  if ((html.match(/<h1\b/g) || []).length !== 1) fail(url, 'expected one H1');
  const canonicals = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
  if (canonicals.length !== 1 || canonicals[0][1] !== url) fail(url, 'incorrect canonical');
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) fail(url, 'missing description');
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
  if (description.length > 175 || /free consultation/i.test(description)) fail(url, 'invalid description');
  if (/name="keywords"/i.test(html)) fail(url, 'obsolete keywords');
  if (/fonts\.googleapis|unpkg\.com\/aos/.test(html)) fail(url, 'external render-blocking assets');
  const preview = html.match(/property="og:image" content="([^"]*)"/)?.[1];
  if (!preview?.startsWith(SITE_URL + '/previews/')) fail(url, 'missing own preview');
  else {
    const image = join(dist, new URL(preview).pathname);
    if (!await exists(image) || (await stat(image)).size > 150000) fail(url, 'missing preview or exceeds 150 KB');
  }
  if (/<meta\s+name="robots"[^>]*content="[^"]*noindex/.test(html)) fail(url, 'sitemap page is noindex');
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!schemas.length) fail(url, 'missing structured data');
  for (const [, json] of schemas) { try { JSON.parse(json); } catch { fail(url, 'invalid JSON-LD'); } }
  for (const [, href] of html.matchAll(/<(?:a|img|script|link)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
    const target = new URL(href.replaceAll('&amp;', '&'), url);
    if (target.origin !== SITE_URL || target.pathname === '/' || target.pathname.startsWith('/portal')) continue;
    const path = join(dist, decodeURIComponent(target.pathname));
    if (!await exists(path) && !await exists(join(path, 'index.html'))) fail(url, `missing internal target ${target.pathname}`);
  }
}
if (new Set(urls).size !== urls.length) errors.push('Duplicate sitemap URLs');
if (JSON.stringify(businessSchema.areaServed.map(item => item.url).sort()) !== JSON.stringify(PHASE1_CITIES.map(item => `${SITE_URL}/service-areas/${item.slug}`).sort())) errors.push('Business service areas do not match landing pages');
const notFound = await readFile(join(dist, '404.html'), 'utf8');
if (!/content="noindex, nofollow"/.test(notFound)) errors.push('404 must be noindex');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`SEO checks passed for ${urls.length} sitemap pages: HTML, titles, H1, canonicals, descriptions, JSON-LD and internal targets.`);

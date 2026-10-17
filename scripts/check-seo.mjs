import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { PHASE1_CITIES } from '../src/data/serviceAreasData.js';
import { businessSchema, SITE_URL } from '../src/data/businessSchema.js';

const xml = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(join('dist', path.slice(1), 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `Missing title: ${path}`);
  assert.ok(!titles.has(title), `Duplicate title: ${path}`);
  titles.add(title);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `Duplicate canonical: ${path}`);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Wrong canonical: ${path}`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `Expected one H1: ${path}`);
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert.ok(description && description.length <= 175, `Invalid description: ${path}`); // allows escaped ampersands
  assert.ok(!/free consultation/i.test(description), `Forbidden description phrase: ${path}`);
  assert.ok(!/name="keywords"/i.test(html), `Obsolete keywords: ${path}`);
  assert.ok(!/fonts\.googleapis|unpkg\.com\/aos/.test(html), `External render-blocking assets: ${path}`);
  const preview = html.match(/property="og:image" content="([^"]*)"/)?.[1];
  assert.ok(preview?.startsWith(SITE_URL + '/previews/'), `Missing own preview: ${path}`);
  assert.ok((await stat(join('dist', new URL(preview).pathname.slice(1)))).size <= 150000, `Preview exceeds 150 KB: ${path}`);
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
}
assert.deepEqual(businessSchema.areaServed.map(item => item.url).sort(), PHASE1_CITIES.map(item => `${SITE_URL}/service-areas/${item.slug}`).sort());
const error = await readFile('dist/404.html', 'utf8');
assert.ok(error.includes('noindex, nofollow') && error.includes('<h1>Page Not Found</h1>'));
console.log(`Passed SEO checks for ${urls.length} URLs and ${PHASE1_CITIES.length} matching service areas.`);

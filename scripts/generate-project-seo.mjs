import { serviceContent, serviceHtml } from './service-seo.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const siteUrl = 'https://www.uniquebuildingcontractors.com';

// Resolve the backend URL exactly like `vite build` does: .env, .env.production,
// then any local overrides. A plain `node` process does not read .env files on
// its own, so without this the script always fell back to the hardcoded host.
const mode = process.env.NODE_ENV || 'production';
const viteEnv = loadEnv(mode, root, 'VITE_');
const apiBase = (process.env.VITE_API_BASE_URL || viteEnv.VITE_API_BASE_URL || 'https://admin.uniquebuildingcontractors.com').replace(/\/$/, '');
const buildDate = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { path: '/',                                    changefreq: 'weekly',  priority: '1.0' },
  { path: '/aboutus',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/portfolio',                           changefreq: 'weekly',  priority: '0.8' },
  { path: '/specialized',                         changefreq: 'monthly', priority: '0.7' },
  { path: '/resources',                           changefreq: 'monthly', priority: '0.7' },
  { path: '/services/new-construction',           changefreq: 'monthly', priority: '0.9' },
  { path: '/services/remodeling',                 changefreq: 'monthly', priority: '0.9' },
  { path: '/services/additions',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/services/kitchens-bathrooms',         changefreq: 'monthly', priority: '0.9' },
  { path: '/services/flooring',                   changefreq: 'monthly', priority: '0.8' },
  { path: '/services/projectmanagement',          changefreq: 'monthly', priority: '0.7' },
];

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const escapeXml = escapeHtml;
const plainText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

function replaceMeta(html, attribute, key, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escaped}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function projectHtml(template, project) {
  const path = `/portfolio/${project.slug}`;
  const canonical = `${siteUrl}${path}`;
  const description = plainText(project.description).slice(0, 160);
  const location = plainText(project.location);
  const title = `${plainText(project.title)}${location ? ` — ${location}` : ''} | Unique Building Contractors`;
  const images = (project.images || []).filter(item => item.url && ['image', 'image_360'].includes(item.media_type));
  const primaryImage = images.find(item => item.is_primary)?.url || images[0]?.url || `${siteUrl}/meta.jpg`;
  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'WebPage', name: project.title,
      description, url: canonical, primaryImageOfPage: primaryImage,
      about: { '@id': `${siteUrl}/#business` },
    },
    {
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title,
      description, url: canonical, image: images.map(item => item.url),
      locationCreated: project.location || undefined,
      dateCreated: project.completion_date || undefined,
      creator: { '@id': `${siteUrl}/#business` },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${siteUrl}/portfolio` },
        { '@type': 'ListItem', position: 3, name: project.title, item: canonical },
      ],
    },
    ...images.map(item => ({
      '@context': 'https://schema.org', '@type': 'ImageObject', contentUrl: item.url,
      caption: item.caption || project.title, representativeOfPage: Boolean(item.is_primary),
    })),
  ];

  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:type', 'article');
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:image', primaryImage);
  html = replaceMeta(html, 'name', 'twitter:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', primaryImage);

  // Overwrite the template's base canonical (index.html ships a self-referential
  // one) instead of appending a second <link rel="canonical"> — two conflicting
  // canonicals let Google pick the wrong URL.
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  html = /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag)
    : html.replace('</head>', `    ${canonicalTag}\n  </head>`);

  const serializedProject = JSON.stringify(project).replaceAll('<', '\\u003c');
  const seo = `    <script type="application/ld+json">${JSON.stringify(schemas).replaceAll('<', '\\u003c')}</script>\n    <script id="ubc-project-data" type="application/json">${serializedProject}</script>\n`;
  const crawlableContent = `<article data-project-seo-snapshot><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description)}</p>${primaryImage ? `<img src="${escapeHtml(primaryImage)}" alt="${escapeHtml(project.title)}" />` : ''}</article>`;
  return html
    .replace('</head>', `${seo}  </head>`)
    // The template's root div now ships its own home-page crawlable snapshot
    // (see index.html) — swap it out for this project's snapshot instead.
    // Note: Vite hoists the entry <script type="module"> into <head> at build
    // time, so the root div is the last thing before </body> — match on the
    // div's own (single, unnested) closing tag rather than a trailing script.
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${crawlableContent}</div>`);
}

function portfolioIndexHtml(template, projects) {
  const canonical = `${siteUrl}/portfolio`;
  const title = 'Tampa Bay Construction & Remodeling Portfolio | Unique Building Contractors';
  const description = 'Explore completed home construction, remodeling, kitchen, bathroom and flooring projects by Unique Building Contractors across Tampa Bay.';
  const primaryImage = `${siteUrl}/meta.jpg`;

  const itemList = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Portfolio',
    description, url: canonical, about: { '@id': `${siteUrl}/#business` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem', position: index + 1,
        url: `${siteUrl}/portfolio/${project.slug}`,
        name: plainText(project.title),
      })),
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: canonical },
    ],
  };

  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:type', 'website');
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:image', primaryImage);
  html = replaceMeta(html, 'name', 'twitter:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', primaryImage);

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  html = /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag)
    : html.replace('</head>', `    ${canonicalTag}\n  </head>`);

  const seo = `    <script type="application/ld+json">${JSON.stringify([itemList, breadcrumb]).replaceAll('<', '\\u003c')}</script>\n`;
  const listItems = projects.map(project => {
    const href = `/portfolio/${project.slug}`;
    const location = plainText(project.location);
    const label = escapeHtml(`${plainText(project.title)}${location ? ` — ${location}` : ''}`);
    return `<li><a href="${escapeHtml(href)}">${label}</a></li>`;
  }).join('');
  const crawlableContent = `<article data-portfolio-seo-snapshot><h1>Tampa Bay Construction &amp; Remodeling Portfolio</h1><p>${escapeHtml(description)}</p><nav aria-label="Projects"><ul>${listItems}</ul></nav></article>`;

  return html
    .replace('</head>', `${seo}  </head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${crawlableContent}</div>`);
}

async function fetchPublishedProjects() {
  const response = await fetch(`${apiBase}/api/showcase`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Showcase API returned ${response.status}`);
  const payload = await response.json();
  const projects = Array.isArray(payload) ? payload : payload.data;
  if (!Array.isArray(projects)) throw new Error('Showcase API did not return a project array');
  return projects.filter(project => project?.slug);
}

const template = await readFile(join(dist, 'index.html'), 'utf8');
for (const service of serviceContent) {
  const output = join(dist, 'services', service.id, 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, serviceHtml(template, service, siteUrl), 'utf8');
}
console.log('Generated SEO HTML for ' + serviceContent.length + ' services.');

const projects = await fetchPublishedProjects();

// Portfolio landing page. Without this file Apache returns 403 for /portfolio/
// because the directory exists (it holds the per-project folders) but has no
// index — and the SPA shell alone can't be reached at that path.
await mkdir(join(dist, 'portfolio'), { recursive: true });
await writeFile(join(dist, 'portfolio', 'index.html'), portfolioIndexHtml(template, projects), 'utf8');

for (const project of projects) {
  const output = join(dist, 'portfolio', project.slug, 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, projectHtml(template, project), 'utf8');
}

const projectUrls = projects.map(project => ({
  path: `/portfolio/${project.slug}`,
  lastmod: project.completion_date
    ? String(project.completion_date).slice(0, 10)
    : buildDate,
  changefreq: 'monthly',
  priority: '0.7',
}));

const allUrls = [
  ...staticUrls.map(u => ({ ...u, lastmod: buildDate })),
  ...projectUrls,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ path, lastmod, changefreq, priority }) =>
  `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
).join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated SEO HTML for ${projects.length} published projects and sitemap.xml with ${allUrls.length} URLs.`);

import { normalizeProject, legacyPortfolioRoutes } from '../src/data/portfolioRoutes.js';
import { projectArea, projectBlocks, projectCity, projectImageAlt, projectMetaDescription, projectService, projectsForArea, relatedProjects } from '../src/data/projectContent.js';
import { finalizeSeo } from './finalize-seo.mjs';
import { writePrerenderedPages } from './prerender-pages.mjs';
import { serviceContent, serviceHtml } from './service-seo.mjs';
import { contactFaqHtml } from './contact-faq-seo.mjs';
import { writeBlogPages } from './blog-seo.mjs';
import { renderSitemap, staticUrls } from './sitemap.mjs';
import { PHASE1_CITIES } from '../src/data/serviceAreasData.js';
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




const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const plainText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

function replaceMeta(html, attribute, key, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escaped}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

const STATUS_LABELS = { completed: 'Completed', in_progress: 'In progress', coming_soon: 'Coming soon' };

function projectSnapshot(project, projects, images) {
  const city = projectCity(project);
  const service = projectService(project);
  const area = projectArea(project);
  const facts = [
    ['Category', project.category],
    ['Location', project.location],
    ['Status', STATUS_LABELS[project.project_status]],
    ['Size', project.square_feet ? `${Number(project.square_feet).toLocaleString('en-US')} sq ft` : null],
    ['Completed', project.completion_date ? new Date(project.completion_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null],
  ].filter(([, value]) => value);
  const overview = projectBlocks(project.description).map(block => block.type === 'ul'
    ? `<ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : `<p>${escapeHtml(block.text)}</p>`).join('');
  const gallery = images.map((item, index) => `<li><img src="${escapeHtml(item.url)}" alt="${escapeHtml(projectImageAlt(project, index, item))}" /></li>`).join('');
  const related = relatedProjects(project, projects).map(item => {
    const itemCity = projectCity(item);
    return `<li><a href="/portfolio/${escapeHtml(item.slug)}">${escapeHtml(item.title + (itemCity ? ` — ${itemCity}, FL` : ''))}</a></li>`;
  }).join('');
  const heading = `${project.title}${city ? ` in ${city}, FL` : ''}`;

  return `<article data-project-seo-snapshot>`
    + `<nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/portfolio">Portfolio</a> / <span>${escapeHtml(project.title)}</span></nav>`
    + `<h1>${escapeHtml(heading)}</h1>`
    + (facts.length ? `<dl>${facts.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl>` : '')
    + (overview ? `<h2>Project Overview</h2>${overview}` : '')
    + (gallery ? `<h2>Project Photos</h2><ul>${gallery}</ul>` : '')
    + `<h2>Related Services</h2><ul><li><a href="${service.path}">${escapeHtml(service.name)}</a></li>`
    + (area ? `<li><a href="/service-areas/${area.slug}">Remodeling contractor in ${escapeHtml(area.city)}, FL</a></li>` : `<li><a href="/service-areas">Tampa Bay service areas</a></li>`)
    + `</ul>`
    + (related ? `<h2>More Projects</h2><ul>${related}</ul>` : '')
    + `<p>Planning a similar project? Call Unique Building Contractors at <a href="tel:+18135237828">(813) 523-7828</a>.</p>`
    + `</article>`;
}

function projectHtml(template, project, projects) {
  const path = `/portfolio/${project.slug}`;
  const canonical = `${siteUrl}${path}`;
  const description = projectMetaDescription(project);
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
      locationCreated: project.location ? {
        '@type': 'Place', name: project.location,
        address: { '@type': 'PostalAddress', addressLocality: projectCity(project) || undefined, addressRegion: 'FL', addressCountry: 'US' },
      } : undefined,
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
  // index.html ships Tampa's geo tags; a project page must not claim Tampa when
  // the work was in Zephyrhills or St. Petersburg. Keep the region, set the city,
  // and drop the Tampa coordinates (we do not have per-project coordinates).
  if (projectCity(project)) html = replaceMeta(html, 'name', 'geo.placename', `${projectCity(project)}, FL`);
  html = html.replace(/\s*<meta\s+name=["'](?:geo\.position|ICBM)["'][^>]*>/gi, '');

  // Overwrite the template's base canonical (index.html ships a self-referential
  // one) instead of appending a second <link rel="canonical"> — two conflicting
  // canonicals let Google pick the wrong URL.
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  html = /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag)
    : html.replace('</head>', `    ${canonicalTag}\n  </head>`);

  const serializedProject = JSON.stringify(project).replaceAll('<', '\\u003c');
  const seo = `    <script type="application/ld+json">${JSON.stringify(schemas).replaceAll('<', '\\u003c')}</script>\n    <script id="ubc-project-data" type="application/json">${serializedProject}</script>\n`;
  const orderedImages = [...images.filter(item => item.is_primary), ...images.filter(item => !item.is_primary)];
  const crawlableContent = projectSnapshot(project, projects, orderedImages);
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
  return projects.filter(project => project?.slug).map(normalizeProject);
}

const template = await readFile(join(dist, 'index.html'), 'utf8');
await writeBlogPages(dist);
await writePrerenderedPages(root, dist, template);
for (const path of ['/contact', '/faq']) {
  const output = join(dist, path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, contactFaqHtml(template, path, siteUrl), 'utf8');
}
// /get-started (QualifyPage) — lead form linked from ads and Messenger/SMS.
// Without its own HTML file Apache answers 404, so link previews (Facebook,
// Messenger, iMessage) showed the "Page Not Found" title and image.
{
  const path = '/get-started';
  const canonical = `${siteUrl}${path}`;
  const title = 'Get Started — Tell Us About Your Project | Unique Building Contractors';
  const description = 'Answer a few quick questions about your construction or remodeling project so the Unique Building Contractors team can prepare for your consultation.';
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'name', 'robots', 'noindex, nofollow');
  html = replaceMeta(html, 'property', 'og:type', 'website');
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'name', 'twitter:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root"><article><h1>Get Started — Tell Us About Your Project</h1><p>${escapeHtml(description)}</p><a href="tel:+18135237828">(813) 523-7828</a></article></div>`);
  const output = join(dist, 'get-started', 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
}
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
  await writeFile(output, projectHtml(template, project, projects), 'utf8');
}

// Service-area pages are prerendered before the project list is known; fill
// their "Recent projects" list so each city links to real portfolio pages.
for (const area of PHASE1_CITIES) {
  const file = join(dist, 'service-areas', area.slug, 'index.html');
  const html = await readFile(file, 'utf8');
  const marker = /<ul([^>]*)data-city-projects="true"([^>]*)><\/ul>/;
  if (!marker.test(html)) throw new Error(`City page ${area.slug} is missing its project list marker`);
  const items = projectsForArea(projects, area.slug).list.map(project => {
    const city = projectCity(project);
    return `<li><a href="/portfolio/${escapeHtml(project.slug)}">${escapeHtml(project.title + (city ? ` — ${city}, FL` : ''))}</a></li>`;
  }).join('');
  await writeFile(file, html.replace(marker, (_, before, after) => `<ul${before}data-city-projects="true"${after}>${items}</ul>`), 'utf8');
}

await writeFile(join(dist, 'sitemap.xml'), renderSitemap(projects, siteUrl), 'utf8');
console.log(`Generated SEO HTML for ${projects.length} published projects and sitemap.xml with ${staticUrls.length + projects.length} URLs.`);

await finalizeSeo(dist);

// Redirect old project links before resolving prerendered files or the 404 rule.
const htaccessPath = join(dist, '.htaccess');
let htaccess = await readFile(htaccessPath, 'utf8');
const redirects = Object.entries(legacyPortfolioRoutes).map(([from, to]) => `  RewriteRule ^portfolio/${from}/?$ /portfolio/${to} [R=301,L]`).join('\n');
htaccess = htaccess.replace('  RewriteBase /', '  RewriteBase /\n' + redirects);
await writeFile(htaccessPath, htaccess);

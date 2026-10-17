import { PHASE1_CITIES } from '../src/data/serviceAreasData.js';
import { blogPosts } from '../src/data/blogPosts.js';

export const staticUrls = [
  { path: '/blog' },
  ...blogPosts.map(post => ({ path: `/blog/${post.slug}`, lastmod: post.date })),
  { path: '/',                                    changefreq: 'weekly',  priority: '1.0' },
  { path: '/aboutus',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/portfolio',                           changefreq: 'weekly',  priority: '0.8' },
  { path: '/specialized',                         changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
  { path: '/resources',                           changefreq: 'monthly', priority: '0.7' },
  { path: '/contact',                             changefreq: 'monthly', priority: '0.8' },
  { path: '/faq',                                 changefreq: 'monthly', priority: '0.7' },
  { path: '/service-areas',                       changefreq: 'monthly', priority: '0.8' },
  ...PHASE1_CITIES.map(({ slug }) => ({ path: `/service-areas/${slug}`, changefreq: 'monthly', priority: '0.7' })),
  { path: '/services/condo-renovations', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/new-construction',           changefreq: 'monthly', priority: '0.9' },
  { path: '/services/remodeling',                 changefreq: 'monthly', priority: '0.9' },
  { path: '/services/additions',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/services/kitchens-bathrooms',         changefreq: 'monthly', priority: '0.9' },
  { path: '/services/flooring',                   changefreq: 'monthly', priority: '0.8' },
  { path: '/services/projectmanagement',          changefreq: 'monthly', priority: '0.7' },
];

const escapeXml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function renderSitemap(projects = [], siteUrl = 'https://www.uniquebuildingcontractors.com') {
  const entries = [...staticUrls, ...projects.filter(project => project?.slug).map(project => ({
    path: `/portfolio/${encodeURIComponent(project.slug)}`,
    // A construction completion date is not the page modification date.
    lastmod: project.updated_at,
  }))];
  const unique = new Map(entries.map(entry => [entry.path, entry]));
  const urls = [...unique.values()].map(({ path, lastmod }) => {
    const date = lastmod ? new Date(lastmod) : null;
    const modified = date && Number.isFinite(date.getTime()) && date <= new Date()
      ? `<lastmod>${date.toISOString().slice(0, 10)}</lastmod>` : '';
    return `  <url><loc>${escapeXml(siteUrl + path)}</loc>${modified}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

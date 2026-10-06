/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://www.uniquebuildingcontractors.com';
export const SITE_NAME = 'Unique Building Contractors';
export const DEFAULT_IMAGE = `${SITE_URL}/meta.jpg`;

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  alternateName: 'UBC',
  url: SITE_URL,
  logo: `${SITE_URL}/web-app-manifest-512x512.png`,
  image: DEFAULT_IMAGE,
  telephone: '+1-813-523-7828',
  email: 'sales@uniquebuildingcontractors.com',
  priceRange: '$$',
  areaServed: [
    'Tampa, FL', 'Riverview, FL', 'Clearwater, FL', 'St. Petersburg, FL', 'Brandon, FL',
    'Wesley Chapel, FL', 'Lutz, FL', 'Sarasota, FL', 'New Port Richey, FL',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tampa',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  identifier: {
    '@type': 'PropertyValue',
    name: 'Florida Certified Building Contractor License',
    value: 'CBC1268844',
  },
};

export function OrganizationSchema() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en-US',
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify([businessSchema, websiteSchema])}
    </script>
  );
}

export default function SEO({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  schema,
}) {
  const location = useLocation();
  const cleanPath = path ?? location.pathname;
  const canonical = `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '')}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const resolvedImage = image || DEFAULT_IMAGE;

  // index.html ships static <title>/<meta name="description">/<meta name="robots">
  // and a base <link rel="canonical"> for the first crawl. React 19 hoists tags
  // rendered in JSX but does NOT dedupe them against those static ones, so we
  // update the existing elements in place here instead of emitting duplicates.
  useEffect(() => {
    // React owns route schemas after mount; discard the build-time service schema.
    document.getElementById('ubc-service-schema')?.remove();
    document.title = fullTitle;

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [key, name] = attribute;
        element.setAttribute(key, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', ['name', 'description'], description);
    setMeta('meta[name="robots"]', ['name', 'robots'], robots);

    let canonicalEl = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    setMeta('meta[property="og:type"]', ['property', 'og:type'], type);
    setMeta('meta[property="og:url"]', ['property', 'og:url'], canonical);
    setMeta('meta[property="og:title"]', ['property', 'og:title'], fullTitle);
    setMeta('meta[property="og:description"]', ['property', 'og:description'], description);
    setMeta('meta[property="og:image"]', ['property', 'og:image'], resolvedImage);
    setMeta('meta[property="og:image:alt"]', ['property', 'og:image:alt'], `${SITE_NAME} construction and remodeling`);
    setMeta('meta[name="twitter:card"]', ['name', 'twitter:card'], 'summary_large_image');
    setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], fullTitle);
    setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], description);
    setMeta('meta[name="twitter:image"]', ['name', 'twitter:image'], resolvedImage);
  }, [canonical, description, fullTitle, resolvedImage, robots, type]);

  // <title>, <meta name="description|robots"> and <link rel="canonical"> are all
  // updated in place by the effect above (index.html ships static defaults for
  // the first crawl). Only the per-page JSON-LD is emitted here.
  return schema ? (
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  ) : null;
}

export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    url: `${SITE_URL}/services/${service.id}`,
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: { '@type': 'AdministrativeArea', name: 'Tampa Bay, Florida' },
    serviceType: service.title,
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/**
 * Generates composite JSON-LD array for a city landing page.
 * Includes: WebPage, BreadcrumbList, FAQPage.
 * Does NOT fabricate a physical address per city — uses real areaServed only.
 */
export function cityPageSchema({ city, state, slug, h1, faqs }) {
  const cityUrl = `${SITE_URL}/service-areas/${slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': cityUrl,
      name: h1,
      url: cityUrl,
      description: `Licensed remodeling contractor serving ${city}, ${state}. Kitchen, bathroom, flooring, additions and whole-home remodeling by Unique Building Contractors LLC (CBC1268844).`,
      about: { '@id': `${SITE_URL}/#business` },
      inLanguage: 'en-US',
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas' },
      { name: `${city}, ${state}`, path: `/service-areas/${slug}` },
    ]),
    ...(faqs && faqs.length ? [faqSchema(faqs)] : []),
  ];
}

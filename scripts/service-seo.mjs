import { serviceContent } from '../src/data/serviceContent.js';
import { confirmedServiceAreas, serviceSeoData } from '../src/data/serviceSeoData.js';

export { serviceContent };

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function serviceHtml(template, service, siteUrl) {
  const seo = serviceSeoData[service.id];
  if (!seo) throw new Error('Missing SEO content for service: ' + service.id);
  const canonical = siteUrl + '/services/' + service.id;
  const title = service.title + ' in Tampa Bay, FL | Unique Building Contractors';
  let html = template.replace(/<title>[^<]*<\/title>/i, '<title>' + escapeHtml(title) + '</title>');
  for (const [attribute, name, value] of [
    ['name', 'description', service.desc],
    ['property', 'og:title', title],
    ['property', 'og:description', service.desc],
    ['property', 'og:url', canonical],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', service.desc],
    ['name', 'twitter:url', canonical],
  ]) {
    const pattern = new RegExp('<meta\\s+' + attribute + '=["\x27]' + name + '["\x27][^>]*>', 'i');
    const tag = '<meta ' + attribute + '="' + name + '" content="' + escapeHtml(value) + '" />';
    html = pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', tag + '\n</head>');
  }
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i,
    '<link rel="canonical" href="' + escapeHtml(canonical) + '" />');

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: service.title, description: service.desc, url: canonical,
      provider: { '@id': siteUrl + '/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tampa Bay, Florida' },
      serviceType: service.title,
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: seo.faqs.map(({ question, answer }) => ({
        '@type': 'Question', name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Services' },
        { '@type': 'ListItem', position: 3, name: service.title, item: canonical },
      ],
    },
  ];
  const content = '<article data-service-seo-snapshot="' + escapeHtml(service.id) + '">' +
    '<h1>' + escapeHtml(service.title) + '</h1><p>' + escapeHtml(service.subtitle) + '</p>' +
    service.fullDesc.split('\n\n').map(p => '<p>' + escapeHtml(p) + '</p>').join('') +
    '<h2>Key Features</h2><ul>' + service.highlights.map(h => '<li>' + escapeHtml(h) + '</li>').join('') + '</ul>' +
    '<h2>' + escapeHtml(service.title) + ' Across Tampa Bay</h2><p>' + escapeHtml(seo.intro) + '</p>' +
    '<p>Unique Building Contractors is a Florida Certified Building Contractor (CBC1268844) serving ' +
    escapeHtml(confirmedServiceAreas.join(', ')) + ' and surrounding Tampa Bay communities.</p>' +
    '<h2>Frequently Asked Questions</h2>' + seo.faqs.map(({ question, answer }) =>
      '<details><summary>' + escapeHtml(question) + '</summary><p>' + escapeHtml(answer) + '</p></details>').join('') +
    '<nav aria-label="Related services"><a href="/portfolio">View related projects</a>' +
    serviceContent.filter(item => item.id !== service.id).slice(0, 3).map(item =>
      '<a href="/services/' + escapeHtml(item.id) + '">' + escapeHtml(item.title) + '</a>').join('') + '</nav>' +
    '<h2>Contact Unique Building Contractors</h2><a href="tel:8135237828">813-523-7828</a> ' +
    '<a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a></article>';
  return html.replace('</head>', '<script id="ubc-service-schema" type="application/ld+json">' +
    JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>\n</head>')
    .replace(/<div id="root">[\s\S]*?<\/div>/, () => '<div id="root">' + content + '</div>');
}
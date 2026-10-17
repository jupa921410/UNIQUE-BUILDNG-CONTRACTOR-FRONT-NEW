import { faqs } from '../src/data/faqs.js';

export function contactFaqHtml(template, path, siteUrl) {
  const isFaq = path === '/faq';
  const title = isFaq ? 'Frequently Asked Questions' : 'Contact Unique Building Contractors';
  const description = isFaq
    ? 'Answers to common questions about our Tampa Bay construction and remodeling services, consultations, estimates, project timelines, and client portal.'
    : 'Contact Unique Building Contractors to discuss your Tampa Bay construction or remodeling project. Call (813) 523-7828 or request a free consultation.';
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title}${isFaq ? ' | Unique Building Contractors' : ''}`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escape(fullTitle)}</title>`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`);
  for (const [key, value] of Object.entries({ description, 'og:title': fullTitle, 'og:description': description, 'og:url': url, 'twitter:title': fullTitle, 'twitter:description': description, 'twitter:url': url })) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i'), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  const schema = isFaq
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }
    : { '@context': 'https://schema.org', '@type': 'ContactPage', name: title, url, about: { '@id': `${siteUrl}/#business` } };
  const content = isFaq
    ? faqs.map(({ question, answer }) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('') + '<a href="/contact">Contact us</a>'
    : '<p>Discuss your Tampa Bay construction or remodeling project with our team.</p><a href="tel:+18135237828">(813) 523-7828</a><a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a><p>Request a free consultation using our contact form.</p><a href="/faq">Frequently Asked Questions</a>';
  return html.replace('</head>', `<script id="ubc-page-schema" type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root"><article><h1>${escape(title)}</h1><p>${escape(description)}</p>${content}</article></div>`);
}

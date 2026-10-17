import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { blogPosts } from '../src/data/blogPosts.js';

const site = 'https://www.uniquebuildingcontractors.com';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function pageHtml(template, { title, description, path, image = `${site}/meta.jpg`, schema, content, article = false }) {
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escape(title)} | Unique Building Contractors</title>`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${site}${path}" />`);
  const tags = { description, 'og:title': `${title} | Unique Building Contractors`, 'og:description': description, 'og:url': site + path, 'og:image': image, 'og:type': article ? 'article' : 'website', 'twitter:title': `${title} | Unique Building Contractors`, 'twitter:description': description, 'twitter:url': site + path, 'twitter:image': image };
  for (const [name, value] of Object.entries(tags)) {
    const attr = name.startsWith('og:') ? 'property' : 'name';
    const tag = `<meta ${attr}="${name}" content="${escape(value)}" />`;
    const regex = new RegExp(`<meta\\s+${attr}="${name}"[^>]*>`, 'i');
    html = regex.test(html) ? html.replace(regex, () => tag) : html.replace('</head>', `${tag}</head>`);
  }
  const data = JSON.stringify(schema).replaceAll('<', '\\u003c');
  return html.replace('</head>', `<link rel="alternate" type="application/rss+xml" title="The UBC Journal" href="${site}/blog/feed.xml" /><script id="ubc-page-schema" type="application/ld+json">${data}</script></head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root">${content}</div>`);
}

export async function writeBlogPages(dist) {
  const template = await readFile(join(dist, 'index.html'), 'utf8');
  await mkdir(join(dist, 'blog'), { recursive: true });
  const index = pageHtml(template, {
    title: 'Tampa Bay Remodeling & Construction Blog', path: '/blog',
    description: 'Practical Tampa Bay remodeling guides on kitchens, bathrooms, flooring, additions, budgets and planning. Find clear answers before your next project.',
    schema: { '@context': 'https://schema.org', '@type': 'Blog', name: 'The UBC Journal', url: `${site}/blog`, publisher: { '@id': `${site}/#business` } },
    content: `<main><h1>Thoughtful plans. Better places to live.</h1><p>Practical answers for building and remodeling in Tampa Bay.</p>${blogPosts.map(post => `<article><h2><a href="/blog/${post.slug}">${escape(post.title)}</a></h2><p>${escape(post.description)}</p></article>`).join('')}<a href="/contact">Request a consultation</a></main>`,
  });
  await writeFile(join(dist, 'blog', 'index.html'), index, 'utf8');
  for (const post of blogPosts) {
    const path = `/blog/${post.slug}`;
    const url = site + path;
    const schema = [
      { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': url, headline: post.title, description: post.description, datePublished: post.date, dateModified: post.date, image: `${site}/blog/images/${post.image}.webp`, author: { '@type': 'Organization', name: post.author, url: `${site}/aboutus` }, publisher: { '@id': `${site}/#business` }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, inLanguage: 'en-US', articleSection: post.category },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog` }, { '@type': 'ListItem', position: 3, name: post.title, item: url }] },
    ];
    const content = `<main><article><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Journal</a></nav><h1>${escape(post.title)}</h1><p>By <a href="/aboutus">${escape(post.author)}</a> · <time datetime="${post.date}">October 15, 2026</time></p><h2>The short answer</h2><p>${escape(post.answer)}</p><figure><img src="/blog/images/${post.image}.webp" alt="Architectural inspiration for home remodeling" width="960" height="640" /><figcaption>Architectural inspiration. This image is a concept, not a documented project.</figcaption></figure>${post.sections.map(section => `<section><h2>${escape(section.heading)}</h2>${section.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}</section>`).join('')}<h2>Your planning checklist</h2><ul>${post.checklist.map(item => `<li>${escape(item)}</li>`).join('')}</ul><h2>Common questions</h2>${post.faqs.map(faq => `<h3>${escape(faq.question)}</h3><p>${escape(faq.answer)}</p>`).join('')}${post.sources.length ? `<h2>Official resources</h2><ul>${post.sources.map(source => `<li><a href="${escape(source.url)}">${escape(source.title)}</a></li>`).join('')}</ul>` : ''}<nav aria-label="Next steps"><a href="/services/${post.service}">Related services</a> <a href="/service-areas/${post.city}">Local service area</a> <a href="/portfolio">Our portfolio</a> <a href="/contact">Discuss your project</a></nav><h2>Keep planning</h2>${blogPosts.filter(item => item.slug !== post.slug).slice(0, 3).map(item => `<p><a href="/blog/${item.slug}">${escape(item.title)}</a></p>`).join('')}</article></main>`;
    await mkdir(join(dist, 'blog', post.slug), { recursive: true });
    await writeFile(join(dist, 'blog', post.slug, 'index.html'), pageHtml(template, { title: post.title, description: post.description, path, image: `${site}/blog/images/${post.image}.webp`, article: true, schema, content }), 'utf8');
  }
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>The UBC Journal</title><link>${site}/blog</link><description>Construction and remodeling planning in Tampa Bay.</description><language>en-US</language>${blogPosts.map(post => `<item><title>${escape(post.title)}</title><link>${site}/blog/${post.slug}</link><guid isPermaLink="true">${site}/blog/${post.slug}</guid><description>${escape(post.description)}</description><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
  await writeFile(join(dist, 'blog', 'feed.xml'), feed, 'utf8');
  console.log(`Generated ${blogPosts.length} blog articles, blog index and RSS feed.`);
}
